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
        ...defaultPropsMappings,
      },
    },
    Text: {
      targetName: "Text",
      props: {
        ...defaultPropsMappings,
      },
    },
    Flex: {
      targetName: "Flex",
      props: {
        ...defaultPropsMappings,
      },
    },
    Header: {
      targetName: "Header",
      props: {
        ...defaultPropsMappings,
      },
    },
    Heading: {
      targetName: "Heading",
      props: {
        ...defaultPropsMappings,
      },
    },
    Content: {
      targetName: "Content",
      props: {
        ...defaultPropsMappings,
      },
    },
    Paragraph: {
      targetName: "Text",
      props: {
        ...defaultPropsMappings,
      },
    },
    TextInput: {
      targetName: "TextField",
      props: {
        ...defaultPropsMappings,
      },
    },
  },
};
