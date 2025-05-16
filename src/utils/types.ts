import core, { ASTNode, Collection } from "jscodeshift/src/core.js";

export interface Runtime {
  j: core.JSCodeshift;
  root: Collection<ASTNode>;
  mappings: MapMetaData;
}

export type ComponentMapMetaData = {
  targetName: string;
  props?: {
    [key: string]: string;
  };
};

export type MapMetaData = {
  sourcePackage: string;
  targetPackage: string;
  components: Record<string, ComponentMapMetaData>;
};
