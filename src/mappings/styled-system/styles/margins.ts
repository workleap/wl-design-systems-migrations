import {
  isGlobalValue,
  isPercentageValue,
  isSimpleMarginTokenValue,
  tryGettingLiteralValue,
} from "../../helpers.js";
import {
  HopperStyledSystemPropsKeys,
  StyledSystemPropertyMapper,
} from "../types.js";

const createMarginMapper =
  (
    propertyName: HopperStyledSystemPropsKeys,
    unsafePropertyName: HopperStyledSystemPropsKeys
  ): StyledSystemPropertyMapper =>
  (oldValue, { j }) => {
    const value = tryGettingLiteralValue(oldValue);
    if (value !== null) {
      if (typeof value === "number") {
        return {
          to: propertyName,
          value: j.literal(`core_${value}`),
        };
      } else if (isGlobalValue(value)) {
        return {
          to: propertyName,
          value: oldValue,
        };
      } else if (isSimpleMarginTokenValue(value)) {
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

export const marginMapper = createMarginMapper("margin", "UNSAFE_margin");
export const marginBottomMapper = createMarginMapper(
  "marginBottom",
  "UNSAFE_marginBottom"
);
export const marginLeftMapper = createMarginMapper(
  "marginLeft",
  "UNSAFE_marginLeft"
);
export const marginRightMapper = createMarginMapper(
  "marginRight",
  "UNSAFE_marginRight"
);
export const marginTopMapper = createMarginMapper(
  "marginTop",
  "UNSAFE_marginTop"
);
export const marginXMapper = createMarginMapper("marginX", "UNSAFE_marginX");
export const marginYMapper = createMarginMapper("marginY", "UNSAFE_marginY");
