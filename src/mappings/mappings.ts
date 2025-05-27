import { MapMetaData } from "../utils/types.js";
import { styledSystemPropsMappings } from "./styled-system/mappings.js";

const defaultPropsMappings = {
  ...styledSystemPropsMappings,
  disabled: "isDisabled",
};

export const mappings = {
  sourcePackage: "@workleap/orbiter-ui",
  targetPackage: "@hopper-ui/components",
  propsDefaults: {
    mappings: defaultPropsMappings,
  },
  components: {
    //layout components
    Flex: {
      targetName: "Flex",
      props: {
        mappings: {
          flexGrow: "grow",
          flexShrink: "shrink",
        },
      },
    },
    Grid: "Grid",
    Inline: "Inline",
    Stack: "Stack",

    //content
    Heading: "Heading",
    H1: "H1",
    H2: "H2",
    H3: "H3",
    H4: "H4",
    H5: "H5",
    H6: "H6",
    Text: "Text",

    //components
    Paragraph: "Paragraph",

    //placeholders
    Content: "Content",
    ContentProps: "ContentProps",
    Footer: "Footer",
    Header: "Header",

    //html elements
    A: "A",
    Address: "Address",
    Article: "Article",
    Aside: "Aside",
    HtmlButton: "HtmlButton",
    Div: "Div",
    HtmlFooter: "HtmlFooter",
    HtmlHeader: "HtmlHeader",
    Img: "Img",
    HtmlInput: "HtmlInput",
    UL: "UL",
    OL: "OL",
    LI: "LI",
    Main: "Main",
    Nav: "Nav",
    HtmlSection: "HtmlSection",
    Span: "Span",
    Table: "Table",

    //for fields
    TextInput: "TextField",
    TextArea: "TextArea",
  },
} satisfies MapMetaData;

//Notes:
/*
- Divider is probably not 1:1, depending on what property is used.
- Box will be a case by case basis. It's usually used to render a polymorphic component using the as props. We don't support that in hopper. It might be a case of manual migration for that one

*/
