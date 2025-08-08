import type { ASTPath, ImportDefaultSpecifier, ImportNamespaceSpecifier, ImportSpecifier, JSXOpeningElement } from "jscodeshift";
import type { ComponentMapMetaData, Runtime } from "./types.ts";

export function getFullComponentMappings(
  map: ComponentMapMetaData,
  { mappings }: Runtime
): Exclude< ComponentMapMetaData, string> {
  return typeof map === "string"
    ? {
      props: {
        mappings: mappings.propsDefaults?.mappings,
        additions: mappings.propsDefaults?.additions
      }
    }
    : {
      ...map,
      props: {
        ...map.props,
        mappings: {
          ...mappings.propsDefaults?.mappings,
          ...map?.props?.mappings
        },
        additions: {
          ...mappings.propsDefaults?.additions,
          ...map?.props?.additions
        } 
      }
    };
}

export function getComponentTargetName(  
  mappings: ComponentMapMetaData
) {
  return typeof mappings === "string"
    ? mappings
    : mappings.to ?? mappings;
}

export function getTodoComment(
  comment: string,
  { j }: Runtime,
  leading = false
) {
  return j.commentBlock(` Migration TODO: ${comment} `, leading, !leading);
}

export function getLocalNameFromImport(  
  importSpecifier: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier
): string {
  if (importSpecifier.local && typeof importSpecifier.local.name === "string") {
    return importSpecifier.local.name;
  }

  // For ImportSpecifier, fall back to the imported name
  if (importSpecifier.type === "ImportSpecifier" && importSpecifier.imported) {
    if (typeof importSpecifier.imported.name === "string") {
      return importSpecifier.imported.name;
    }
  }

  // For ImportDefaultSpecifier, the local name should always exist
  if (importSpecifier.type === "ImportDefaultSpecifier") {
    throw new Error("Invalid default import specifier: missing local name");
  }

  // For ImportNamespaceSpecifier, the local name should always exist
  if (importSpecifier.type === "ImportNamespaceSpecifier") {
    throw new Error("Invalid namespace import specifier: missing local name");
  }

  return "";
}

export function resolveComponentMapping(
  componentName: string,
  tag: ASTPath<JSXOpeningElement> | undefined,
  runtime: Runtime
): ComponentMapMetaData | null {
  const { mappings } = runtime;
  const componentMapping = mappings.components[componentName];

  if (!componentMapping) {
    return null;
  }

  if (!Array.isArray(componentMapping)) {
    return componentMapping;
  }

  if (tag) { // When we are using types, like DivProps, function mapping will not be applied in this case.
    for (const mappingItem of componentMapping) {
      const result = mappingItem(tag, runtime);
      if (result) {
        return result;
      }
    }
  }

  return null;
}

export function tryToGetStaticMapping(
  componentName: string,
  runtime: Runtime
): ComponentMapMetaData | undefined {
  const { mappings } = runtime;
  const componentMapping = mappings.components[componentName];

  if (componentMapping && !Array.isArray(componentMapping)) {
    return componentMapping;
  }
}

/**
 * Extracts the base indentation from the first child element of a given type
 * Useful for maintaining proper JSX formatting when restructuring components
 */
export function extractBaseIndentation(jsxElement: any, childElementName: string): string {
  const firstChildIndex = jsxElement.children.findIndex((child: any) =>
    child.type === "JSXElement" && 
    child.openingElement?.name?.name === childElementName
  );
  
  let baseIndent = "\n        "; // Default indentation
  if (firstChildIndex > 0 && 
      jsxElement.children[firstChildIndex - 1]?.type === "JSXText") {
    baseIndent = jsxElement.children[firstChildIndex - 1].value;
  }
  
  return baseIndent;
}

/**
 * Creates a properly indented JSX element list with text nodes
 * Handles the spacing between elements within a container
 */
export function createIndentedElementList(elements: any[], baseIndent: string, childIndent: string, runtime: Runtime) {
  const { j } = runtime;
  const result = [];
  
  for (let i = 0; i < elements.length; i++) {
    // Add indentation before each element
    if (i === 0) {
      result.push(j.jsxText(childIndent));
    }
    result.push(elements[i]);
    
    // Add indentation after each element except the last one
    if (i < elements.length - 1) {
      result.push(j.jsxText(childIndent));
    }
  }
  
  return result;
}

/**
 * Creates the final children array with proper indentation
 * Handles the overall structure with a main element and additional sibling elements
 */
export function createFinalChildrenArray(mainElement: any, siblingElements: any[], baseIndent: string, runtime: Runtime) {
  const { j } = runtime;
  
  const newChildren = [
    j.jsxText(baseIndent),
    mainElement
  ];
  
  // Add sibling elements with proper indentation
  for (const element of siblingElements) {
    newChildren.push(j.jsxText(baseIndent));
    newChildren.push(element);
  }
  
  // Add final indentation
  newChildren.push(j.jsxText(baseIndent.replace(/ {2}$/, "")));
  
  return newChildren;
}

export function resolveAliasLocalNames(componentName: string, runtime: Runtime): string[] {
  if (!runtime.aliases) {
    return [];
  }

  const aliasesForComponent = runtime.aliases[componentName];
  if (!aliasesForComponent) {
    return [];
  }

  const directAliases = Array.isArray(aliasesForComponent) ? aliasesForComponent : [aliasesForComponent];
  
  // Find all local names for these aliases (including 'as' aliases)
  const allAliasNames = new Set(directAliases);
  
  directAliases.forEach(aliasName => {
    const localNamesForAlias = getAllLocalNamesForComponent(aliasName, runtime);
    localNamesForAlias.forEach(name => allAliasNames.add(name));
  });
  
  return Array.from(allAliasNames);
}

/**
 * Gets all local names for a component from imports, including 'as' aliases
 * For example: import { PrivateButton as PB } would return ['PrivateButton', 'PB']
 */
function getAllLocalNamesForComponent(componentName: string, runtime: Runtime): string[] {
  const { j, root } = runtime;
  const results: string[] = [];

  // Look through all import declarations (not just the source package)
  const allImportDeclarations = root.find(j.ImportDeclaration);

  allImportDeclarations.forEach(path => {
    const specifiers = path.node.specifiers || [];
    specifiers.forEach(specifier => {
      if (
        j.ImportSpecifier.check(specifier) &&
        specifier.imported.name === componentName
      ) {
        const localName = getLocalNameFromImport(specifier);
        if (localName && localName !== componentName) {
          results.push(localName);
        }
      }
    });
  });

  return results;
}