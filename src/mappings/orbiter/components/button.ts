import { tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";

export const buttonMapping = {
  Button: {
    props: {
      mappings: {
        onClick: "onPress",
        fluid: "isFluid",
        loading: "isLoading",
        size: "size",
        inherit: () => ({
          todoComments: "`inherit` is not supported anymore. Remove it."
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
              todoComments:
                "`tertiary` is not supported anymore. `ghost-secondary` is the closest one, but you can also consider `ghost-primary` or `ghost-danger`."
            };
          }

          return null;
        }
      }
    }
  },
  ButtonProps: "ButtonProps"
} satisfies Record<string, ComponentMapping>;
