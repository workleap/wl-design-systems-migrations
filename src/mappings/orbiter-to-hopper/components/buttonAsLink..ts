import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";
import { buttonMapping } from "./button.ts";

export const buttonAsLinkMapping = {
  ButtonAsLink: {
    to: "LinkButton",
    ...buttonMapping.Button,
    props: {
      mappings: {
        ...buttonMapping.Button.props.mappings,
        loading: () => ({
          todoComments: getTodoComment("button_loading_not_supported")
        })
      }
    },
    todoComments: getTodoComment("button_as_link_external_note")
  },
  ButtonAsLinkProps: "LinkButtonProps"
} satisfies Record<string, ComponentMapping>;
