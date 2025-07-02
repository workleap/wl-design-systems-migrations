import type { ComponentMapping } from "../../../utils/types.ts";
import { flexMapping } from "./flex.ts";

export const stackMapping = {
  Stack: {
    props: {
      mappings: {
        ...flexMapping.Flex.props.mappings
      }
    }
  },
  StackProps: "StackProps"
} satisfies Record<string, ComponentMapping>;
