import { addChildrenTo, getAttributeValue, isWithinComponent } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";

export const menuMapping = {
  Menu: {
    to: "Menu",
    props: {
      mappings: {
        autoFocusTarget: () => ({
          todoComments: getTodoComment("menu_auto_focus_target_removed")
        }),
        nodes: () => ({
          todoComments: getTodoComment("menu_nodes_removed")
        }),
        disabled: () => ({
          todoComments: getTodoComment("menu_disabled_removed")
        }),
        fluid: () => ({
          todoComments: getTodoComment("menu_fluid_removed")
        }),
        validationState: () => ({
          todoComments: getTodoComment("menu_validation_state_removed")
        })
      }
    }
  },
  MenuProps: "MenuProps",
  ListItemMappings: []
} satisfies Record<string, ComponentMapping>;

export const menuTriggerMapping = {
  MenuTrigger: {
    props: {
      mappings: {
        open: "isOpen",
        direction: "direction",
        allowFlip: "allowFlip",
        onOpenChange: "onOpenChange",
        allowPreventOverflow:() => ({ todoComments: getTodoComment("menu_allow_prevent_overflow_removed") }),
        closeOnSelect: "shouldCloseOnSelect",
        zIndex: () => ({ todoComments: getTodoComment("menu_z_index_not_supported") })

      }
    }
  },
  MenuTriggerProps: "MenuTriggerProps"
} satisfies Record<string, ComponentMapping>;

export const menuItemMappings = {
  Item: [(tag, runtime) => {
    if (isWithinComponent(tag, "Menu", runtime.mappings.targetPackage, runtime)) {
      const isWrappedInTooltip = isWithinComponent(tag, "TooltipTrigger", runtime.mappings.targetPackage, runtime);

      return {
        to: "MenuItem",
        props:{
          mappings: {
            onClick: "onAction"
          }
        },
        todoComments: isWrappedInTooltip
          ? getTodoComment("menu_item_tooltip_not_supported")
          : undefined
      };
    }
  }]
} satisfies Record<string, ComponentMapping>;

export const menuSectionMappings = {
  Section: [(tag, runtime) => {
    if (isWithinComponent(tag, "Menu", runtime.mappings.targetPackage, runtime)) {
      const titleValue = getAttributeValue(tag.node, "title");

      addChildrenTo(tag, "Header", [titleValue], runtime);     

      return {
        to: "MenuSection",
        props: {
          removals: ["title"]
        }
      };
    }
  }]
} satisfies Record<string, ComponentMapping>;