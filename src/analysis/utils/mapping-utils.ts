import type { Runtime } from "../../utils/types.ts";

/**
 * Checks if a component has a mapping in the mappings configuration
 */
export function isComponentMapped(
  componentName: string,
  mappings: Runtime["mappings"]
): boolean {
  return componentName in mappings.components;
}

/**
 * Checks if a property has a mapping for a given component
 */
export function isPropertyMapped(
  componentName: string,
  propName: string,
  mappings: Runtime["mappings"]
): boolean {
  const componentMapping = mappings.components[componentName];

  // If component doesn't exist in mappings, property is not mapped
  if (!componentMapping) {
    return false;
  }

  // Check if it's a string mapping (simple component mapping)
  if (typeof componentMapping === "string") {
    // Check in default props mappings
    return propName in (mappings.propsDefaults?.mappings || {});
  }

  // Check component-specific prop mappings
  if (
    !Array.isArray(componentMapping) &&
    componentMapping.props?.mappings &&
    propName in componentMapping.props.mappings
  ) {
    return true;
  }

  // Check in default props mappings
  return propName in (mappings.propsDefaults?.mappings || {});
}

/**
 * Checks if a property should be ignored during analysis
 * This includes aria-* attributes, data-* attributes, and known ignored props
 */
export function shouldIgnoreProperty(propName: string): boolean {
  // Check for aria-* attributes
  if (propName.startsWith("aria-")) {
    return true;
  }

  // Check for data-* attributes
  if (propName.startsWith("data-")) {
    return true;
  }

  // List of known ignored props that should be filtered out during analysis
  // These are standard React/DOM props that don't need migration analysis
  const knownIgnoredProps = [
    "className",
    "style",
    "key",
    "ref",
    "slot",
    "id",
    "role",
    "dangerouslySetInnerHTML"
  ];

  return knownIgnoredProps.includes(propName);
}
