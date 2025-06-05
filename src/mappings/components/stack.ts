import { ComponentMapMetaData } from "../../utils/types.ts";
import { flexMapping } from "./flex.ts";

export const stackMapping = {
  Stack: {
    props: {
      mappings: {
        ...flexMapping.Flex.props.mappings,
      },
      additions: {},
    },
  },
  StackProps: "StackProps",
} satisfies Record<string, ComponentMapMetaData>;
