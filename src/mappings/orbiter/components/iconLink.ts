import type { ComponentMapping } from "../../../utils/types.ts";
import { linkMapping } from "./link.ts";
import { textLinkMapping } from "./textLink.ts";

export const iconLinkMapping = {
  IconLink: {
    to: "Link",
    props: {
      mappings: {
        ...linkMapping.Link.props.mappings,
        variant: textLinkMapping.TextLink.props.mappings.variant
      }
    }
  },
  IconLinkProps: "LinkProps"
} satisfies Record<string, ComponentMapping>;

export const iconLinkAsButtonMapping = {
  IconLinkAsButton: {
    ...iconLinkMapping.IconLink
  },
  IconLinkAsButtonProps: "LinkProps"
} satisfies Record<string, ComponentMapping>;
