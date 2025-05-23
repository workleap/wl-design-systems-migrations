import {
  hasCoreVersionKey,
  hasSameKey,
  isFrValue,
  isGlobalValue,
  isPercentageValue,
  tryGettingLiteralValue,
} from "../../helpers.js";
import {
  HopperStyledSystemPropsKeys,
  StyledSystemPropertyMapper,
} from "../types.js";

import { SizingMapping as HopperSizingMapping } from "@hopper-ui/components";
import { SizingMapping as OrbiterSizingMapping } from "@workleap/orbiter-ui";

const createGridMapper =
  (
    propertyName: HopperStyledSystemPropsKeys,
    unsafePropertyName: HopperStyledSystemPropsKeys,
    validValues: (string | number)[] = []
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

      if (
        (typeof value === "string" || typeof value === "number") &&
        hasCoreVersionKey(
          value.toString(),
          OrbiterSizingMapping,
          HopperSizingMapping
        )
      ) {
        return {
          to: propertyName,
          value: j.stringLiteral(`core_${value}`),
        };
      }

      if (isPercentageValue(value) || isFrValue(value)) {
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

// Grid property mappers
export const gridMapper = "grid";
export const gridAreaMapper = "gridArea";
export const gridColumnMapper = "gridColumn";
export const gridColumnStartMapper = "gridColumnStart";
export const gridColumnEndMapper = "gridColumnEnd";
export const gridRowMapper = "gridRow";
export const gridRowStartMapper = "gridRowStart";
export const gridRowEndMapper = "gridRowEnd";
export const gridTemplateMapper = "gridTemplate";
export const gridTemplateAreasMapper = "gridTemplateAreas";
export const gridAutoFlowMapper = "gridAutoFlow";
export const gridColumnSpanMapper = "gridColumnSpan"; //although it has UNSAFE_gridColumnSpan version too, their types are always number. so the unsafe version is not required
export const gridRowSpanMapper = "gridRowSpan"; //although it has UNSAFE_gridRowSpan version too, their types are always number. so the unsafe version is not required

export const gridAutoColumnsMapper = createGridMapper(
  "gridAutoColumns",
  "UNSAFE_gridAutoColumns",
  ["auto", "min-content", "max-content"]
);

export const gridAutoRowsMapper = createGridMapper(
  "gridAutoRows",
  "UNSAFE_gridAutoRows",
  ["auto", "min-content", "max-content"]
);

export const gridTemplateColumnsMapper = createGridMapper(
  "gridTemplateColumns",
  "UNSAFE_gridTemplateColumns",
  ["none", "subgrid", "auto", "max-content", "min-content"]
);
export const gridTemplateRowsMapper = createGridMapper(
  "gridTemplateRows",
  "UNSAFE_gridTemplateRows",
  ["none", "subgrid", "auto", "max-content", "min-content"]
);
