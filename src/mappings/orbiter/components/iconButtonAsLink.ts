import type { ComponentMapping } from "../../../utils/types.ts";
import { iconButtonMapping } from "./iconButton.ts";

export const iconButtonAsLinkMapping = {
  IconButtonAsLink: {
    to: "LinkButton",
    props: {
      mappings: {
        ...iconButtonMapping.IconButton.props.mappings,
        loading: () => ({
          todoComments: "`loading` is not supported anymore. Remove it."
        })
      }
    },
    todoComments:
      "If the link is external, you need to set `isExternal` property accordingly. It opens the url in a new tab. " +
      "But if you need a full page reload instead of client-side routing, follow this: " +
      "https://workleap.atlassian.net/wiki/spaces/~62b0cfb467dff38e0986a1c1/pages/5413634146/29+May+2025+Hopper+migration+feedback"
  },
  ButtonAsLinkProps: "LinkButtonProps"
} satisfies Record<string, ComponentMapping>;
