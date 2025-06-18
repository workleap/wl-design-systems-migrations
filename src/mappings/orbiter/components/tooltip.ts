import type { ComponentMapMetaData } from "../../../utils/types.ts";

export const tooltipMapping = {
  Tooltip: {
    props: {
      mappings: {
        "onMouseLeave":  () => ({ todoComments: "`onMouseLeave` is not supported anymore. Hopper has ContextualHelp component if it is used for this purpose. More details: https://hopper.workleap.design/components/ContextualHelp" }) //TODO: it is still under investigation.
      }
    }
  },
  TooltipProps: "TooltipProps"
} satisfies Record<string, ComponentMapMetaData>;

export const tooltipTriggerMapping = {
  TooltipTrigger: {
    props: {
      mappings: {
        open: "isOpen",
        "position":"placement", //TODO: it is still under investigation.
        "zIndex": () => ({ todoComments: "`zIndex` is not supported anymore. Remove it, or move it to `Tooltip` component instead." }),
        "onMouseLeave":  () => ({ todoComments: "`onMouseLeave` is not supported anymore. Hopper has ContextualHelp component if it is used for this purpose. More details: https://hopper.workleap.design/components/ContextualHelp" }) //TODO: it is still under investigation.
      }
    }
  },
  TooltipTriggerProps: "TooltipTriggerProps"
} satisfies Record<string, ComponentMapMetaData>;