import { mappings } from "../mappings/mappings.ts";

export type LayoutComponent = keyof typeof mappings.components;

export const layoutComponents: LayoutComponent[] = [
  // layout components
  "Flex",
  "FlexProps",
  "Grid",
  "GridProps",
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
