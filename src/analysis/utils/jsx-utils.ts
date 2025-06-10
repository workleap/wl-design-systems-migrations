import { execSync } from "child_process";
import { getLocalNameFromImport } from "../../utils/mapping.js";
import type { Runtime } from "../../utils/types.js";
import type { ComponentUsageData } from "../types.js";
import { shouldIgnoreProperty } from "./mapping-utils.js";

/**
 * Gets the repository URL and type from git remote for a specific file path
 */
function getRepoInfo(filePath: string): { url: string; type: "github" | "azure" | "unknown"; projectRoot: string } | null {
  try {
    // First, find the git repository root for this specific file
    const fileDir = filePath.includes("/") ? filePath.substring(0, filePath.lastIndexOf("/")) : ".";
    const projectRoot = execSync("git rev-parse --show-toplevel", { 
      encoding: "utf8",
      cwd: fileDir 
    }).trim();
    
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
      
      return { url: repoUrl, type: "github", projectRoot };
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
      
      return { url: repoUrl, type: "azure", projectRoot };
    }
    
    return { url: remoteUrl, type: "unknown", projectRoot };
  } catch {
    return null;
  }
}

/**
 * Gets the current git branch name for a specific file path
 */
function getCurrentBranch(filePath: string): string {
  try {
    const fileDir = filePath.includes("/") ? filePath.substring(0, filePath.lastIndexOf("/")) : ".";

    return execSync("git branch --show-current", { 
      encoding: "utf8",
      cwd: fileDir 
    }).trim() || "main";
  } catch {
    return "main";
  }
}

/**
 * Constructs a repository URL with line number for a specific file location
 */
function buildRepoUrl(filePath: string, lineNumber: number): string | null {
  const repoInfo = getRepoInfo(filePath);
  if (!repoInfo) {
    return null;
  }
  
  const branch = getCurrentBranch(filePath);
  
  // Get relative path from the specific project root
  try {
    const relativePath = filePath.replace(repoInfo.projectRoot + "/", "");
    
    // Build URL based on repository type
    switch (repoInfo.type) {
      case "github":
        return `${repoInfo.url}/blob/${branch}/${relativePath}#L${lineNumber}`;
      
      case "azure": {
        // Azure DevOps URL format: https://dev.azure.com/org/project/_git/repo?path=%2Fpath%2Fto%2Ffile&version=GBbranch&line=lineNumber&lineEnd=lineNumber&lineStartColumn=1&lineEndColumn=1
        const encodedPath = encodeURIComponent("/" + relativePath);

        return `${repoInfo.url}?path=${encodedPath}&version=GB${branch}&line=${lineNumber}&lineEnd=${lineNumber + 1}&lineStartColumn=1&lineEndColumn=1&lineStyle=plain&_a=contents`;
      }
      
      default:
        // For unknown repository types, return null to fall back to file path
        return filePath;
    }
  } catch {
    return null;
  }
}

/**
 * Extracts imported components from source imports
 */
export function extractImportedComponents(
  j: Runtime["j"],
  root: Runtime["root"],
  sourcePackage: string
): { importedComponents: Record<string, string>; potentialComponents: Set<string> } {
  // Find all import declarations from the source package
  const sourceImports = root.find(j.ImportDeclaration, {
    source: { value: sourcePackage }
  });

  // Extract locally imported component names
  const importedComponents: Record<string, string> = {};
  // Keep track of potential components (will be confirmed by JSX usage)
  const potentialComponents: Set<string> = new Set();

  // Process all import declarations
  sourceImports.forEach(path => {
    const specifiers = path.value.specifiers;
    if (specifiers) {
      specifiers.forEach(spec => {
        if (spec.type === "ImportDefaultSpecifier") {
          const localName = getLocalNameFromImport(spec);
          importedComponents[localName] = localName;
          potentialComponents.add(localName);
        } else if (spec.type === "ImportSpecifier") {
          const importedName = typeof spec.imported.name === "string" ? spec.imported.name : "";
          const localName = getLocalNameFromImport(spec);
          importedComponents[localName] = importedName;
          potentialComponents.add(localName);
        }
      });
    }
  });

  return { importedComponents, potentialComponents };
}

/**
 * Extracts property value from JSX attribute
 */
export function extractPropertyValue(
  attr: any,
  j: Runtime["j"]
): string {
  let propValue = "true"; // Default for boolean props
  if (attr.value) {
    if (attr.value.type === "Literal") {
      propValue = String(attr.value.value);
    } else if (attr.value.type === "JSXExpressionContainer") {
      const expression = attr.value.expression;
      propValue = j(expression).toSource();
    }
  }

  return propValue;
}

/**
 * Processes JSX attributes and updates component usage data
 */
export function processJSXAttributes(
  attributes: any[],
  componentData: ComponentUsageData,
  options: {
    j: Runtime["j"];
    includeIgnoredList: boolean;
    project?: string;
    deep: boolean;
    filePath: string;
  }
): void {
  const { j, includeIgnoredList, project, deep, filePath } = options;

  attributes.forEach(attr => {
    if (attr.type === "JSXAttribute" && attr.name.type === "JSXIdentifier") {
      const propName = attr.name.name;

      // Skip ignored properties if not including ignore list
      if (!includeIgnoredList && shouldIgnoreProperty(propName)) {
        return;
      }

      // Initialize prop data if not exists
      if (!componentData.props[propName]) {
        componentData.props[propName] = {
          usage: 0,
          values: {}
        };
      }

      const propData = componentData.props[propName];
      
      // Increment prop usage count
      propData.usage++;

      // Collect prop value
      const propValue = extractPropertyValue(attr, j);

      // Track value with project-specific counts
      const valuesObj = propData.values;
      if (!valuesObj[propValue]) {
        valuesObj[propValue] = { total: 0 };
      }

      const valueData = valuesObj[propValue];
      if (valueData) {
        // Increment total count
        valueData.total++;

        // If project is specified, also track project-specific count
        if (project) {
          if (!valueData.projects) {
            valueData.projects = {};
          }
          valueData.projects[project] = (valueData.projects[project] || 0) + 1;
        }

        // If deep analysis is enabled, track repository URLs with line numbers (fallback to file paths)
        if (deep) {
          if (!valueData.files) {
            valueData.files = [];
          }
          
          // Try to generate repository URL with line number, fall back to file path
          let urlOrPath = filePath;
          if (attr.loc && attr.loc.start && attr.loc.start.line) {
            const repoUrl = buildRepoUrl(filePath, attr.loc.start.line);

            if (repoUrl) {
              urlOrPath = repoUrl;
            }
          }
          
          // Check if we already have this exact URL/path (including line numbers)
          if (!valueData.files.includes(urlOrPath)) {
            valueData.files.push(urlOrPath);
          }
        }
      }
    }
  });
}
