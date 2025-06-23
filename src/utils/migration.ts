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

  const mappingItems = Array.isArray(componentMapping) ? componentMapping : [componentMapping];

  for (const mappingItem of mappingItems) {
    if (typeof mappingItem === "function") {
      if (!tag) {continue;} // Skip if tag is undefined. It only happens when we are using types, like DivProps. Function mapping will not be applied in this case.
      const result = mappingItem(tag, runtime);
      if (result) {
        return result;
      }
    } else {
      return mappingItem;
    }
  }

  return null;
}