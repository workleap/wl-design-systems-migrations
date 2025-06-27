import { tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";

export const buttonMapping = {
  Button: {
    props: {
      mappings: {
        onClick: "onPress",
        fluid: "isFluid",
        loading: "isLoading",
        size: "size",
        inherit: () => ({
          todoComments: getTodoComment("button_inherit_not_supported")
        }),
        title: () => ({
          todoComments: getTodoComment("button_title_not_supported")
        }),
        variant: (originalValue, runtime) => {
          const { j } = runtime;

          const value = tryGettingLiteralValue(originalValue, runtime);
          if (value === "negative") {
            return {
              to: "variant",
              value: j.stringLiteral("danger")
            };
          } else if (value === "tertiary") {
            return {
              to: "variant",
              value: j.stringLiteral("ghost-secondary"),
              todoComments: getTodoComment("button_tertiary_mapping")
            };
          }

          return null;
        }
      }
    }
  },
  ButtonProps: "ButtonProps"
} satisfies Record<string, ComponentMapping>;
