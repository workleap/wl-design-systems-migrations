import { addChildrenTo, getAttributeValue, isWithinComponent, tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";

export const listboxMapping = {
  Listbox: {
    to: "ListBox",
    props: {
      mappings: {
        onSelectionChange: "onSelectionChange",
        zIndex: "zIndex",
        fluid: "isFluid",
        nodes: () => ({
          todoComments: "`nodes` is removed. Use dynamic list instead. An example: https://hopper.workleap.design/components/Listbox#usage-dynamic-lists" 
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
              todoComments: "The `validationState` prop is not supported anymore. Use `isInvalid` prop instead. More details: https://hopper.workleap.design/components/Listbox#migration-notes"
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
          ? "ListBox Items cannot be wrapped in `TooltipTrigger` anymore. You can reach out to #wl-hopper-migration-devs team if you need help with this migration."
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