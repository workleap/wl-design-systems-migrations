import { tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";

export const tagMapping = {
  Tag: {
    props: {
      mappings: {    
        fluid: (originalValue, runtime) => {
          const { j } = runtime;
          const value = tryGettingLiteralValue(originalValue, runtime);
          if (!originalValue || Boolean(value) != false) {
            return {
              to: "width",
              value: j.stringLiteral("100%")
            };
          }

          return {
            todoComments: "`fluid` is not supported anymore. You can use width=100% instead. More details: https://hopper.workleap.design/components/Tag#migration-notes"
          };
        },

        onClick: () => ({
          todoComments: "`onClick` is not supported anymore. Alternative solution is to wrap it inside a `TagGroup` and use `onSelectionChange` callback. More details: https://hopper.workleap.design/components/Tag#migration-notes"
        }),

        onRemove: () => ({
          todoComments: "`onRemove` is not supported anymore. Alternative solution is to wrap it inside a `TagGroup` and use its `onRemove` callback. More details: https://hopper.workleap.design/components/TagGroup#usage-removable"
        }),

        title: () => ({
          todoComments: "`title` is not supported anymore. Wrap it inside a `Tooltip` component instead. More details: https://hopper.workleap.design/components/Tag#migration-notes"
        }),

        onKeyDown: () => ({
          todoComments: "`onKeyDown` is not supported anymore. Alternative solution is to wrap it inside a `TagGroup` and use `onSelectionChange` callback. More details: https://hopper.workleap.design/components/Tag#migration-notes"
        }),

        tabIndex: () => ({
          todoComments: "`tabIndex` is not supported anymore. Check if it is relevant, but probably it is safe to remove. More details: https://hopper.workleap.design/components/Tag#migration-notes"
        }),

        validationState: (originalValue, runtime) => {
          const { j } = runtime;
          const value = tryGettingLiteralValue(originalValue, runtime);
          if (value === "invalid") {
            return {
              to: "isInvalid",
              value: null
            };
          } else if (value === "valid") {
            return {            
              to: "isInvalid",
              value: j.jsxExpressionContainer(j.booleanLiteral(false))
            };
          } else {
            return {             
              todoComments: "The `validationState` prop is not supported anymore. Use `isInvalid` prop instead. More details: https://hopper.workleap.design/components/Tag#migration-notes"
            };
          }
        },

        variant: (originalValue, runtime) => {
          const value = tryGettingLiteralValue(originalValue, runtime);
          if (value === "solid") {
            return {
              to: "variant",
              value: runtime.j.stringLiteral("subdued")
            };
          } else if (value === "outline") {
            return {
              to: "variant",
              value: runtime.j.stringLiteral("neutral")
            };
          } else {
            return {
              todoComments: "Map `solid`->`subdued` and `outline`->`neutral` manually if needed. More details: https://hopper.workleap.design/components/Tag#migration-notes"
            };
          }
        }
      },
      additions: {
        variant: "subdued"
      }     
    }
  },
  TagProps: "TagProps"
} satisfies Record<string, ComponentMapping>;

export const tagListMapping = {
  TagList: "TagGroup",
  TagListProps: "TagGroupProps"
} satisfies Record<string, ComponentMapping>;  