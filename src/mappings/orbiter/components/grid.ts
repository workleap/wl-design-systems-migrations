import type { ComponentMapMetaData } from "../../../utils/types.ts";
import {
  createGridAutoColumnsMapper,
  createGridAutoRowsMapper,
  createGridTemplateColumnsMapper,
  createGridTemplateRowsMapper
} from "../styled-system/styles/grid.ts";

export const gridMappings = {
  Grid: {
    to: "Grid",
    props: {
      mappings: {
        areas: "areas",
        autoRows: createGridAutoRowsMapper("autoRows", "UNSAFE_autoRows"),
        autoColumns: createGridAutoColumnsMapper(
          "autoColumns",
          "UNSAFE_autoColumns"
        ),
        templateRows: createGridTemplateRowsMapper(
          "templateRows",
          "UNSAFE_templateRows"
        ),
        templateColumns: createGridTemplateColumnsMapper(
          "templateColumns",
          "UNSAFE_templateColumns"
        )
      }
    }
  },
  GridProps: "GridProps"
} satisfies Record<string, ComponentMapMetaData>;
