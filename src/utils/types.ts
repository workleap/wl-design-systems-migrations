import type core from "jscodeshift/src/core.js";
import type { ASTNode, ASTPath, Collection, JSXAttribute, JSXOpeningElement, ObjectProperty } from "jscodeshift/src/core.js";

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

export interface PropertyMapResult<
  T extends string = string,
  Z = JSXAttribute["value"] | ObjectProperty["value"]
> {
  to?: T | ReviewMe<T>; //if not provided, original value will be used
  value?: Z; //if not provided, original value will be used
  todoComments?: string;
}

export type PropsMapping<
  S extends string = string,
  T extends string = string
> = {
  [K in S]: T | PropertyMapperFunction<T>;
};

export type PropertyAdderFunction = (
  tag: ASTPath<JSXOpeningElement>,
  runtime: Runtime
) => string | number | boolean | JSXAttribute["value"] | null;

export interface PropsMapMetaData {
  mappings?: PropsMapping;
  additions?: {
    [key: string]: PropertyAdderFunction | string | number | boolean;
  };
}

export type ComponentMapMetaData =
  | {
    to?: string;
    props?: PropsMapMetaData;
    todoComments?: string;
  }
  | string;

export interface MapMetaData {
  sourcePackage: string;
  targetPackage: string;
  propsDefaults?: PropsMapMetaData;
  components: Record<string, ComponentMapMetaData>;
}

export function getMappingKeys<T extends Record<string, ComponentMapMetaData>>(
  obj: T
): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}
