import { flexMapping } from "../mappings/components/flex.ts";
import { gridMappings } from "../mappings/components/grid.ts";
import { headingMappings } from "../mappings/components/heading.ts";
import { tableMapping } from "../mappings/components/table.ts";
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
  ...getMappingKeys(headingMappings),
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
  "HtmlButton",
  "HtmlButtonProps",
  "HtmlFooter",
  "HtmlFooterProps",
  "HtmlHeader",
  "HtmlHeaderProps",
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
  "HtmlInput",
  "HtmlInputProps",
  "HtmlSection",
  "HtmlSectionProps",

  //etc
  "A",
  "AProps",
  "Address",
  "AddressProps",
  "Article",
  "ArticleProps",
  "Aside",
  "AsideProps",
  "Div",
  "DivProps",
  "Img",
  "ImgProps",
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

  "Span",
  "SpanProps",
  ...getMappingKeys(tableMapping),
];
