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

export type ExtendedRuntime = Runtime & {
  tag: ASTPath<JSXOpeningElement>;
};

export type PropertyMapperFunction<T extends string = string> = (
  originalValue: JSXAttribute["value"],
  runtime: ExtendedRuntime
) => PropertyMapResult<T> | null;

export type PropertyMapResult<
  T extends string = string,
  Z = JSXAttribute["value"] | ObjectProperty["value"]
> = {
  to: T | ReviewMe<T>;
  value: Z;
  comments?: string;
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
