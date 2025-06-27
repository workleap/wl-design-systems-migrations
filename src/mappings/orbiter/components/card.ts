import { tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";

export const cardMapping = {
  Card: {
    props: {
      mappings: { fluid: () => ({
        todoComments: getTodoComment("card_fluid_removed")
      }),
      orientation: () => ({
        todoComments: getTodoComment("card_orientation_removed")
      }),
      size: () => ({
        todoComments: getTodoComment("card_size_removed")
      }),
      variant: (originalValue, runtime) => {
        const value = tryGettingLiteralValue(originalValue, runtime);
        const map: Record<string, string> = {
          outline: "main",
          elevated: "second-level"
        };
        const newValue = typeof value === "string" && value in map ? map[value] : undefined;

        return {
          value: newValue ? runtime.j.stringLiteral(newValue) : undefined,
          todoComments: newValue === map["elevated"] ? getTodoComment("card_variant_second_level") : undefined
        };
      }
      }
    },
    todoComments: getTodoComment("card_significant_changes")
  },
  CardProps: "CardProps"
} satisfies Record<string, ComponentMapping>;