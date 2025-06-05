import { JSXAttribute } from "jscodeshift";
import type { ComponentMapMetaData } from "../../utils/types.ts";
import { hasAttribute } from "../helpers.ts";
import { flexMapping } from "./flex.ts";

export const inlineMapping = {
  Inline: {
    props: {
      mappings: {
        ...flexMapping.Flex.props.mappings
      },
      additions: {
        UNSAFE_gap: (tag, { j, log }) => {
          return hasAttribute(tag.value, ["gap", "UNSAFE_gap"])
            ? null
            : "1.25rem";
        }
      }
    }
  },
  InlineProps: "InlineProps"
} satisfies Record<string, ComponentMapMetaData>;
