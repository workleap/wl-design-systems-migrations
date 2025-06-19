import type { ComponentMapMetaData } from "../../utils/types.ts";
import { modalMapping, modalTriggerMapping } from "./components/modal.ts";
import { overlayMapping } from "./components/overlay.ts";
import { popoverMapping, popoverTriggerMapping } from "./components/popover.ts";
import { tooltipMapping, tooltipTriggerMapping } from "./components/tooltip.ts";


export const overlayComponentsMappings: Record<string, ComponentMapMetaData> = {

  ...modalMapping,
  ...modalTriggerMapping,
  ...popoverMapping,
  ...popoverTriggerMapping,
  ...tooltipMapping,
  ...tooltipTriggerMapping,
  ...overlayMapping
  // Underlay: "Underlay", //usage: 1
  // UnderlayProps: "UnderlayProps",
  

  // Dialog: "Modal",  //usage: 0
  // DialogProps: "ModalProps",
  // DialogTrigger: "ModalTrigger", //usage: 0
  // DialogTriggerProps: "ModalTriggerProps",
  // OverlayArrow: "OverlayArrow", //usage: 0
  // OverlayArrowProps: "OverlayArrowProps",
};
