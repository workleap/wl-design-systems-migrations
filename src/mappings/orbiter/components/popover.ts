import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";

export const popoverMapping = {
  Popover: {
    props: {
      mappings: {
        dismissable:  () => ({ todoComments: getTodoComment("popover_dismissable_not_supported") }),
        focus: () => ({ todoComments: getTodoComment("popover_focus_not_supported") })
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
        position:() => ({ todoComments: getTodoComment("popoverTrigger_position_moved_to_popover") }),
        zIndex: () => ({ todoComments: getTodoComment("popoverTrigger_z_index_not_supported") })
      }
    }
  },
  PopoverTriggerProps: "PopoverTriggerProps"
} satisfies Record<string, ComponentMapping>;