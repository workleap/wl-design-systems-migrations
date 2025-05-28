import core, {
  ASTNode,
  Collection,
  JSXAttribute,
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
export type PropertyMapperFunction<T extends string> = (
  originalValue: JSXAttribute["value"],
  runtime: Runtime
) => PropertyMapResult<T> | null;

export type PropertyMapResult<
  T extends string,
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

type PropsMapMetaData = {
  mappings?: PropsMapping;
  additions?: {
    [key: string]: string | number | boolean | null;
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
