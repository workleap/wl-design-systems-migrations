import type { ComponentMapping } from "../../../utils/types.ts";
import { colorMapper } from "../styled-system/styles/colors.ts";

export const spinnerMapping = {
  Spinner: {
    props: {
      mappings: {
        size: "size",
        color: (...args) => {
          return {
            ...colorMapper(...args),
            todoComments: "`color` prop will only affect the spinner's text color and not the color of the tracks. More details: https://hopper.workleap.design/components/Spinner#migration-notes"
          };
        }
      }
    }
  },
  SpinnerProps: "SpinnerProps"
} satisfies Record<string, ComponentMapping>;
