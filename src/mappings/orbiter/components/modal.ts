import { getReviewMePropertyName } from "../../../utils/mapping.ts";
import type { ComponentMapMetaData } from "../../../utils/types.ts";

export const modalMapping = {
  Modal: {
    props: {
      mappings: {
        "dismissable": "isDismissible",
        "wrapperProps": "overlayProps",
        "onClose": () => ({ 
          to: getReviewMePropertyName("onOpenChange"), 
          todoComments: "`onClose` is not supported anymore. Use `onOpenChange` instead." 
        })
      }
    }
  },
  ModalProps: "ModalProps"
} satisfies Record<string, ComponentMapMetaData>;

export const modalTriggerMapping = {
  ModalTrigger: {
    props: {
      mappings: {
        "open": "isOpen",
        "dismissable": () => ({ todoComments: "`dismissable` is not supported anymore. Use `isDismissible` prop at related `Modal` component instead." })       
      }
    }
  },
  ModalTriggerProps: "ModalTriggerProps"
} satisfies Record<string, ComponentMapMetaData>;