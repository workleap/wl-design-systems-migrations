import { getLocalNameFromImport } from "../../utils/migration.js";
import type { Runtime } from "../../utils/types.js";
import type { TypeUsageData } from "../types.js";

/**
 * Performs type usage analysis to extract all usage of imported types
 */
export function performTypeAnalysis(
  runtime: Runtime,
  sourcePackage: string,
  options: {
    includeIgnoredList: boolean;
    project?: string;
    deep: boolean;
  }
): Record<string, TypeUsageData> {
  const { j, root, filePath } = runtime;
  const { project, deep } = options;

  // Store type usage with counts
  const typeUsageData: Record<string, TypeUsageData> = {};

  // Extract imported types
  const { importedTypes, potentialTypes } = extractImportedTypes(
    j,
    root,
    sourcePackage
  );

  // Helper function to increment usage count and track files
  const trackTypeUsage = (typeName: string, originalTypeName: string, node: any) => {
    // Initialize type data if not exists
    if (!typeUsageData[originalTypeName]) {
      typeUsageData[originalTypeName] = {
        count: {
          total: 0,
          ...project && { projects: {} }
        }
      };
    }

    const typeData = typeUsageData[originalTypeName];

    // Increment type usage count
    typeData.count.total++;
    if (project) {
      if (!typeData.count.projects) {
        typeData.count.projects = {};
      }
      typeData.count.projects[project] = (typeData.count.projects[project] || 0) + 1;
    }

    // If deep analysis is enabled, track repository URLs with line numbers
    if (deep && node.loc && node.loc.start && node.loc.start.line) {
      if (!typeData.files) {
        typeData.files = [];
      }

      // Try to generate repository URL with line number, fall back to file path with line number
      let urlOrPath = filePath;
      const repoInfo = runtime.getRepoInfo();
      const branch = runtime.getBranch();

      if (repoInfo && branch) {
        const repoUrl = buildRepoUrl(filePath, node.loc.start.line, repoInfo, branch);
        if (repoUrl) {
          urlOrPath = repoUrl;
        } else {
          urlOrPath = `${filePath}#L${node.loc.start.line}`;
        }
      } else {
        urlOrPath = `${filePath}#L${node.loc.start.line}`;
      }

      // Check if we already have this exact URL/path (including line numbers)
      if (!typeData.files.includes(urlOrPath)) {
        typeData.files.push(urlOrPath);
      }
    }
  };

  // Helper function to check if a type reference is from our source package
  const isTargetType = (typeReference: any): string | null => {
    if (typeReference.type === "TSTypeReference" && 
        typeReference.typeName && 
        typeReference.typeName.type === "Identifier") {
      const typeName = typeReference.typeName.name;
      const originalTypeName = importedTypes[typeName];
      if (originalTypeName && potentialTypes.has(typeName)) {
        return originalTypeName;
      }
    }

    return null;
  };

  // 1. Find variable declarations with type annotations
  root.find(j.VariableDeclarator).forEach(path => {
    if (path.value.id && path.value.id.type === "Identifier" && path.value.id.typeAnnotation) {
      const typeAnnotation = path.value.id.typeAnnotation;
      
      if (typeAnnotation.type === "TSTypeAnnotation") {
        const originalTypeName = isTargetType(typeAnnotation.typeAnnotation);
        if (originalTypeName) {
          trackTypeUsage(typeAnnotation.typeAnnotation.typeName.name, originalTypeName, path.value);
        }
      }
    }
  });

  // 2. Find function parameters with type annotations
  root.find(j.Function).forEach(funcPath => {
    funcPath.value.params.forEach(param => {
      if (param.type === "Identifier" && param.typeAnnotation && param.typeAnnotation.type === "TSTypeAnnotation") {
        const originalTypeName = isTargetType(param.typeAnnotation.typeAnnotation);
        if (originalTypeName) {
          trackTypeUsage(param.typeAnnotation.typeAnnotation.typeName.name, originalTypeName, param);
        }
      }
    });
  });

  // 3. Find arrow function parameters with type annotations
  root.find(j.ArrowFunctionExpression).forEach(funcPath => {
    funcPath.value.params.forEach(param => {
      if (param.type === "Identifier" && param.typeAnnotation && param.typeAnnotation.type === "TSTypeAnnotation") {
        const originalTypeName = isTargetType(param.typeAnnotation.typeAnnotation);
        if (originalTypeName) {
          trackTypeUsage(param.typeAnnotation.typeAnnotation.typeName.name, originalTypeName, param);
        }
      }
    });
  });

  // 4. Find type assertions (as Type)
  root.find(j.TSAsExpression).forEach(path => {
    const originalTypeName = isTargetType(path.value.typeAnnotation);
    if (originalTypeName) {
      trackTypeUsage(path.value.typeAnnotation.typeName.name, originalTypeName, path.value);
    }
  });

  // 5. Find type assertions (<Type>expression)
  root.find(j.TSTypeAssertion).forEach(path => {
    const originalTypeName = isTargetType(path.value.typeAnnotation);
    if (originalTypeName) {
      trackTypeUsage(path.value.typeAnnotation.typeName.name, originalTypeName, path.value);
    }
  });

  // 6. Find function return type annotations
  root.find(j.Function).forEach(funcPath => {
    if (funcPath.value.returnType && funcPath.value.returnType.type === "TSTypeAnnotation") {
      const originalTypeName = isTargetType(funcPath.value.returnType.typeAnnotation);
      if (originalTypeName) {
        trackTypeUsage(funcPath.value.returnType.typeAnnotation.typeName.name, originalTypeName, funcPath.value);
      }
    }
  });

  // 7. Find arrow function return type annotations
  root.find(j.ArrowFunctionExpression).forEach(funcPath => {
    if (funcPath.value.returnType && funcPath.value.returnType.type === "TSTypeAnnotation") {
      const originalTypeName = isTargetType(funcPath.value.returnType.typeAnnotation);
      if (originalTypeName) {
        trackTypeUsage(funcPath.value.returnType.typeAnnotation.typeName.name, originalTypeName, funcPath.value);
      }
    }
  });

  // 8. Find interface/type alias extends clauses
  root.find(j.TSInterfaceDeclaration).forEach(path => {
    if (path.value.extends) {
      path.value.extends.forEach(extend => {
        if (extend.expression && extend.expression.type === "Identifier") {
          const typeName = extend.expression.name;
          const originalTypeName = importedTypes[typeName];
          if (originalTypeName && potentialTypes.has(typeName)) {
            trackTypeUsage(typeName, originalTypeName, path.value);
          }
        }
      });
    }
  });

  // 9. Find class extends clauses
  root.find(j.ClassDeclaration).forEach(path => {
    if (path.value.superClass && path.value.superClass.type === "Identifier") {
      const typeName = path.value.superClass.name;
      const originalTypeName = importedTypes[typeName];
      if (originalTypeName && potentialTypes.has(typeName)) {
        trackTypeUsage(typeName, originalTypeName, path.value);
      }
    }
  });

  // 10. Find generic type parameters
  root.find(j.TSTypeReference).forEach(path => {
    // Handle generic types like Array<DivProps>, Promise<ButtonProps>, etc.
    if (path.value.typeParameters && path.value.typeParameters.params) {
      path.value.typeParameters.params.forEach(param => {
        const originalTypeName = isTargetType(param);
        if (originalTypeName) {
          trackTypeUsage(param.typeName.name, originalTypeName, path.value);
        }
      });
    }
  });

  return typeUsageData;
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
