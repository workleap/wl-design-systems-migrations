import { hasAttribute } from "../../../utils/mapping.ts";
import type { ComponentMapMetaData } from "../../../utils/types.ts";
import { flexMapping } from "./flex.ts";

export const inlineMapping = {
  Inline: {
    props: {
      mappings: {
        ...flexMapping.Flex.props.mappings
      },
      additions: {
        UNSAFE_gap: tag => {
          return hasAttribute(tag.value, ["gap", "UNSAFE_gap"])
            ? null
            : "1.25rem";
        }
      }
    }
  },
  InlineProps: "InlineProps"
} satisfies Record<string, ComponentMapMetaData>;
