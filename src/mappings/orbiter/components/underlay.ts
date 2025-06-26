import { hasAttribute } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";

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
    migrationNotes: "`Underlay` is mapped to `Div`. Please review it to ensure it meets your requirements. More details: https://workleap.atlassian.net/browse/SSD-2565?focusedCommentId=198239"
  },
  UnderlayProps: {
    skipImport: true 
  }
} satisfies Record<string, ComponentMapping>;
