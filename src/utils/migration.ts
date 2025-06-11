import type { ImportDefaultSpecifier, ImportNamespaceSpecifier, ImportSpecifier } from "jscodeshift";
import type { MapMetaData, Runtime } from "./types.ts";

export function getComponentPropsMetadata(
  componentName: string,
  mappings: MapMetaData
) {
  const component = mappings.components[componentName];
  if (!component) {
    return null;
  }

  const map = mappings.components[componentName];

  return typeof map === "string"
    ? {
      mappings: mappings.propsDefaults?.mappings,
      additions: mappings.propsDefaults?.additions
    }
    : {
      mappings: {
        ...mappings.propsDefaults?.mappings,
        ...map?.props?.mappings
      },
      additions: {
        ...mappings.propsDefaults?.additions,
        ...map?.props?.additions
      }
    };
}

export function getComponentTargetName(
  componentName: string,
  mappings: MapMetaData
) {
  const component = mappings.components[componentName];
  if (!component) {
    return null;
  }

  return typeof component === "string"
    ? component
    : component.to ?? componentName;
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
  const localName = importSpecifier.local?.name;
  
  return typeof localName === "string" ? localName : "";
}
