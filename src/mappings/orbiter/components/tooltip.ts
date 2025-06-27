import { tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";

export const tooltipMapping = {
  Tooltip: {
    props: {
      mappings: {
        onMouseLeave:  () => ({ todoComments: getTodoComment("tooltip_on_mouse_leave_not_supported") }) 
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
        position: (originalValue, runtime) => {          
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
        zIndex: () => ({ todoComments: getTodoComment("tooltip_z_index_not_supported") }),
        // eslint-disable-next-line max-len
        onMouseLeave:  () => ({ todoComments: getTodoComment("tooltip_on_mouse_leave_trigger_not_supported") })
      }
    }
  },
  TooltipTriggerProps: "TooltipTriggerProps"
} satisfies Record<string, ComponentMapping>;