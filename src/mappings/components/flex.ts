import { ComponentMapMetaData } from "../../utils/types.ts";

export const flexMapping = {
  Flex: {
    props: {
      mappings: {
        flexGrow: "grow",
        flexShrink: "shrink",
        flexFlow: "direction",
      },
    },
  },
  FlexProps: "FlexProps",
} satisfies Record<string, ComponentMapMetaData>;
