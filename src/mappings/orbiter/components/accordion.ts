import { isWithinComponent, tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";

export const accordionMapping = {
  Accordion: {
    props: {
      mappings: {    
        "onExpansionChange": "onExpandedChange",
        "autoFocus": () => (
          { todoComments: "autofocus is removed. It did not make sense to have. More details: https://hopper.workleap.design/components/Accordion#migration-notes" }
        ),
        "variant":  (originalValue, runtime) => {
          const value = tryGettingLiteralValue(originalValue, runtime);
          const map: Record<string, string> = {
            "borderless": "inline",
            "bordered": "standalone"
          };
          const newValue = typeof value === "string" && value in map ? map[value] : undefined;

          return {
            value: newValue ? runtime.j.stringLiteral(newValue) : undefined,
            todoComments: "`inline` and `standalone` are the new variants, but there is no direct match; the new variants are context-based, depending on whether an accordion is contained or not. More details: https://hopper.workleap.design/components/Accordion#migration-notes"
          };
        },
        "expansionMode":  (originalValue, runtime) => {
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
            todoComments: "`expansionMode` is not supported anymore. Use `allowsMultipleExpanded` instead if you want to allow multiple items to be expanded. More details: https://hopper.workleap.design/components/Accordion#migration-notes"
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

