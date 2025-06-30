import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";

export const linkMapping = {
  Link: {
    props: {
      mappings: {
        external: "isExternal",
        onClick: "onPress",
        onMouseEnter: "onHoverStart",
        onMouseLeave: "onHoverEnd",
        onAuxClick: () => ({
          todoComments: getTodoComment("link_on_aux_click_not_supported")
        }),
        shape: () => ({
          todoComments: getTodoComment("link_shape_not_supported")
        })

      }
    }
  },
  LinkProps: "LinkProps"
} satisfies Record<string, ComponentMapping>;