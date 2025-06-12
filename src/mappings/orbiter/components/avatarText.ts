import { tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapMetaData } from "../../../utils/types.ts";

export const avatarTextMapping = {
  AvatarText: {
    to: "Text",
    props: {
      mappings: {
        onClick: "onPress",
        size: (originalValue, runtime) => {
          const value = tryGettingLiteralValue(originalValue, runtime);
          if (typeof value === "string" && ["inherit", "xs", "sm", "md", "lg", "xl", "2xl"].includes(value)) {
            return {
              value: originalValue
            };
          }

          return {
            value: originalValue,
            todoComments: "Passed values is not supported. Use `inherit`, `xs`, `sm`, `md`, `lg`, `xl`, or `2xl`."
          };
        }
      },
      additions: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "transparent",
        style: {
          transition: "background-color var(--hop-easing-duration-2) var(--hop-easing-duration-2)"
        }
      }
    }
  },
  AvatarTextProps: "AvatarTextProps"

} satisfies Record<string, ComponentMapMetaData>;
