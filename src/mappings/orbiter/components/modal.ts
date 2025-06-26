import { getReviewMePropertyName } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";

export const modalMapping = {
  Modal: {
    props: {
      mappings: {
        "dismissable": "isDismissable",
        "wrapperProps": "overlayProps",
        "onClose": () => ({ 
          to: getReviewMePropertyName("onOpenChange"), 
          todoComments: "`onClose` is not supported anymore. Use `onOpenChange` instead." 
        })
      }
    }
  },
  ModalProps: "ModalProps"
} satisfies Record<string, ComponentMapping>;

export const modalTriggerMapping = {
  ModalTrigger: {
    props: {
      mappings: {
        "open": "isOpen",
        "dismissable": () => ({ todoComments: "`dismissable` is not supported anymore. Use `isDismissable` prop at related `Modal` component instead." })       
      }
    }
  },
  ModalTriggerProps: "ModalTriggerProps"
} satisfies Record<string, ComponentMapping>;