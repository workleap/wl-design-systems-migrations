import { ComponentMapMetaData } from "../utils/types.ts";
import { flexMapping } from "./components/flex.ts";
import { gridMappings } from "./components/grid.ts";
import { headingMappings } from "./components/heading.ts";
import { inlineMapping } from "./components/inline.ts";
import { stackMapping } from "./components/stack.ts";
import { tableMapping } from "./components/table.ts";

export const layoutComponentsMappings = {
  //structural
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

  //basic wrappers over html elements
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
} satisfies Record<string, ComponentMapMetaData>;
