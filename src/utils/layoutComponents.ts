import { mappings } from "../mappings/mappings.ts";

export type LayoutComponent = keyof typeof mappings.components;

export const layoutComponents: LayoutComponent[] = [
  // layout components
  "Flex",
  "Grid",
  "Inline",
  "Stack",

  // content
  "Heading",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "Text",

  // components
  "Paragraph",

  // placeholders
  "Content",
  "Footer",
  "Header",

  // html elements
  "A",
  "Address",
  "Article",
  "Aside",
  "HtmlButton",
  "Div",
  "HtmlFooter",
  "HtmlHeader",
  "Img",
  "HtmlInput",
  "UL",
  "OL",
  "LI",
  "Main",
  "Nav",
  "HtmlSection",
  "Span",
  "Table",

  "ContentProps",
];
