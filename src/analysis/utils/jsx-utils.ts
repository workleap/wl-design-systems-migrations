import { getLocalNameFromImport } from "../../utils/migration.ts";
import type { Runtime } from "../../utils/types.js";
import type { ComponentUsageData } from "../types.js";
import { shouldIgnoreProperty } from "./mapping-utils.js";

/**
 * Constructs a repository URL with line number for a specific file location
 */
function buildRepoUrl(filePath: string, lineNumber: number, repoInfo: { url: string; type: "github" | "azure" | "unknown"; projectRoot: string }, branch: string): string | null {
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
    getRepoInfo: Runtime["getRepoInfo"];
    getBranch: Runtime["getBranch"];
  }
): void {
  const { j, includeIgnoredList, project, deep, filePath, getRepoInfo, getBranch } = options;

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
        valuesObj[propValue] = { usage: { total: 0 } };
      }

      const valueData = valuesObj[propValue];
      if (valueData) {
        // Increment total count
        valueData.usage.total++;

        // If project is specified, also track project-specific count
        if (project) {
          if (!valueData.usage.projects) {
            valueData.usage.projects = {};
          }
          valueData.usage.projects[project] = (valueData.usage.projects[project] || 0) + 1;
        }

        // If deep analysis is enabled, track repository URLs with line numbers (fallback to file paths)
        if (deep) {
          if (!valueData.files) {
            valueData.files = [];
          }
          
          // Try to generate repository URL with line number, fall back to file path with line number
          let urlOrPath = filePath;
          if (attr.loc && attr.loc.start && attr.loc.start.line) {
            // Lazy-load repository information only when needed
            const repoInfo = getRepoInfo();
            const branch = getBranch();
            
            if (repoInfo && branch) {
              const repoUrl = buildRepoUrl(filePath, attr.loc.start.line, repoInfo, branch);

              if (repoUrl) {
                urlOrPath = repoUrl;
              } else {
                // Fallback: add line number to file path
                urlOrPath = `${filePath}#L${attr.loc.start.line}`;
              }
            } else {
              // No repository info: add line number to file path
              urlOrPath = `${filePath}#L${attr.loc.start.line}`;
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
