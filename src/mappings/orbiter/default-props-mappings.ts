import type { PropsMapping } from "../../utils/types.ts";
import { styledSystemPropsMappings } from "./styled-system/mappings.ts";

export const defaultPropsMappings = {
  ...styledSystemPropsMappings,
  disabled: "isDisabled",
  readOnly: "isReadOnly",
  "min-width": originalValue => ({
    to: "min-width",
    value: originalValue,
    todoComments: "It seems it is an invalid property. Remove it if it is not needed"
  }),
  active: () => ({
    todoComments: "`active` is not supported anymore. Find an alternative solution. If the use case is to implement the toggle status, you can use the ToggleButton. More details: https://hopper.workleap.design/components/ToggleButton"
  }),
  focus: () => ({
    todoComments: "`focus` is not supported anymore. Find an alternative solution"
  }),
  hover: () => ({
    todoComments: "`hover` is not supported anymore. Find an alternative solution"
  })
} satisfies PropsMapping;
