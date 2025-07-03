import { tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";
import { buttonMapping } from "./button.ts";

export const crossButtonMapping = {
  CrossButton: {
    to: "CloseButton",
    props: {
      mappings: {
        ...buttonMapping.Button.props.mappings,
        size: (originalValue, runtime) => {
          const value = tryGettingLiteralValue(originalValue, runtime);
          if (value === "2xs") {
            return {
              todoComments: getTodoComment("cross_button_2xs_not_supported")
            };
          }

          return null;
        }
      }
    }
  },
  CrossButtonProps: "CrossButtonProps"
} satisfies Record<string, ComponentMapping>;
