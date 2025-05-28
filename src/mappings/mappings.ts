import { Address, H1 } from "@hopper-ui/components";
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
      props: {
        mappings: {
          flexGrow: "grow",
          flexShrink: "shrink",
        },
      },
    },
    FlexProps: "FlexProps",
    Grid: "Grid",
    GridProps: "GridProps",
    Inline: "Inline",
    InlineProps: "InlineProps",
    Stack: "Stack",
    StackProps: "StackProps",

    //content
    Heading: "Heading",
    HeadingProps: "HeadingProps",
    H1: "H1",
    H2: "H2",
    H3: "H3",
    H4: "H4",
    H5: "H5",
    H6: "H6",
    HtmlH1: "HtmlH1",
    HtmlH1Props: "HtmlH1Props",
    HtmlH2: "HtmlH2",
    HtmlH2Props: "HtmlH2Props",
    HtmlH3: "HtmlH3",
    HtmlH3Props: "HtmlH3Props",
    HtmlH4: "HtmlH4",
    HtmlH4Props: "HtmlH4Props",
    HtmlH5: "HtmlH5",
    HtmlH5Props: "HtmlH5Props",
    HtmlH6: "HtmlH6",
    HtmlH6Props: "HtmlH6Props",
    Text: "Text",
    TextProps: "TextProps",

    //components
    Paragraph: "Paragraph",
    ParagraphProps: "ParagraphProps",

    //placeholders
    Content: "Content",
    ContentProps: "ContentProps",
    Footer: "Footer",
    FooterProps: "FooterProps",
    Header: "Header",
    HeaderProps: "HeaderProps",

    //html elements
    A: "A",
    AProps: "AProps",
    Address: "Address",
    AddressProps: "AddressProps",
    Article: "Article",
    ArticleProps: "ArticleProps",
    Aside: "Aside",
    AsideProps: "AsideProps",
    HtmlButton: "HtmlButton",
    HtmlButtonProps: "HtmlButtonProps",
    Div: "Div",
    DivProps: "DivProps",
    HtmlFooter: "HtmlFooter",
    HtmlFooterProps: "HtmlFooterProps",
    HtmlHeader: "HtmlHeader",
    HtmlHeaderProps: "HtmlHeaderProps",
    Img: "Img",
    ImgProps: "ImgProps",
    HtmlInput: "HtmlInput",
    HtmlInputProps: "HtmlInputProps",
    UL: "UL",
    ULProps: "ULProps",
    OL: "OL",
    OLProps: "OLProps",
    LI: "LI",
    LIProps: "LIProps",
    Main: "Main",
    MainProps: "MainProps",
    Nav: "Nav",
    NavProps: "NavProps",
    HtmlSection: "HtmlSection",
    HtmlSectionProps: "HtmlSectionProps",
    Span: "Span",
    SpanProps: "SpanProps",
    Table: "Table",
    TableProps: "TableProps",

    //form fields
    TextInput: "TextField",
    TextArea: "TextArea",
  },
} satisfies MapMetaData;

//Notes:
/*
- Divider is probably not 1:1, depending on what property is used.
- Box will be a case by case basis. It's usually used to render a polymorphic component using the as props. We don't support that in hopper. It might be a case of manual migration for that one

*/
