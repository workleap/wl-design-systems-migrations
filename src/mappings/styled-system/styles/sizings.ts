import {
  isGlobalValue,
  isPercentageValue,
  tryGettingLiteralValue,
} from "../../helpers.js";
import {
  HopperStyledSystemPropsKeys,
  StyledSystemPropertyMapper,
} from "../types.js";

export const createSizingMapper =
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
      } else if (
        isGlobalValue(value, [
          "auto",
          "fit-content",
          "max-content",
          "min-content",
        ])
      ) {
        return {
          to: propertyName,
          value: oldValue,
        };
      } else if (isPercentageValue(value)) {
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

export const widthMapper = createSizingMapper("width", "UNSAFE_width");
export const heightMapper = createSizingMapper("height", "UNSAFE_height");
export const minWidthMapper = createSizingMapper("minWidth", "UNSAFE_minWidth");
export const minHeightMapper = createSizingMapper(
  "minHeight",
  "UNSAFE_minHeight"
);
export const maxWidthMapper = createSizingMapper("maxWidth", "UNSAFE_maxWidth");
export const maxHeightMapper = createSizingMapper(
  "maxHeight",
  "UNSAFE_maxHeight"
);
