import { slot, TBody, TFoot } from "@hopper-ui/components";
import { table } from "console";
import { MapMetaData } from "../utils/types.js";
import { flexMapping } from "./components/flex.ts";
import { gridMappings } from "./components/grid.ts";
import { headingMappings } from "./components/heading.ts";
import { inlineMapping } from "./components/inline.ts";
import { stackMapping } from "./components/stack.ts";
import { tableMapping } from "./components/table.ts";
import { styledSystemPropsMappings } from "./styled-system/mappings.js";

//it is a list of known props that are ignored in the migration
//but we keep them in the mappings so we can ignore reporting them as missing
const knownIgnoredProps = {
  "data-testid": "data-testid",
  "aria-label": "aria-label",
  "aria-labelledby": "aria-labelledby",
  "aria-describedby": "aria-describedby",
  "aria-disabled": "aria-disabled",
  "aria-busy": "aria-busy",
  "data-public": "data-public",
  "data-private": "data-private",
  className: "className",
  style: "style",
  key: "key",
  ref: "ref",
  slot: "slot",
};

const defaultPropsMappings = {
  ...knownIgnoredProps,
  ...styledSystemPropsMappings,
  disabled: "isDisabled",
  readOnly: "isReadOnly",
};

export const mappings = {
  sourcePackage: "@workleap/orbiter-ui",
  targetPackage: "@hopper-ui/components",
  propsDefaults: {
    mappings: defaultPropsMappings,
  },
  components: {
    //layout components
    ...flexMapping,
    ...gridMappings,
    ...inlineMapping,
    ...stackMapping,

    //content
    ...headingMappings,
    Text: "Text",
    TextProps: "TextProps",

    //table
    ...tableMapping,

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
    HtmlButton: "HtmlButton",
    HtmlButtonProps: "HtmlButtonProps",
    HtmlFooter: "HtmlFooter",
    HtmlFooterProps: "HtmlFooterProps",
    HtmlHeader: "HtmlHeader",
    HtmlHeaderProps: "HtmlHeaderProps",
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
    HtmlInput: "HtmlInput",
    HtmlInputProps: "HtmlInputProps",
    HtmlSection: "HtmlSection",
    HtmlSectionProps: "HtmlSectionProps",

    //etc
    A: "A",
    AProps: "AProps",
    Address: "Address",
    AddressProps: "AddressProps",
    Article: "Article",
    ArticleProps: "ArticleProps",
    Aside: "Aside",
    AsideProps: "AsideProps",
    Div: "Div",
    DivProps: "DivProps",
    Img: "Img",
    ImgProps: "ImgProps",
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
    Span: "Span",
    SpanProps: "SpanProps",

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
