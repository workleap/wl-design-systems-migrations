import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";
import { buttonMapping } from "./button.ts";

export const toggleButtonMapping = {
  ToggleButton: {
    props: {
      mappings: {
        ...buttonMapping.Button.props.mappings,        
        value: "id",
        checked: "isSelected",
        defaultChecked: "defaultSelected",
        onChange: () => ({
          todoComments: getTodoComment("toggle_button_on_change_not_supported")
        })
      }
    }
  },
  ToggleButtonProps: "ToggleButtonProps"
} satisfies Record<string, ComponentMapping>;
