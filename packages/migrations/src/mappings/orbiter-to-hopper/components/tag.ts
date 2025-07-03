import { tryGettingLiteralValue } from "../../../utils/mapping.ts";
import type { ComponentMapping } from "../../../utils/types.ts";
import { getTodoComment } from "../message-utils.ts";

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
            todoComments: getTodoComment("tag_fluid_not_supported")
          };
        },

        onClick: () => ({
          todoComments: getTodoComment("tag_on_click_not_supported")
        }),

        onRemove: () => ({
          todoComments: getTodoComment("tag_on_remove_not_supported")
        }),

        title: () => ({
          todoComments: getTodoComment("tag_title_not_supported")
        }),

        onKeyDown: () => ({
          todoComments: getTodoComment("tag_on_key_down_not_supported")
        }),

        tabIndex: () => ({
          todoComments: getTodoComment("tag_tab_index_not_supported")
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
              todoComments: getTodoComment("tag_validation_state_not_supported")
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
              todoComments: getTodoComment("tag_variant_mapping")
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