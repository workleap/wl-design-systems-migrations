import type { ComponentMapMetaData } from "../../../utils/types.ts";

export const tileMapping = {
  Tile: {
    props: {
      mappings: {
        onClick: "onPress",
        value: "id",
        checked: "isSelected",
        defaultChecked: "defaultSelected",
        defaultValue: () => ({
          todoComments:
            "Remove the `defaultValue` property, read this: https://hopper.workleap.design/components/Tile#migration-notes"
        }),
        orientation: () => ({
          todoComments:
            "Remove the `orientation` property, read this: https://hopper.workleap.design/components/Tile#migration-notes"
        })
      }
    }
  },
  TileProps: "TileProps"
} satisfies Record<string, ComponentMapMetaData>;
