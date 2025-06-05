import { JSXAttribute } from "jscodeshift";
import { ComponentMapMetaData } from "../../utils/types.ts";
import { tryGettingLiteralValue } from "../helpers.ts";

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
        reverse: (originalValue: JSXAttribute["value"], { j }) => {
          return {
            to: "reverse",
            value: originalValue,
            todoComments:
              "Remove the `reverse` property, read this: https://hopper.workleap.design/components/Flex#migration-notes",
          };
        },
        fluid: (originalValue: JSXAttribute["value"], { j }) => {
          const value = tryGettingLiteralValue(originalValue);
          if (!originalValue || Boolean(value) != false)
            return {
              to: "width",
              value: j.stringLiteral("100%"),
            };
          return null;
        },
      },
    },
  },
  FlexProps: "FlexProps",
} satisfies Record<string, ComponentMapMetaData>;
