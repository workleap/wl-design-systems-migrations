import {
  isGlobalValue,
  isPaddingTokenValue,
  tryGettingLiteralValue,
} from "../../helpers.js";
import {
  HopperStyledSystemPropsKeys,
  StyledSystemPropertyMapper,
} from "../types.js";

const createPaddingMapper =
  (
    propertyName: HopperStyledSystemPropsKeys,
    unsafePropertyName: HopperStyledSystemPropsKeys,
    complexPadding: boolean = false
  ): StyledSystemPropertyMapper =>
  (oldValue, { j }) => {
    const value = tryGettingLiteralValue(oldValue);
    if (value !== null) {
      if (typeof value === "number") {
        return {
          to: propertyName,
          value: j.stringLiteral(`core_${value}`),
        };
      } else if (isGlobalValue(value)) {
        return {
          to: propertyName,
          value: oldValue,
        };
      } else if (isPaddingTokenValue(value, complexPadding)) {
        return {
          to: propertyName,
          value: oldValue,
        };
      }

      return {
        to: unsafePropertyName,
        value: oldValue,
      };
    }
    return null;
  };

export const paddingMapper = createPaddingMapper(
  "padding",
  "UNSAFE_padding",
  true
);
export const paddingBottomMapper = createPaddingMapper(
  "paddingBottom",
  "UNSAFE_paddingBottom"
);
export const paddingLeftMapper = createPaddingMapper(
  "paddingLeft",
  "UNSAFE_paddingLeft"
);
export const paddingRightMapper = createPaddingMapper(
  "paddingRight",
  "UNSAFE_paddingRight"
);
export const paddingTopMapper = createPaddingMapper(
  "paddingTop",
  "UNSAFE_paddingTop"
);
export const paddingXMapper = createPaddingMapper(
  "paddingX",
  "UNSAFE_paddingX"
);
export const paddingYMapper = createPaddingMapper(
  "paddingY",
  "UNSAFE_paddingY"
);
