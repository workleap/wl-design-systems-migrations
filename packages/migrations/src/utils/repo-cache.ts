import { execSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

// File-based cache for git repository information to persist across jscodeshift file processes
const CACHE_DIR = join(tmpdir(), "ds-migrations-cache");
const REPO_CACHE_FILE = join(CACHE_DIR, "repo-info.json");
const BRANCH_CACHE_FILE = join(CACHE_DIR, "branch-info.json");

// In-memory cache as secondary layer
const repoInfoCache = new Map<string, { url: string; type: "github" | "azure" | "unknown"; projectRoot: string } | null>();
const branchCache = new Map<string, string>();

/**
 * Ensures the cache directory exists
 */
function ensureCacheDir(): void {
  try {
    mkdirSync(CACHE_DIR, { recursive: true });
  } catch {
    // Directory might already exist or we don't have permissions
  }
}

/**
 * Loads repository info from file cache
 */
function loadRepoCache(): Map<string, { url: string; type: "github" | "azure" | "unknown"; projectRoot: string } | null> {
  try {
    if (existsSync(REPO_CACHE_FILE)) {
      const data = JSON.parse(readFileSync(REPO_CACHE_FILE, "utf8"));

      return new Map(data);
    }
  } catch {
    // Cache file is corrupted or doesn't exist
  }

  return new Map();
}

/**
 * Saves repository info to file cache
 */
function saveRepoCache(cache: Map<string, { url: string; type: "github" | "azure" | "unknown"; projectRoot: string } | null>): void {
  try {
    ensureCacheDir();
    writeFileSync(REPO_CACHE_FILE, JSON.stringify(Array.from(cache.entries())));
  } catch {
    // Failed to write cache, continue without caching
  }
}

/**
 * Loads branch info from file cache
 */
function loadBranchCache(): Map<string, string> {
  try {
    if (existsSync(BRANCH_CACHE_FILE)) {
      const data = JSON.parse(readFileSync(BRANCH_CACHE_FILE, "utf8"));

      return new Map(data);
    }
  } catch {
    // Cache file is corrupted or doesn't exist
  }

  return new Map();
}

/**
 * Saves branch info to file cache
 */
function saveBranchCache(cache: Map<string, string>): void {
  try {
    ensureCacheDir();
    writeFileSync(BRANCH_CACHE_FILE, JSON.stringify(Array.from(cache.entries())));
  } catch {
    // Failed to write cache, continue without caching
  }
}

/**
 * Gets the repository URL and type from git remote for a specific file path
 */
function getRepoInfo(filePath: string): { url: string; type: "github" | "azure" | "unknown"; projectRoot: string } | null {
  try {
    // First, find the git repository root for this specific file
    const fileDir = filePath.includes("/") ? filePath.substring(0, filePath.lastIndexOf("/")) : ".";
    
    // Check in-memory cache first
    if (repoInfoCache.has(fileDir)) {
      return repoInfoCache.get(fileDir) || null;
    }

    // Load file cache if in-memory cache is empty
    if (repoInfoCache.size === 0) {
      const fileCache = loadRepoCache();

      for (const [key, value] of fileCache) {
        repoInfoCache.set(key, value);
      }

      // Check again after loading file cache
      if (repoInfoCache.has(fileDir)) {
        return repoInfoCache.get(fileDir) || null;
      }
    }
    
    const projectRoot = execSync("git rev-parse --show-toplevel", { 
      encoding: "utf8",
      cwd: fileDir 
    }).trim();
    
    // Check if we already have cached info for this project root
    const existingCacheEntry = Array.from(repoInfoCache.entries()).find(([, value]) => value?.projectRoot === projectRoot);

    if (existingCacheEntry) {
      // Cache this directory path with the same repo info
      const repoInfo = existingCacheEntry[1];

      repoInfoCache.set(fileDir, repoInfo);
      
      return repoInfo;
    }
    
    // Get the remote URL for this specific repository
    let remoteUrl = execSync("git remote get-url origin", { 
      encoding: "utf8",
      cwd: projectRoot 
    }).trim();

    // we need tie sed to remove the username if there is any. Azure Devops have it which is not required.
    // Remove `username@` part (e.g., sharegate@)
    remoteUrl = remoteUrl.replace(/^https:\/\/[^@]+@/, "https://");
    
    // GitHub repository
    if (remoteUrl.includes("github.com")) {
      let repoUrl = remoteUrl;
      
      // Convert SSH format to HTTPS
      if (repoUrl.startsWith("git@github.com:")) {
        repoUrl = repoUrl.replace("git@github.com:", "https://github.com/");
      }
      
      // Remove .git suffix
      repoUrl = repoUrl.replace(/\.git$/, "");
      
      const githubRepoInfo = { url: repoUrl, type: "github" as const, projectRoot };

      repoInfoCache.set(fileDir, githubRepoInfo);
      saveRepoCache(repoInfoCache);
      
      return githubRepoInfo;
    }
    
    // Azure DevOps repository
    if (remoteUrl.includes("dev.azure.com") || remoteUrl.includes("visualstudio.com")) {
      let repoUrl = remoteUrl;
      
      // Convert SSH format to HTTPS for Azure DevOps
      if (repoUrl.startsWith("git@ssh.dev.azure.com:")) {
        // SSH format: git@ssh.dev.azure.com:v3/org/project/repo
        repoUrl = repoUrl.replace("git@ssh.dev.azure.com:v3/", "https://dev.azure.com/");
      } else if (repoUrl.startsWith("git@vs-ssh.visualstudio.com:")) {
        // Old SSH format: git@vs-ssh.visualstudio.com:v3/org/project/repo
        const parts = repoUrl.replace("git@vs-ssh.visualstudio.com:v3/", "").split("/");

        if (parts.length >= 3) {
          repoUrl = `https://${parts[0]}.visualstudio.com/${parts[1]}/_git/${parts[2]}`;
        }
      }
      
      // Remove .git suffix
      repoUrl = repoUrl.replace(/\.git$/, "");
      
      const azureRepoInfo = { url: repoUrl, type: "azure" as const, projectRoot };

      repoInfoCache.set(fileDir, azureRepoInfo);
      saveRepoCache(repoInfoCache);
      
      return azureRepoInfo;
    }
    
    const unknownRepoInfo = { url: remoteUrl, type: "unknown" as const, projectRoot };

    repoInfoCache.set(fileDir, unknownRepoInfo);
    saveRepoCache(repoInfoCache);
    
    return unknownRepoInfo;
  } catch {
    // Cache null result to avoid repeated failed attempts
    const fileDir = filePath.includes("/") ? filePath.substring(0, filePath.lastIndexOf("/")) : ".";

    repoInfoCache.set(fileDir, null);
    saveRepoCache(repoInfoCache);
    
    return null;
  }
}

/**
 * Gets the current git branch name for a specific file path
 */
function getCurrentBranch(filePath: string): string {
  try {
    const fileDir = filePath.includes("/") ? filePath.substring(0, filePath.lastIndexOf("/")) : ".";
    
    // Check in-memory cache first to avoid expensive git operations
    if (branchCache.has(fileDir)) {
      return branchCache.get(fileDir) || "main";
    }

    // Load file cache if in-memory cache is empty
    if (branchCache.size === 0) {
      const fileCache = loadBranchCache();

      for (const [key, value] of fileCache) {
        branchCache.set(key, value);
      }

      // Check again after loading file cache
      if (branchCache.has(fileDir)) {
        return branchCache.get(fileDir) || "main";
      }
    }

    const branch = execSync("git branch --show-current", { 
      encoding: "utf8",
      cwd: fileDir 
    }).trim() || "main";
    
    // Cache the result both in memory and file
    branchCache.set(fileDir, branch);
    saveBranchCache(branchCache);
    
    return branch;
  } catch {
    const defaultBranch = "main";
    // Cache the default to avoid repeated failed attempts
    const fileDir = filePath.includes("/") ? filePath.substring(0, filePath.lastIndexOf("/")) : ".";

    branchCache.set(fileDir, defaultBranch);
    saveBranchCache(branchCache);
    
    return defaultBranch;
  }
}

/**
 * Populates repository information for a runtime context
 * This should be called once per file to avoid repeated git operations
 */
export function populateRepoInfo(filePath: string): { repoInfo: { url: string; type: "github" | "azure" | "unknown"; projectRoot: string } | null; branch: string } {
  const repoInfo = getRepoInfo(filePath);
  const branch = getCurrentBranch(filePath);
  
  return { repoInfo, branch };
}

/**
 * Creates lazy-loaded repository information getters for a specific file path
 * These getters use singleton pattern - they fetch the data only once when first accessed
 */
export function createLazyRepoInfo(filePath: string): {
  getRepoInfo: () => { url: string; type: "github" | "azure" | "unknown"; projectRoot: string } | null;
  getBranch: () => string;
} {
  let cachedRepoInfo: { url: string; type: "github" | "azure" | "unknown"; projectRoot: string } | null | undefined = undefined;
  let cachedBranch: string | undefined = undefined;

  return {
    getRepoInfo: () => {
      if (cachedRepoInfo === undefined) {
        cachedRepoInfo = getRepoInfo(filePath);
      }

      return cachedRepoInfo;
    },
    getBranch: () => {
      if (cachedBranch === undefined) {
        cachedBranch = getCurrentBranch(filePath);
      }

      return cachedBranch;
    }
  };
}
