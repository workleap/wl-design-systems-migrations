import {
  hasCoreVersionKey,
  hasSameKey,
  isGlobalValue,
  tryGettingLiteralValue,
} from "../../helpers.js";
import {
  HopperStyledSystemPropsKeys,
  StyledSystemPropertyMapper,
} from "../types.js";

import { BorderRadiusMapping as HopperBorderRadiusMapping } from "@hopper-ui/components";
import { BorderRadiusMapping as OrbiterBorderRadiusMapping } from "@workleap/orbiter-ui";

const createBorderRadiusMapper =
  (
    propertyName: HopperStyledSystemPropsKeys,
    unsafePropertyName: HopperStyledSystemPropsKeys
  ): StyledSystemPropertyMapper =>
  (oldValue, { j }) => {
    const value = tryGettingLiteralValue(oldValue);
    if (value !== null) {
      if (isGlobalValue(value, [0])) {
        return {
          to: propertyName,
          value: oldValue,
        };
      } else if (
        (typeof value === "string" || typeof value === "number") &&
        hasSameKey(
          value.toString(),
          OrbiterBorderRadiusMapping,
          HopperBorderRadiusMapping
        )
      ) {
        return {
          to: propertyName,
          value: oldValue,
        };
      } else if (
        (typeof value === "string" || typeof value === "number") &&
        hasCoreVersionKey(
          value.toString(),
          OrbiterBorderRadiusMapping,
          HopperBorderRadiusMapping
        )
      ) {
        return {
          to: propertyName,
          value: j.stringLiteral(`core_${value}`),
        };
      }

      return {
        to: unsafePropertyName,
        value: oldValue,
      };
    }

    return null;
  };

export const borderRadiusMapper = createBorderRadiusMapper(
  "borderRadius",
  "UNSAFE_borderRadius"
);
export const borderTopLeftRadiusMapper = createBorderRadiusMapper(
  "borderTopLeftRadius",
  "UNSAFE_borderTopLeftRadius"
);
export const borderTopRightRadiusMapper = createBorderRadiusMapper(
  "borderTopRightRadius",
  "UNSAFE_borderTopRightRadius"
);
export const borderBottomLeftRadiusMapper = createBorderRadiusMapper(
  "borderBottomLeftRadius",
  "UNSAFE_borderBottomLeftRadius"
);
export const borderBottomRightRadiusMapper = createBorderRadiusMapper(
  "borderBottomRightRadius",
  "UNSAFE_borderBottomRightRadius"
);
