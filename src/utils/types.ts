import type { StyledSystemProps as HopperStyledSystemProps } from "@hopper-ui/components";
import type core from "jscodeshift/src/core.js";
import type { ASTNode, ASTPath, Collection, JSXAttribute, JSXOpeningElement, ObjectProperty } from "jscodeshift/src/core.js";
import type { MigrationNotesManager } from "./migration-notes.js";


export interface Runtime {
  j: core.JSCodeshift;
  root: Collection<ASTNode>;
  mappings: MapMetaData;
  filePath: string;
  log: (message: string, ...optionalParams: any[]) => void;
  getRepoInfo: () => { url: string; type: "github" | "azure" | "unknown"; projectRoot: string } | null;
  getBranch: () => string;
  getMigrationNotesManager: () => MigrationNotesManager;
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
) => PropertyMapResult<T> | PropertyRemoveResult | null;

export interface PropertyRemoveResult { removeIt: true }

export interface PropertyMapResult<
  T extends string = string,
  Z = JSXAttribute["value"] | ObjectProperty["value"]
> {
  to?: T | ReviewMe<T>; //if not provided, original value will be used
  value?: Z; //if not provided, original value will be used
  todoComments?: string;
  migrationNotes?: string | string[];
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
) => string | number | boolean | null | object | JSXAttribute["value"] | undefined;// undefined means skip adding the property

export interface PropsMapMetaData {
  mappings?: PropsMapping;
  additions?: {
    [key: string]: PropertyAdderFunction | string | number | boolean | null | object;
  };
  removals?: string[]; // properties to remove from the component
}

export type TodoComment = string | string[] | ((tag: ASTPath<JSXOpeningElement>, runtime: Runtime) => string | string[] | undefined);

export type ComponentMapMetaData =
  | {
    to?: string;
    props?: PropsMapMetaData;
    todoComments?: TodoComment;
    migrationNotes?: string | string[];
    skipImport?: boolean; // if true, the component import will be skipped
  }
  | string;

export type ComponentMappingFunction = (
  tag: ASTPath<JSXOpeningElement>, // it could be undefined because we are using it for types too. For example DivProps. In this case, we only map the imports. 
  runtime: Runtime
) => ComponentMapMetaData | undefined;

export type ComponentMapping = ComponentMapMetaData | ComponentMappingFunction[];

export interface MapMetaData {
  sourcePackage: string;
  targetPackage: string;
  propsDefaults?: PropsMapMetaData;
  categories?: {
    layout: string[];
    buttons: string[];
    visual: string[];
    menu: string[];
    overlay: string[];
    tags: string[];
    disclosure: string[];
  };
  components: Record<string, ComponentMapping>;
}

export function getMappingKeys<T extends Record<string, unknown>>(
  obj: T
): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

export function isMappingCategoryKey(
  key: string,
  categories: NonNullable<MapMetaData["categories"]>
): key is keyof NonNullable<MapMetaData["categories"]> {
  return key in categories;
}

// eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
export type LiteralType = string | boolean | null | number | RegExp | BigInt;

export type HopperStyledSystemPropsKeys = keyof HopperStyledSystemProps;

