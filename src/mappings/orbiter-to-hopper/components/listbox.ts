import { addChildrenTo, getAttributeValue, isWithinComponent, tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";

export const listboxMapping = {
  Listbox: {
    to: "ListBox",
    props: {
      mappings: {
        onSelectionChange: "onSelectionChange",
        zIndex: "zIndex",
        fluid: "isFluid",
        nodes: () => ({
          todoComments: getTodoComment("listbox_nodes_removed")
        }),

        validationState: (originalValue, runtime) => {
          const { j } = runtime;
          const value = tryGettingLiteralValue(originalValue, runtime);
          if (value === "invalid") {
            return {
              to: "isInvalid",
              value: null
            };
          } else if (value === "valid") {
            return {            
              to: "isInvalid",
              value: j.jsxExpressionContainer(j.booleanLiteral(false))
            };
          } else {
            return {             
              todoComments: getTodoComment("listbox_validation_state_not_supported")
            };
          }
        }
      }
    }
  },
  ListboxProps: "ListboxProps"
} satisfies Record<string, ComponentMapping>;

export const listBoxItemMappings = {
  Item: [(tag, runtime) => {
    if (isWithinComponent(tag, "ListBox", runtime.mappings.targetPackage, runtime)) {
      const isWrappedInTooltip = isWithinComponent(tag, "TooltipTrigger", runtime.mappings.targetPackage, runtime);

      return {
        to: "ListBoxItem",
        props:{
          mappings: {
            onClick: "onAction"
          }
        },
        todoComments: isWrappedInTooltip
          ? getTodoComment("listbox_item_tooltip_not_supported")
          : undefined
      };
    }
  }] 
} satisfies Record<string, ComponentMapping>;

export const listBoxSectionMappings = {
  Section: [(tag, runtime) => {
    if (isWithinComponent(tag, "ListBox", runtime.mappings.targetPackage, runtime)) {
      const titleValue = getAttributeValue(tag.node, "title");

      addChildrenTo(tag, "Header", [titleValue], runtime);     

      return {
        to: "ListBoxSection",
        props: {
          removals: ["title"]
        }        
      };
    }
  }]
} satisfies Record<string, ComponentMapping>;