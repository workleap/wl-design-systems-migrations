import { tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";
import { buttonMapping } from "./button.ts";

export const iconButtonMapping = {
  IconButton: {
    to: "Button",
    props: {
      mappings: {
        ...buttonMapping.Button.props.mappings,
        size: (originalValue, runtime) => {
          const value = tryGettingLiteralValue(originalValue, runtime);
          if (value === "2xs") {
            return {
              todoComments: getTodoComment("icon_button_2xs_not_supported")
            };
          }

          return null;
        }
      }
    }
  },
  IconButtonProps: "IconButtonProps"
} satisfies Record<string, ComponentMapping>;
