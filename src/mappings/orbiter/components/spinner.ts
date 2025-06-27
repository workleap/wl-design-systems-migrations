import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";
import { colorMapper } from "../styled-system/styles/colors.ts";

export const spinnerMapping = {
  Spinner: {
    props: {
      mappings: {
        size: "size",
        color: (...args) => {
          return {
            ...colorMapper(...args),
            todoComments: getTodoComment("spinner_color_only_text")
          };
        }
      }
    }
  },
  SpinnerProps: "SpinnerProps"
} satisfies Record<string, ComponentMapping>;
