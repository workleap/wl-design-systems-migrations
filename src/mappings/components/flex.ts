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
