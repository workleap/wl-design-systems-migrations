import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";
import { iconButtonMapping } from "./iconButton.ts";

export const iconButtonAsLinkMapping = {
  IconButtonAsLink: {
    to: "LinkButton",
    props: {
      mappings: {
        ...iconButtonMapping.IconButton.props.mappings,
        loading: () => ({
          todoComments: getTodoComment("button_loading_not_supported")
        })
      }
    },
    todoComments: getTodoComment("button_as_link_external_note")
  },
  ButtonAsLinkProps: "LinkButtonProps"
} satisfies Record<string, ComponentMapping>;
