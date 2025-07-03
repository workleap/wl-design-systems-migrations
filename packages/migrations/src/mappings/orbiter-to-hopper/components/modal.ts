import { getReviewMePropertyName } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";

export const modalMapping = {
  Modal: {
    props: {
      mappings: {
        dismissable: "isDismissable",
        wrapperProps: "overlayProps",
        onClose: () => ({ 
          to: getReviewMePropertyName("onOpenChange"), 
          todoComments: getTodoComment("modal_on_close_not_supported")
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
        open: "isOpen",
        dismissable: () => ({ todoComments: getTodoComment("modal_trigger_dismissable_not_supported") })
      }
    }
  },
  ModalTriggerProps: "ModalTriggerProps"
} satisfies Record<string, ComponentMapping>;