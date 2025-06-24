import { tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";

export const tooltipMapping = {
  Tooltip: {
    props: {
      mappings: {
        "onMouseLeave":  () => ({ todoComments: "`onMouseLeave` is not supported anymore. Hopper has ContextualHelp component if it is used for this purpose. More details: https://hopper.workleap.design/components/ContextualHelp" }) 
      }
    }
  },
  TooltipProps: "TooltipProps"
} satisfies Record<string, ComponentMapping>;

export const tooltipTriggerMapping = {
  TooltipTrigger: {
    props: {
      mappings: {
        open: "isOpen",
        "position": (originalValue, runtime) => {          
          const { j } = runtime;
          const value = tryGettingLiteralValue(originalValue, runtime);          


          if (value && typeof value === "string") {
            if (["top-start", "top-end", "bottom-start", "bottom-end", "right-start", "right-end", "left-start", "left-end"].includes(value)) {
              return {
                to: "placement",
                value:  j.literal(value.split("-")[0] ?? value) 
              };
            } else if (value.startsWith("auto")) {
              return {
                to: "placement",
                value: j.jsxExpressionContainer(j.identifier("undefined"))
              };
            }
          }            
          
          return {
            to: "placement"
          };
        },
        "zIndex": () => ({ todoComments: "`zIndex` is not supported anymore. Remove it, or move it to `Tooltip` component instead." }),
        "onMouseLeave":  () => ({ todoComments: "`onMouseLeave` is not supported anymore. Hopper has ContextualHelp component if it is used for this purpose. More details: https://hopper.workleap.design/components/ContextualHelp" }) //TODO: it is still under investigation.
      }
    }
  },
  TooltipTriggerProps: "TooltipTriggerProps"
} satisfies Record<string, ComponentMapping>;