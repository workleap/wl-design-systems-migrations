import { tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";

export const tileGroupMapping = {
  TileGroup: {
    props: {
      mappings: {
        align: "alignItems",
        onChange: "onSelectionChange",
        selectionMode: (originalValue, runtime) => {
          const value = tryGettingLiteralValue(originalValue, runtime);
          const { j } = runtime;

          if (value == "none") {
            return {
              value: j.jsxExpressionContainer(j.identifier("undefined"))
            };
          }

          return null;
        },
        autoFocus: () => ({
          todoComments: getTodoComment("tile_group_auto_focus_remove")
        }),
        inline: () => ({
          todoComments: getTodoComment("tile_group_inline_remove")
        }),
        reverse: () => ({
          todoComments: getTodoComment("tile_group_reverse_remove")
        }),
        value: () => ({
          todoComments: getTodoComment("tile_group_value_remove")
        }),
        defaultValue: () => ({
          todoComments: getTodoComment("tile_group_default_value_remove")
        }),
        defaultChecked: () => ({
          todoComments: getTodoComment("tile_group_default_checked_remove")
        }),
        rowSize: () => ({
          todoComments: getTodoComment("tile_group_row_size_remove")
        })
      }
    }
  },
  TileGroupProps: "TileGroupProps"
} satisfies Record<string, ComponentMapping>;
