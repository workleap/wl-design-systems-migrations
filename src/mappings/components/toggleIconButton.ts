import type { ComponentMapMetaData } from "../../utils/types.ts";
import { iconButtonMapping } from "./iconButton.ts";
import { toggleButtonMapping } from "./toggleButton.ts";

export const toggleIconButtonMapping = {
  ToggleIconButton: {
    to: "ToggleButton",
    props: {
      mappings: {
        ...toggleButtonMapping.ToggleButton.props.mappings,
        size: iconButtonMapping.IconButton.props.mappings.size
      }
    }
  },
  ToggleIconButtonProps: "ToggleIconButtonProps"
} satisfies Record<string, ComponentMapMetaData>;
