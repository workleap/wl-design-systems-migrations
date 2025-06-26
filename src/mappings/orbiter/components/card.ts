import { tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";

export const cardMapping = {
  Card: {
    props: {
      mappings: {
        "fluid": () => ({ 
          todoComments: "`fluid` is removed. Use the provided `OrbiterCard` shim or check this example to see an implementation example: https://hopper.workleap.design/components/Card#fluid" 
        }),
        "orientation": () => ({ 
          todoComments: "`orientation` is removed. Use the provided `OrbiterCard` shim or check this example to see an implementation example: https://hopper.workleap.design/components/Card#orientation" 
        }),
        "size": () => ({ 
          todoComments: "`size` is removed. Use the provided `OrbiterCard` shim or check this example to see an implementation example: https://hopper.workleap.design/components/Card#size" 
        }),
        "variant": (originalValue, runtime) => {
          const value = tryGettingLiteralValue(originalValue, runtime);
          const map: Record<string, string> = {
            "outline": "main",
            "elevated": "second-level"
          };
          const newValue = typeof value === "string" && value in map ? map[value] : undefined;

          return {
            value: newValue ? runtime.j.stringLiteral(newValue) : undefined,
            todoComments: newValue === map["elevated"] ? "You shouldn't use a second-level variant without a parent main variant. More details: https://hopper.workleap.design/components/Card#migration-notes" : undefined
          };
        }
      }
    },
    todoComments: "The `Card` component has significant changes. You can use this provided `OrbiterCard` shim to make it work: https://github.com/workleap/orbiter-to-hopper-codemods/blob/main/src/mappings/orbiter/shims/OrbiterCard.tsx"
  },
  CardProps: "CardProps"
} satisfies Record<string, ComponentMapping>;