import type { ComponentMapping } from "../../../utils/types.ts";

export const popoverMapping = {
  Popover: {
    props: {
      mappings: {
        dismissable:  () => ({ todoComments: "`dismissable` is not supported anymore. Remove it, or discuss it with the Hopper team if you have any questions." }),
        focus: () => ({ todoComments: "`focus` is not supported anymore. Remove it, or discuss it with the Hopper team if you have any questions." })
      }
    }
  },
  PopoverProps: "PopoverProps"
} satisfies Record<string, ComponentMapping>;

export const popoverTriggerMapping = {
  PopoverTrigger: {
    props: {
      mappings: {
        open: "isOpen",
        position:() => ({ todoComments: "`position` property has been moved to the `Popover` component and renamed to `placement`. More details: https://hopper.workleap.design/components/Popover#migration-notes " }),
        zIndex: () => ({ todoComments: "`zIndex` is not supported anymore. Remove it, or move it to `Popover` component instead." })
      }
    }
  },
  PopoverTriggerProps: "PopoverTriggerProps"
} satisfies Record<string, ComponentMapping>;