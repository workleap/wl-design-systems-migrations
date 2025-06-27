import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";

export const buttonGroupMapping = {
  ButtonGroup: {
    props: {
      mappings: {
        fluid: "isFluid",
        inline: () => ({
          todoComments: getTodoComment("button_group_inline_not_supported")
        }),
        reverse: () => ({
          todoComments: getTodoComment("button_group_reverse_not_supported")
        })
      }
    }
  },
  ButtonGroupProps: "LinkButtonProps"
} satisfies Record<string, ComponentMapping>;
