import core, {
  ASTNode,
  ASTPath,
  Collection,
  JSXAttribute,
  JSXOpeningElement,
  ObjectProperty,
} from "jscodeshift/src/core.js";

export interface Runtime {
  j: core.JSCodeshift;
  root: Collection<ASTNode>;
  mappings: MapMetaData;
  filePath: string;
  log: (message: string, ...optionalParams: any[]) => void;
}

export const REVIEWME_PREFIX = "REVIEWME_" as const;
type REVIEWME_PREFIX_TYPE = typeof REVIEWME_PREFIX;
export type ReviewMe<T extends string> = `${REVIEWME_PREFIX_TYPE}${T}`;

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
) => PropertyMapResult<T> | null;

export type PropertyMapResult<
  T extends string = string,
  Z = JSXAttribute["value"] | ObjectProperty["value"]
> = {
  to: T | ReviewMe<T>;
  value: Z;
};

export type PropsMapping<
  S extends string = string,
  T extends string = string
> = {
  [K in S]: T | PropertyMapperFunction<T>;
};

export type PropertyAdderFunction<T extends string = string> = (
  tag: ASTPath<JSXOpeningElement>,
  runtime: Runtime
) => string | number | boolean | JSXAttribute["value"] | null;

export type PropsMapMetaData = {
  mappings?: PropsMapping;
  additions?: {
    [key: string]: PropertyAdderFunction | string | number | boolean;
  };
};

export type ComponentMapMetaData =
  | {
      to?: string;
      props?: PropsMapMetaData;
      tags?: string[];
    }
  | string;

export type MapMetaData = {
  sourcePackage: string;
  targetPackage: string;
  propsDefaults?: PropsMapMetaData;
  components: Record<string, ComponentMapMetaData>;
};

export function getMappingKeys<T extends Record<string, ComponentMapMetaData>>(
  obj: T
): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}
