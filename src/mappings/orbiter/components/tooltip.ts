import { tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";

export const tooltipMapping = {
  Tooltip: {
    props: {
      mappings: {
        "onMouseLeave":  () => ({ todoComments: "`onMouseLeave` is not supported anymore. If you really need it you can add it in a Div inside the tooltip if needed." }) 
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
        // eslint-disable-next-line max-len
        "onMouseLeave":  () => ({ todoComments: "`onMouseLeave` is not supported anymore since TooltipTrigger doesn't render an element.  You should move this property on the rendered element. For instance, if the trigger is a button, you should add onMouseLeave directly on the button instead." }) 
      }
    }
  },
  TooltipTriggerProps: "TooltipTriggerProps"
} satisfies Record<string, ComponentMapping>;