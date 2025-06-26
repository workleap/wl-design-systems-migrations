import type { ComponentMapping } from "../../../utils/types.ts";

export const alertMapping = {
  Alert: {
    props: {
      mappings: {
        "dismissable": "isDismissable",
        "wrapperProps": "overlayProps",
        "onClose": () => ({ 
          todoComments: "`onClose` is removed. Use the `onOpenChange` callback on `AlertTrigger` instead." 
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
        "open": "isOpen",
        "zIndex": () => ({ todoComments: "`zIndex` is not supported anymore. Remove it, or move it to `Alert` component instead." })
      }
    }
  },
  AlertTriggerProps: "AlertTriggerProps"
} satisfies Record<string, ComponentMapping>;