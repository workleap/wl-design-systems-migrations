import { getLocalNameFromImport } from "../../utils/migration.js";
import type { Runtime } from "../../utils/types.js";
import type { FunctionUsageData } from "../types.js";

/**
 * Performs function call analysis to extract function usage data
 */
export function performFunctionAnalysis(
  runtime: Runtime,
  sourcePackage: string,
  options: {
    includeIgnoredList: boolean;
    project?: string;
    deep: boolean;
  }
): Record<string, FunctionUsageData> {
  const { j, root, filePath } = runtime;
  const { project, deep } = options;

  // Store function usage with counts
  const functionUsageData: Record<string, FunctionUsageData> = {};

  // Extract imported functions
  const { importedFunctions, potentialFunctions } = extractImportedFunctions(
    j,
    root,
    sourcePackage
  );

  // Find all function calls and track usage
  root.find(j.CallExpression).forEach(path => {
    const callee = path.value.callee;
    let functionName: string | null = null;

    // Handle direct function calls (e.g., useResponsive())
    if (callee.type === "Identifier") {
      functionName = callee.name;
    } else if (callee.type === "MemberExpression" && callee.property.type === "Identifier") {
      // Handle member expressions (e.g., object.method())  
      functionName = callee.property.name;
    }

    if (functionName) {
      const originalFunctionName = importedFunctions[functionName];
      
      // Only process functions that were imported from our source package
      if (originalFunctionName && potentialFunctions.has(functionName)) {
        // Initialize function data if not exists
        if (!functionUsageData[originalFunctionName]) {
          functionUsageData[originalFunctionName] = {
            count: {
              total: 0,
              ...project && { projects: {} }
            },
            values: {}
          };
        }

        const functionData = functionUsageData[originalFunctionName];

        // Increment function usage count
        functionData.count.total++;
        if (project) {
          if (!functionData.count.projects) {
            functionData.count.projects = {};
          }
          functionData.count.projects[project] = (functionData.count.projects[project] || 0) + 1;
        }

        // Extract the function call signature (function name + arguments)
        const callSignature = extractCallSignature(path, j);

        // Track call signature usage
        if (!functionData.values[callSignature]) {
          functionData.values[callSignature] = {
            usage: {
              total: 0,
              ...project && { projects: {} }
            }
          };
        }

        const callData = functionData.values[callSignature];
        callData.usage.total++;

        if (project) {
          if (!callData.usage.projects) {
            callData.usage.projects = {};
          }
          callData.usage.projects[project] = (callData.usage.projects[project] || 0) + 1;
        }

        // If deep analysis is enabled, track file locations
        if (deep) {
          if (!callData.files) {
            callData.files = [];
          }
          
          let urlOrPath = filePath;
          if (path.value.loc && path.value.loc.start && path.value.loc.start.line) {
            // Lazy-load repository information only when needed
            const repoInfo = runtime.getRepoInfo();
            const branch = runtime.getBranch();
            
            if (repoInfo && branch) {
              const repoUrl = buildRepoUrl(filePath, path.value.loc.start.line, repoInfo, branch);
              if (repoUrl) {
                urlOrPath = repoUrl;
              } else {
                urlOrPath = `${filePath}#L${path.value.loc.start.line}`;
              }
            } else {
              urlOrPath = `${filePath}#L${path.value.loc.start.line}`;
            }
          }
          
          if (!callData.files.includes(urlOrPath)) {
            callData.files.push(urlOrPath);
          }
        }
      }
    }
  });

  return functionUsageData;
}

/**
 * Extracts imported functions from source imports
 */
function extractImportedFunctions(
  j: Runtime["j"],
  root: Runtime["root"],
  sourcePackage: string 
): { importedFunctions: Record<string, string>; potentialFunctions: Set<string> } {
  // Find all import declarations from the source package
  const sourceImports = root.find(j.ImportDeclaration, {
    source: { value: sourcePackage }
  });

  // Extract locally imported function names
  const importedFunctions: Record<string, string> = {};
  // Keep track of potential functions (will be confirmed by usage)
  const potentialFunctions: Set<string> = new Set();

  // Process all import declarations
  sourceImports.forEach(path => {
    const specifiers = path.value.specifiers;
    if (specifiers) {
      specifiers.forEach(spec => {
        if (spec.type === "ImportDefaultSpecifier") {
          const localName = getLocalNameFromImport(spec);          
          importedFunctions[localName] = localName;
          potentialFunctions.add(localName);
        } else if (spec.type === "ImportSpecifier") {
          const importedName = typeof spec.imported.name === "string" ? spec.imported.name : "";
          const localName = getLocalNameFromImport(spec);
          importedFunctions[localName] = importedName;
          potentialFunctions.add(localName);
        }
      });
    }
  });

  return { importedFunctions, potentialFunctions };
}

/**
 * Extracts the call signature of a function call (function name + stringified arguments)
 */
function extractCallSignature(
  path: any,
  j: Runtime["j"]
): string {
  const callee = path.value.callee;
  const args = path.value.arguments;
  
  let functionName = "";
  
  // Extract function name
  if (callee.type === "Identifier") {
    functionName = callee.name;
  } else if (callee.type === "MemberExpression" && callee.property.type === "Identifier") {
    functionName = callee.property.name;
  }

  // Convert arguments to string representation
  let argsString = "";
  if (args && args.length > 0) {
    const argStrings = args.map((arg: any) => j(arg).toSource());
    argsString = argStrings.join(", ");
  }

  return `${functionName}(${argsString})`;
}

/**
 * Constructs a repository URL with line number for a specific file location
 */
function buildRepoUrl(
  filePath: string, 
  lineNumber: number, 
  repoInfo: { url: string; type: "github" | "azure" | "unknown"; projectRoot: string }, 
  branch: string
): string | null {
  if (!repoInfo) {
    return null;
  }
  
  // Get relative path from the specific project root
  try {
    const relativePath = filePath.replace(repoInfo.projectRoot + "/", "");
    
    // Build URL based on repository type
    switch (repoInfo.type) {
      case "github":
        return `${repoInfo.url}/blob/${branch}/${relativePath}#L${lineNumber}`;
      
      case "azure": {
        // Azure DevOps URL format
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
