import core, {
  ASTNode,
  Collection,
  JSXAttribute,
} from "jscodeshift/src/core.js";

export interface Runtime {
  j: core.JSCodeshift;
  root: Collection<ASTNode>;
  mappings: MapMetaData;
}

/**
 * Represents a function that maps a property from old name to a new name with a value.
 * @param originalValue - The original property value to be mapped.
 * @returns An object containing the new property name (`to`) and its value, or `null` if the property should be excluded.
 */
export type PropertyMapperFunction = (
  originalValue: JSXAttribute["value"]
) => { to: string; value: JSXAttribute["value"] } | null;

export type ComponentMapMetaData = {
  targetName: string;
  props?: {
    [key: string]: string | PropertyMapperFunction;
  };
};

export type MapMetaData = {
  sourcePackage: string;
  targetPackage: string;
  components: Record<string, ComponentMapMetaData>;
};
