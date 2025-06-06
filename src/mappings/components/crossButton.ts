import type { ComponentMapMetaData } from "../../utils/types.ts";
import { tryGettingLiteralValue } from "../helpers.ts";
import { buttonMapping } from "./button.ts";

export const crossButtonMapping = {
  CrossButton: {
    to: "CloseButton",
    props: {
      mappings: {
        ...buttonMapping.Button.props.mappings,
        size: (originalValue, runtime) => {
          const value = tryGettingLiteralValue(originalValue, runtime);
          if (value === "xs" || value === "2xs") {
            return {
              todoComments:
                "`xs` and `2xs` are not supported anymore. `sm` is the closest one, but if you're using this icon for implementing `Callout` or `ContextualHelp`, Hopper has built-in support for these cases: https://hopper.workleap.design/components/Callout"
            };
          }

          return null;
        }
      }
    }
  },
  CrossButtonProps: "CrossButtonProps"
} satisfies Record<string, ComponentMapMetaData>;
