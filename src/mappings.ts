import { MapMetaData } from "./utils/types.js";

export const mappings: MapMetaData = {
  sourcePackage: "@workleap/orbiter-ui",
  targetPackage: "@hopper-ui/components",
  components: {
    Div: {
      targetName: "Div",
      props: {
        width: "UNSAFE_width",
        height: "UNSAFE_height",
        maxWidth: "UNSAFE_maxWidth",
      },
    },
    Text: {
      targetName: "Text",
    },
    Flex: {
      targetName: "Flex",
      props: {
        minHeight: (oldValue) => {
          if (oldValue && oldValue.type === "Literal") {
            return {
              to: "UNSAFE_minHeight",
              value: oldValue,
            };
          }
          return null;
        },
      },
    },
    Header: {
      targetName: "Header",
    },
    Heading: {
      targetName: "Heading",
    },
    Content: {
      targetName: "Content",
    },
    Paragraph: {
      targetName: "Text",
    },
  },
};
