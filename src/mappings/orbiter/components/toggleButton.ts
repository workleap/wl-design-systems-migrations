import type { ComponentMapMetaData } from "../../../utils/types.ts";
import { buttonMapping } from "./button.ts";

export const toggleButtonMapping = {
  ToggleButton: {
    props: {
      mappings: {
        ...buttonMapping.Button.props.mappings,        
        "value": "id",
        "checked": "isSelected",
        "defaultChecked": "defaultSelected",
        onChange: () => ({
          todoComments: "`onChange` is not supported anymore. Remove it. More details: https://hopper.workleap.design/components/ToggleButton#migration-notes"
        })
      }
    }
  },
  ToggleButtonProps: "ToggleButtonProps"
} satisfies Record<string, ComponentMapMetaData>;
