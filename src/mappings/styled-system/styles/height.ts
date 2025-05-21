import { PropertyMapperFunction } from "../../../utils/types.js";
import {
  isGlobalValue,
  isPercentageValue,
  tryGettingLiteralValue,
} from "../../helpers.js";
import { StyledSystemPropertyMapper } from "../types.js";

export const heightMapper: StyledSystemPropertyMapper = (oldValue, { j }) => {
  const value = tryGettingLiteralValue(oldValue);
  if (value !== null) {
    if (typeof value === "number") {
      return {
        to: "height",
        value: j.literal(`core_${value}`),
      };
    } else if (isGlobalValue(value)) {
      return {
        to: "height",
        value: oldValue,
      };
    } else if (isPercentageValue(value)) {
      return {
        to: "height",
        value: oldValue,
      };
    }

    return {
      to: "UNSAFE_height",
      value: oldValue,
    };
  }
  return null;
};
