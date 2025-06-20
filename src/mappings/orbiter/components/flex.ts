import { tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";

export const flexMapping = {
  Flex: {
    props: {
      mappings: {
        direction: "direction",
        grow: "grow",
        wrap: "wrap",
        flexGrow: "grow",
        flexShrink: "shrink",
        flexFlow: "direction",
        flexBasis: "basis",
        reverse: originalValue => {
          return {
            to: "reverse",
            value: originalValue,
            todoComments:
              "Remove the `reverse` property, read this: https://hopper.workleap.design/components/Flex#migration-notes"
          };
        },
        fluid: (originalValue, runtime) => {
          const { j } = runtime;
          const value = tryGettingLiteralValue(originalValue, runtime);
          if (!originalValue || Boolean(value) != false) {
            return {
              to: "width",
              value: j.stringLiteral("100%")
            };
          }

          return null;
        }
      }
    }
  },
  FlexProps: "FlexProps"
} satisfies Record<string, ComponentMapping>;
