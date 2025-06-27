import { hasAttribute } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";

export const illustrationMapping = {
  Illustration: {
    to: "Illustration"   
  },
  IllustrationProps: "IllustrationProps",

  IllustratedMessage: {
    todoComments: tag => {
      const msgs = [];
      if (hasAttribute(tag.node, "orientation")) {
        msgs.push(getTodoComment("illustration_orientation_removed"));
      }
      if (hasAttribute(tag.node, ["width", "height", "UNSAFE_height", "UNSAFE_width"])) {
        msgs.push(getTodoComment("illustration_width_height_wrapper"));
      }

      return msgs;
    }
  },
  IllustratedMessageProps: "IllustratedMessageProps"
} satisfies Record<string, ComponentMapping>;
