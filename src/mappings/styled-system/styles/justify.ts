import { isGlobalValue, tryGettingLiteralValue } from "../../helpers.js";
import {
  HopperStyledSystemPropsKeys,
  StyledSystemPropertyMapper,
} from "../types.js";

const createJustifyMapper =
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

      // justify props allow string in Hopper too,
      // but it should not be a valid case.
      // so we ask to review it.
      return {
        to: `REVIEWME_${propertyName}`,
        value: oldValue,
      };
    }
    return null;
  };

export const justifyContentMapper = createJustifyMapper("justifyContent", [
  "center",
  "start",
  "end",
  "flex-start",
  "flex-end",
  "left",
  "right",
  "normal",
  "space-between",
  "space-around",
  "space-evenly",
  "stretch",
]);

export const justifyItemsMapper = createJustifyMapper("justifyItems", [
  "normal",
  "stretch",
  "center",
  "start",
  "end",
  "flex-start",
  "flex-end",
  "self-start",
  "self-end",
  "left",
  "right",
  "baseline",
  "legacy",
]);

export const justifySelfMapper = createJustifyMapper("justifySelf", [
  "auto",
  "normal",
  "stretch",
  "center",
  "start",
  "end",
  "flex-start",
  "flex-end",
  "self-start",
  "self-end",
  "left",
  "right",
  "baseline",
]);
