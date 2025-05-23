import { isGlobalValue, tryGettingLiteralValue } from "../../helpers.js";
import {
  HopperStyledSystemPropsKeys,
  StyledSystemPropertyMapper,
} from "../types.js";

const createAlignmentMapper =
  (
    propertyName: HopperStyledSystemPropsKeys,
    validValues: string[]
  ): StyledSystemPropertyMapper =>
  (oldValue, { j }) => {
    const value = tryGettingLiteralValue(oldValue);
    if (value !== null) {
      if (isGlobalValue(value, validValues)) {
        return {
          to: propertyName,
          value: oldValue,
        };
      }

      // alignment props allow string in Hopper too,
      // but it should not be a valid case.
      // so we ask to review it.
      return {
        to: `REVIEWME_${propertyName}`,
        value: oldValue,
      };
    }
    return null;
  };

export const alignContentMapper = createAlignmentMapper("alignContent", [
  "center",
  "start",
  "end",
  "flex-start",
  "flex-end",
  "normal",
  "baseline",
  "stretch",
  "space-between",
  "space-around",
  "space-evenly",
]);

export const alignItemsMapper = createAlignmentMapper("alignItems", [
  "center",
  "start",
  "end",
  "flex-start",
  "flex-end",
  "normal",
  "baseline",
  "stretch",
]);

export const alignSelfMapper = createAlignmentMapper("alignSelf", [
  "auto",
  "center",
  "start",
  "end",
  "flex-start",
  "flex-end",
  "normal",
  "baseline",
  "stretch",
]);
