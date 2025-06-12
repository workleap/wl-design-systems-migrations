import { hasAttribute } from "../../../utils/mapping.ts";
import type { ComponentMapMetaData } from "../../../utils/types.ts";

export const illustrationMapping = {
  Illustration: {
    to: "Div",
    props:{
      additions:{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }
    }
  },
  IllustrationProps: "IllustrationProps",

  IllustratedMessage: {
    todoComments: tag => {
      const msgs = [];
      if (hasAttribute(tag.node, "orientation")) {
        msgs.push("orientation has been removed. Refer to this sample(https://hopper.workleap.design/components/IllustratedMessage#horizontal) to see an implementation example for a horizontal orientation.");
      }
      if (hasAttribute(tag.node, ["width", "height", "UNSAFE_height", "UNSAFE_width"])) {
        msgs.push("width and height prop will now affect the whole wrapper instead of just the image. Details: https://hopper.workleap.design/components/IllustratedMessage#migration-notes");
      }

      return msgs;
    }
  },
  IllustratedMessageProps: "IllustratedMessageProps"
} satisfies Record<string, ComponentMapMetaData>;
