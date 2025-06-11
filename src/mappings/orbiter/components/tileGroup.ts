import { tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapMetaData } from "../../../utils/types.ts";

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
          todoComments:
            "Remove the `autoFocus` property, read this: https://hopper.workleap.design/components/TileGroup#migration-notes"
        }),
        inline: () => ({
          todoComments:
            "Remove the `inline` property, read this: https://hopper.workleap.design/components/TileGroup#migration-notes"
        }),
        reverse: () => ({
          todoComments:
            "Remove the `reverse` property, read this: https://hopper.workleap.design/components/TileGroup#migration-notes"
        }),
        value: () => ({
          todoComments:
            "Remove the `value` property, read this: https://hopper.workleap.design/components/TileGroup#migration-notes"
        }),
        defaultValue: () => ({
          todoComments:
            "Remove the `defaultValue` property, read this: https://hopper.workleap.design/components/TileGroup#migration-notes"
        }),
        defaultChecked: () => ({
          todoComments:
            "Remove the `defaultChecked` property, read this: https://hopper.workleap.design/components/TileGroup#migration-notes"
        }),
        rowSize: () => ({
          todoComments:
            "Remove the `rowSize` property, read this: https://hopper.workleap.design/components/TileGroup#migration-notes"
        })
      }
    }
  },
  TileGroupProps: "TileGroupProps"
} satisfies Record<string, ComponentMapMetaData>;
