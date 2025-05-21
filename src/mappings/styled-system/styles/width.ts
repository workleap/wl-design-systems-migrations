import { PropertyMapperFunction } from "../../../utils/types.js";
import {
  isGlobalValue,
  isPercentageValue,
  tryGettingLiteralValue,
} from "../../helpers.js";
import { StyledSystemPropertyMapper } from "../types.js";

export const widthMapper: StyledSystemPropertyMapper = (oldValue, { j }) => {
  const value = tryGettingLiteralValue(oldValue);
  if (value !== null) {
    if (typeof value === "number") {
      return {
        to: "width",
        value: j.literal(`core_${value}`),
      };
    } else if (isGlobalValue(value)) {
      return {
        to: "width",
        value: oldValue,
      };
    } else if (isPercentageValue(value)) {
      return {
        to: "width",
        value: oldValue,
      };
    }

    return {
      to: "UNSAFE_width",
      value: oldValue,
    };
  }
  return null;
};
