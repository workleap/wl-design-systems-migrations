import core, {
  ASTNode,
  Collection,
  JSXAttribute,
} from "jscodeshift/src/core.js";

export interface Runtime {
  j: core.JSCodeshift;
  root: Collection<ASTNode>;
  mappings: MapMetaData;
  filePath: string;
  log: (message: string, ...optionalParams: any[]) => void;
}

/**
 * Represents a function that maps a property from old name to a new name with a value.
 * @param originalValue - The original property value to be mapped.
 * @returns An object containing the new property name (`to`) and its value, or `null` if the property should be excluded.
 */
export type PropertyMapperFunction<T extends string = string> = (
  originalValue: JSXAttribute["value"],
  runtime: Runtime
) => { to: T; value: JSXAttribute["value"] } | null;

export type PropsMapping<
  S extends string = string,
  T extends string = string
> = {
  [K in S]: T | PropertyMapperFunction<T>;
};

export type ComponentMapMetaData<T extends string = string> = {
  targetName: T;
  props?: PropsMapping;
};

export type MapMetaData = {
  sourcePackage: string;
  targetPackage: string;
  components: Record<string, ComponentMapMetaData>;
};
