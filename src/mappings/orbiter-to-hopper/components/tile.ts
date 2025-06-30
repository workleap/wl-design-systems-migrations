import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";

export const tileMapping = {
  Tile: {
    props: {
      mappings: {
        onClick: "onPress",
        value: "id",
        checked: "isSelected",
        defaultChecked: "defaultSelected",
        defaultValue: () => ({
          todoComments: getTodoComment("tile_default_value_remove")
        }),
        orientation: () => ({
          todoComments: getTodoComment("tile_orientation_remove")
        })
      }
    }
  },
  TileProps: "TileProps"
} satisfies Record<string, ComponentMapping>;
