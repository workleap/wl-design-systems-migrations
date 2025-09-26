import { getLocalNameFromImport } from "../../utils/migration.ts";
import type { Runtime } from "../../utils/types.ts";
import type { ObjectUsageData } from "../types.ts";

/**
 * Performs object literal analysis to extract object type usage data
 */
export function performObjectAnalysis(
  runtime: Runtime,
  sourcePackage: string,
  options: {
    includeIgnoredList: boolean;
    project?: string;
    deep: boolean;
  }
): Record<string, ObjectUsageData> {
  const { j, root, filePath } = runtime;
  const { project, deep } = options;

  // Store object usage with counts
  const objectUsageData: Record<string, ObjectUsageData> = {};

  // Extract imported types
  const { importedTypes, potentialTypes } = extractImportedTypes(
    j,
    root,
    sourcePackage
  );

  // Find all variable declarations with type annotations and object expressions
  root.find(j.VariableDeclarator).forEach(path => {
    if (path.value.id && path.value.id.type === "Identifier" && path.value.id.typeAnnotation) {
      const typeAnnotation = path.value.id.typeAnnotation;
      
      // Check if it's a type reference annotation
      if (typeAnnotation.type === "TSTypeAnnotation" && 
          typeAnnotation.typeAnnotation.type === "TSTypeReference" &&
          typeAnnotation.typeAnnotation.typeName.type === "Identifier") {
        const typeName = typeAnnotation.typeAnnotation.typeName.name;
        const originalTypeName = importedTypes[typeName];
        
        // Only process types that were imported from our source package
        if (originalTypeName && potentialTypes.has(typeName) && 
            path.value.init && path.value.init.type === "ObjectExpression") {
          // Initialize object data if not exists
          if (!objectUsageData[originalTypeName]) {
            objectUsageData[originalTypeName] = {
              count: {
                total: 0,
                ...project && { projects: {} }
              },
              props: {}
            };
          }

          const objectData = objectUsageData[originalTypeName];

          // Increment object usage count
          objectData.count.total++;
          if (project) {
            if (!objectData.count.projects) {
              objectData.count.projects = {};
            }
            objectData.count.projects[project] = (objectData.count.projects[project] || 0) + 1;
          }

          // Process object properties
          const objectExpression = path.value.init;
          processObjectProperties(objectExpression.properties, objectData, {
            j,
            project,
            deep,
            filePath,
            getRepoInfo: runtime.getRepoInfo,
            getBranch: runtime.getBranch
          });
        }
      }
    }
  });

  // Also find object expressions in function parameters with type annotations
  root.find(j.Function).forEach(funcPath => {
    funcPath.value.params.forEach(param => {
      if (param.type === "Identifier" && param.typeAnnotation &&
          param.typeAnnotation.type === "TSTypeAnnotation" &&
          param.typeAnnotation.typeAnnotation.type === "TSTypeReference" &&
          param.typeAnnotation.typeAnnotation.typeName.type === "Identifier") {
        const typeName = param.typeAnnotation.typeAnnotation.typeName.name;
        const originalTypeName = importedTypes[typeName];
        
        if (originalTypeName && potentialTypes.has(typeName)) {
          // Look for calls to this function with object literals
          root.find(j.CallExpression).forEach(callPath => {
            if (callPath.value.callee.type === "Identifier" && 
                callPath.value.callee.name === funcPath.value.id?.name) {
              callPath.value.arguments.forEach(arg => {
                if (arg.type === "ObjectExpression") {
                  // Initialize object data if not exists
                  if (!objectUsageData[originalTypeName]) {
                    objectUsageData[originalTypeName] = {
                      count: {
                        total: 0,
                        ...project && { projects: {} }
                      },
                      props: {}
                    };
                  }

                  const objectData = objectUsageData[originalTypeName];

                  // Increment object usage count
                  objectData.count.total++;
                  if (project) {
                    if (!objectData.count.projects) {
                      objectData.count.projects = {};
                    }
                    objectData.count.projects[project] = (objectData.count.projects[project] || 0) + 1;
                  }

                  // Process object properties
                  processObjectProperties(arg.properties, objectData, {
                    j,
                    project,
                    deep,
                    filePath,
                    getRepoInfo: runtime.getRepoInfo,
                    getBranch: runtime.getBranch
                  });
                }
              });
            }
          });
        }
      }
    });
  });

  return objectUsageData;
}

/**
 * Extracts imported types from source imports
 */
function extractImportedTypes(
  j: Runtime["j"],
  root: Runtime["root"],
  sourcePackage: string 
): { importedTypes: Record<string, string>; potentialTypes: Set<string> } {
  // Find all import declarations from the source package
  const sourceImports = root.find(j.ImportDeclaration, {
    source: { value: sourcePackage }
  });

  // Extract locally imported type names
  const importedTypes: Record<string, string> = {};
  // Keep track of potential types (will be confirmed by usage)
  const potentialTypes: Set<string> = new Set();

  // Process all import declarations
  sourceImports.forEach(path => {
    const specifiers = path.value.specifiers;
    if (specifiers) {
      specifiers.forEach(spec => {
        if (spec.type === "ImportDefaultSpecifier") {
          const localName = getLocalNameFromImport(spec);          
          importedTypes[localName] = localName;
          potentialTypes.add(localName);
        } else if (spec.type === "ImportSpecifier") {
          const importedName = typeof spec.imported.name === "string" ? spec.imported.name : "";
          const localName = getLocalNameFromImport(spec);
          importedTypes[localName] = importedName;
          potentialTypes.add(localName);
        }
      });
    }
  });

  return { importedTypes, potentialTypes };
}

/**
 * Processes object properties and updates object usage data
 */
function processObjectProperties(
  properties: any[],
  objectData: ObjectUsageData,
  options: {
    j: Runtime["j"];
    project?: string;
    deep: boolean;
    filePath: string;
    getRepoInfo: Runtime["getRepoInfo"];
    getBranch: Runtime["getBranch"];
  }
): void {
  const { j, project, deep, filePath, getRepoInfo, getBranch } = options;

  properties.forEach(prop => {
    if ((prop.type === "ObjectProperty" || prop.type === "Property") && 
        prop.key && prop.key.type === "Identifier") {
      const propName = prop.key.name;

      // Initialize prop data if not exists
      if (!objectData.props[propName]) {
        objectData.props[propName] = {
          usage: 0,
          values: {}
        };
      }

      const propData = objectData.props[propName];
      
      // Increment prop usage count
      propData.usage++;

      // Collect prop value
      const propValue = extractPropertyValue(prop, j);

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
          if (prop.loc && prop.loc.start && prop.loc.start.line) {
            // Lazy-load repository information only when needed
            const repoInfo = getRepoInfo();
            const branch = getBranch();
            
            if (repoInfo && branch) {
              const repoUrl = buildRepoUrl(filePath, prop.loc.start.line, repoInfo, branch);

              if (repoUrl) {
                urlOrPath = repoUrl;
              } else {
                // Fallback: add line number to file path
                urlOrPath = `${filePath}#L${prop.loc.start.line}`;
              }
            } else {
              // No repository info: add line number to file path
              urlOrPath = `${filePath}#L${prop.loc.start.line}`;
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

/**
 * Extracts property value from object property
 */
function extractPropertyValue(
  prop: any,
  j: Runtime["j"]
): string {
  if (prop.value) {
    if (prop.value.type === "Literal") {
      return String(prop.value.value);
    } else {
      return j(prop.value).toSource();
    }
  }

  return "undefined";
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
