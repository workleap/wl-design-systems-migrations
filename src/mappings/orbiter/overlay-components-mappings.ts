import type { ComponentMapping } from "../../utils/types.ts";
import { alertMapping, alertTriggerMapping } from "./components/alert.ts";
import { modalMapping, modalTriggerMapping } from "./components/modal.ts";
import { overlayMapping } from "./components/overlay.ts";
import { popoverMapping, popoverTriggerMapping } from "./components/popover.ts";
import { tooltipMapping, tooltipTriggerMapping } from "./components/tooltip.ts";
import { underlayMapping } from "./components/underlay.ts";


export const overlayComponentsMappings: Record<string, ComponentMapping> = {

  ...modalMapping,
  ...modalTriggerMapping,
  ...popoverMapping,
  ...popoverTriggerMapping,
  ...tooltipMapping,
  ...tooltipTriggerMapping,
  ...overlayMapping,
  ...alertMapping,
  ...alertTriggerMapping,
  ...underlayMapping

};
