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
 * A function that maps a property from one value to another.
 *
 * @template T - The type of the target property name. Defaults to string.
 * @param {JSXAttribute["value"]} originalValue - The original value of the JSX attribute.
 * @param {Runtime} runtime - The runtime environment.
 * @returns {{ to: T; value: JSXAttribute["value"] } | null} - An object containing the target property name and its new value, or null if the property should be removed.
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
