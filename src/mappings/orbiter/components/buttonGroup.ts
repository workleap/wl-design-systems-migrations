import type { ComponentMapping } from "../../../utils/types.ts";

export const buttonGroupMapping = {
  ButtonGroup: {
    props: {
      mappings: {
        fluid: "isFluid",
        inline: () => ({
          todoComments: "`inline` is not supported anymore. Remove it."
        }),
        reverse: () => ({
          todoComments: "`reverse` is not supported anymore. Remove it."
        })
      }
    }
  },
  ButtonGroupProps: "LinkButtonProps"
} satisfies Record<string, ComponentMapping>;
