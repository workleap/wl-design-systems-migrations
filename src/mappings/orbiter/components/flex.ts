import { tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";

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
            todoComments: getTodoComment("flex_reverse_not_supported")
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
