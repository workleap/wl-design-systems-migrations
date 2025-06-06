import { ComponentMapMetaData } from "../../utils/types.ts";
import { tryGettingLiteralValue } from "../helpers.ts";
import { buttonMapping } from "./button.ts";

export const iconButtonMapping = {
  IconButton: {
    to: "Button",
    props: {
      mappings: {
        ...buttonMapping.Button.props.mappings,
        size: (originalValue, runtime) => {
          const { j } = runtime;

          const value = tryGettingLiteralValue(originalValue, runtime);
          if (value === "xs" || value === "2xs")
            return {
              todoComments:
                "`xs` and `2xs` are not supported anymore. `sm` is the closest one.",
            };

          return null;
        },
      },
    },
  },
  IconButtonProps: "IconButtonProps",
} satisfies Record<string, ComponentMapMetaData>;
