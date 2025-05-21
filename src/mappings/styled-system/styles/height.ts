import { PropertyMapperFunction } from "../../../utils/types.js";
import {
  getSizingPropertyMapper,
  isGlobalValue,
  isPercentageValue,
  tryGettingLiteralValue,
} from "../../helpers.js";
import { StyledSystemPropertyMapper } from "../types.js";

export const heightMapper = getSizingPropertyMapper("height", "UNSAFE_height");
