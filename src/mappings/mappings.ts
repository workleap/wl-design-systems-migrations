import { MapMetaData } from "../utils/types.js";
import { styledSystemPropsMappings } from "./styled-system/mappings.js";

const defaultPropsMappings = {
  ...styledSystemPropsMappings,
  disabled: "isDisabled",
};

export const mappings: MapMetaData = {
  sourcePackage: "@workleap/orbiter-ui",
  targetPackage: "@hopper-ui/components",
  components: {
    Div: {
      targetName: "Div",
      props: {
        mappings: defaultPropsMappings,
      },
    },
    Text: {
      targetName: "Text",
      props: {
        mappings: defaultPropsMappings,
      },
    },
    Flex: {
      targetName: "Flex",
      props: {
        mappings: defaultPropsMappings,
      },
    },
    Header: {
      targetName: "Header",
      props: {
        mappings: defaultPropsMappings,
      },
    },
    Heading: {
      targetName: "Heading",
      props: {
        mappings: defaultPropsMappings,
      },
    },
    Content: {
      targetName: "Content",
      props: {
        mappings: defaultPropsMappings,
      },
    },
    Paragraph: {
      targetName: "Text",
      props: {
        mappings: defaultPropsMappings,
        additions: {
          elementType: "p",
        },
      },
    },
    TextInput: {
      targetName: "TextField",
      props: {
        mappings: defaultPropsMappings,
      },
    },
  },
};
