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

const createGapMapper =
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
      } else if (isGlobalValue(value, ["normal", "0"])) {
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

export const gapMapper = createGapMapper("gap", "UNSAFE_gap");
export const rowGapMapper = createGapMapper("rowGap", "UNSAFE_rowGap");
export const columnGapMapper = createGapMapper("columnGap", "UNSAFE_columnGap");
