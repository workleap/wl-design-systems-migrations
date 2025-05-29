import { flexMapping } from "../mappings/components/flex.ts";
import { gridMappings } from "../mappings/components/grid.ts";
import { mappings } from "../mappings/mappings.ts";
import { getMappingKeys } from "./types.ts";

export type LayoutComponent = keyof typeof mappings.components;

export const layoutComponents: LayoutComponent[] = [
  // layout components
  ...getMappingKeys(flexMapping),
  ...getMappingKeys(gridMappings),
  "Inline",
  "InlineProps",
  "Stack",
  "StackProps",

  // content
  "Heading",
  "HeadingProps",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "HtmlH1",
  "HtmlH1Props",
  "HtmlH2",
  "HtmlH2Props",
  "HtmlH3",
  "HtmlH3Props",
  "HtmlH4",
  "HtmlH4Props",
  "HtmlH5",
  "HtmlH5Props",
  "HtmlH6",
  "HtmlH6Props",
  "Text",
  "TextProps",

  // components
  "Paragraph",
  "ParagraphProps",

  // placeholders
  "Content",
  "ContentProps",
  "Footer",
  "FooterProps",
  "Header",
  "HeaderProps",

  // html elements
  "A",
  "AProps",
  "Address",
  "AddressProps",
  "Article",
  "ArticleProps",
  "Aside",
  "AsideProps",
  "HtmlButton",
  "HtmlButtonProps",
  "Div",
  "DivProps",
  "HtmlFooter",
  "HtmlFooterProps",
  "HtmlHeader",
  "HtmlHeaderProps",
  "Img",
  "ImgProps",
  "HtmlInput",
  "HtmlInputProps",
  "UL",
  "ULProps",
  "OL",
  "OLProps",
  "LI",
  "LIProps",
  "Main",
  "MainProps",
  "Nav",
  "NavProps",
  "HtmlSection",
  "HtmlSectionProps",
  "Span",
  "SpanProps",
  "Table",
  "TableProps",
];
