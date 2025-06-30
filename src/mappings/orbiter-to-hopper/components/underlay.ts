import { hasAttribute } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";
import { getMigrationNote } from "../message-utils.ts";

export const underlayMapping = {
  Underlay: {
    to: "Div",
    props: {
      additions: {
        "aria-hidden": "true",
        position: "fixed",
        top: 0,
        left: 0,
        width: tag => {
          if (!hasAttribute(tag.node, ["width", "UNSAFE_width"])) {
            return "100%";
          }
        },
        height: tag => {
          if (!hasAttribute(tag.node, ["height", "UNSAFE_height"])) {
            return "100%";
          }
        },
        UNSAFE_backgroundColor: tag => {
          if (!hasAttribute(tag.node, ["backgroundColor", "UNSAFE_backgroundColor"])) {
            return "rgba(60, 60, 60, 0.6)";
          }
        },
        overflow: "hidden",
        style: { isolation: "isolate" }
      }
    },
    migrationNotes: getMigrationNote("underlay_mapped_to_div_review")
  },
  UnderlayProps: {
    skipImport: true 
  }
} satisfies Record<string, ComponentMapping>;
