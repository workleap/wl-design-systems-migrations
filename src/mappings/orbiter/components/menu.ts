import { addChildrenTo, getAttributeValue, isWithinComponent } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";

export const menuMapping = {
  Menu: {
    to: "Menu",
    props: {
      mappings: {
        autoFocusTarget: () => ({
          todoComments: "`autoFocusTarget` is removed. More details: https://hopper.workleap.design/components/Menu#migration-notes"
        }),
        nodes: () => ({
          todoComments: "`nodes` is removed. Use dynamic items instead. An example: https://hopper.workleap.design/components/Menu#usage-dynamic-items"
        }),
        disabled: () => ({
          todoComments: "`disabled` has been removed, set the disabled items as disabledKeys instead. More details: https://hopper.workleap.design/components/Menu#migration-notes"
        }),
        fluid: () => ({
          todoComments: "`fluid` has been removed. More details: https://hopper.workleap.design/components/Menu#migration-notes"
        }),
        validationState: () => ({
          todoComments: "`validationState` has been removed. `isInvalid` should be used instead on the MenuItem. More details: https://hopper.workleap.design/components/Menu#migration-notes"
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
        allowPreventOverflow:() => ({ todoComments: "`allowPreventOverflow` has been removed. More details https://hopper.workleap.design/components/Menu#migration-notes" }),
        closeOnSelect: "shouldCloseOnSelect",
        zIndex: () => ({ todoComments: "`zIndex` is not supported anymore. Remove it, or move it to `Menu` component instead." })

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
          ? "Menu Items cannot be wrapped in `TooltipTrigger` anymore. You can reach out to #wl-hopper-migration-devs team if you need help with this migration."
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