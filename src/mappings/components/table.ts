import { ComponentMapMetaData } from "../../utils/types.ts";

export const tableMapping = {
  Table: "Table",
  TableProps: "TableProps",
  TR: "TR",
  TRProps: "TRProps",
  TD: "TD",
  TDProps: "TDProps",
  TH: "TH",
  THProps: "THProps",
  TBody: "TBody",
  TBodyProps: "TBodyProps",
  THead: "THead",
  THeadProps: "THeadProps",
  TFoot: "TFoot",
  TFootProps: "TFootProps",
} satisfies Record<string, ComponentMapMetaData>;
