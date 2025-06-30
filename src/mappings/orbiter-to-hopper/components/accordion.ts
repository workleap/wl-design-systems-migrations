import { isWithinComponent, tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";

export const accordionMapping = {
  Accordion: {
    props: {
      mappings: {    
        onExpansionChange: "onExpandedChange",
        autoFocus: () => (
          { todoComments: getTodoComment("accordion_autofocus_removed") }
        ),
        variant:  (originalValue, runtime) => {
          const value = tryGettingLiteralValue(originalValue, runtime);
          const map: Record<string, string> = {
            borderless: "inline",
            bordered: "standalone"
          };
          const newValue = typeof value === "string" && value in map ? map[value] : undefined;

          return {
            value: newValue ? runtime.j.stringLiteral(newValue) : undefined,
            todoComments: getTodoComment("accordion_variant_no_match")
          };
        },
        expansionMode:  (originalValue, runtime) => {
          const { j } = runtime;
          const value = tryGettingLiteralValue(originalValue, runtime);

          if (value === "multiple") {
            return {
              to: "allowsMultipleExpanded",
              value: null
            };
          } else if (value === "single") {
            return {
              to: "allowsMultipleExpanded",
              value: j.jsxExpressionContainer(j.booleanLiteral(false))
            };
          }

          return {
            todoComments: getTodoComment("accordion_expansion_mode_not_supported")
          };
        }
      }
    }
  },
  AccordionProps: "AccordionProps"
} satisfies Record<string, ComponentMapping>;

export const accordionItemMappings = {
  Item: [(tag, runtime) => {
    if (isWithinComponent(tag, "Accordion", runtime.mappings.targetPackage, runtime)) {
      return {
        to: "Disclosure"   
      };
    }
  }] 
} satisfies Record<string, ComponentMapping>;

