import type { PropsMapping } from "../../utils/types.ts";
import { getTodoComment } from "./message-utils.ts";
import { styledSystemPropsMappings } from "./styled-system/mappings.ts";

export const defaultPropsMappings = {
  ...styledSystemPropsMappings,
  disabled: "isDisabled",
  readOnly: "isReadOnly",
  "min-width": originalValue => ({
    to: "min-width",
    value: originalValue,
    todoComments: getTodoComment("all_components_min_width_invalid")
  }),
  active: () => ({
    todoComments: getTodoComment("all_components_active_not_supported")
  }),
  focus: () => ({
    todoComments: getTodoComment("all_components_focus_not_supported")
  }),
  hover: () => ({
    todoComments: getTodoComment("all_components_hover_not_supported")
  })
} satisfies PropsMapping;
