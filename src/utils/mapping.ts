import { MapMetaData } from "./types.js";

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
        additions: mappings.propsDefaults?.additions,
      }
    : {
        mappings: {
          ...mappings.propsDefaults?.mappings,
          ...map?.props?.mappings,
        },
        additions: {
          ...mappings.propsDefaults?.additions,
          ...map?.props?.additions,
        },
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

  return typeof component === "string" ? component : component.targetName;
}
