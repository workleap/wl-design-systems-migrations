import { tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapMetaData } from "../../../utils/types.ts";
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
              todoComments:
                "`2xs` is not supported anymore. `xs` is the closest one, but if you're using this icon for implementing `Callout` or `ContextualHelp`, Hopper has built-in support for these cases: https://hopper.workleap.design/components/Callout"
            };
          }

          return null;
        }
      }
    }
  },
  CrossButtonProps: "CrossButtonProps"
} satisfies Record<string, ComponentMapMetaData>;
