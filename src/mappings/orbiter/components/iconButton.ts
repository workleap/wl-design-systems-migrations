import { tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapMetaData } from "../../../utils/types.ts";
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
              todoComments:
                "`2xs` is not supported anymore. `xs` is the closest one."
            };
          }

          return null;
        }
      }
    }
  },
  IconButtonProps: "IconButtonProps"
} satisfies Record<string, ComponentMapMetaData>;
