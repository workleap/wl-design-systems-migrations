import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";

export const alertMapping = {
  Alert: {
    props: {
      mappings: {
        dismissable: "isDismissable",
        wrapperProps: "overlayProps",
        onClose: () => ({ 
          todoComments: getTodoComment("alert_on_close_removed")
        })
      }
    }
  },
  AlertProps: "AlertProps"
} satisfies Record<string, ComponentMapping>;

export const alertTriggerMapping = {
  AlertTrigger: {
    props: {
      mappings: {
        open: "isOpen",
        zIndex: () => ({ todoComments: getTodoComment("alert_trigger_z_index_not_supported") })
      }
    }
  },
  AlertTriggerProps: "AlertTriggerProps"
} satisfies Record<string, ComponentMapping>;