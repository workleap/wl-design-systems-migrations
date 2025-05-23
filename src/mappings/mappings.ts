import { MapMetaData } from "../utils/types.js";
import { styledSystemPropsMappings } from "./styled-system/mappings.js";

const defaultPropsMappings = {
  ...styledSystemPropsMappings,
  disabled: "isDisabled",
};

export const mappings: MapMetaData = {
  sourcePackage: "@workleap/orbiter-ui",
  targetPackage: "@hopper-ui/components",
  propsDefaults: {
    mappings: defaultPropsMappings,
  },
  components: {
    Div: "Div",
    Span: "Span",
    Text: "Text",
    Flex: "Flex",
    Header: "Header",
    Heading: "Heading",
    Content: "Content",
    TextInput: "TextField",
    Paragraph: {
      targetName: "Text",
      props: {
        additions: {
          elementType: "p",
        },
      },
    },
  },
};
