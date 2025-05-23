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

import { BorderMapping as HopperBorderMapping } from "@hopper-ui/components";
import { BorderMapping as OrbiterBorderMapping } from "@workleap/orbiter-ui";

const createBorderMapper =
  (
    propertyName: HopperStyledSystemPropsKeys,
    unsafePropertyName: HopperStyledSystemPropsKeys
  ): StyledSystemPropertyMapper =>
  (oldValue, { j }) => {
    const value = tryGettingLiteralValue(oldValue);
    if (value !== null) {
      if (isGlobalValue(value, ["currentcolor", "transparent", 0])) {
        return {
          to: propertyName,
          value: oldValue,
        };
      } else if (
        typeof value === "string" &&
        hasSameKey(value, OrbiterBorderMapping, HopperBorderMapping)
      ) {
        return {
          to: propertyName,
          value: oldValue,
        };
      } else if (
        typeof value === "string" &&
        hasCoreVersionKey(value, OrbiterBorderMapping, HopperBorderMapping)
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

export const borderMapper = createBorderMapper("border", "UNSAFE_border");
export const borderActiveMapper = createBorderMapper(
  "borderActive",
  "UNSAFE_borderActive"
);
export const borderFocusMapper = createBorderMapper(
  "borderFocus",
  "UNSAFE_borderFocus"
);
export const borderHoverMapper = createBorderMapper(
  "borderHover",
  "UNSAFE_borderHover"
);
export const borderBottomMapper = createBorderMapper(
  "borderBottom",
  "UNSAFE_borderBottom"
);
export const borderBottomActiveMapper = createBorderMapper(
  "borderBottomActive",
  "UNSAFE_borderBottomActive"
);
export const borderBottomFocusMapper = createBorderMapper(
  "borderBottomFocus",
  "UNSAFE_borderBottomFocus"
);
export const borderBottomHoverMapper = createBorderMapper(
  "borderBottomHover",
  "UNSAFE_borderBottomHover"
);
export const borderLeftMapper = createBorderMapper(
  "borderLeft",
  "UNSAFE_borderLeft"
);
export const borderLeftActiveMapper = createBorderMapper(
  "borderLeftActive",
  "UNSAFE_borderLeftActive"
);
export const borderLeftFocusMapper = createBorderMapper(
  "borderLeftFocus",
  "UNSAFE_borderLeftFocus"
);
export const borderLeftHoverMapper = createBorderMapper(
  "borderLeftHover",
  "UNSAFE_borderLeftHover"
);
export const borderRightMapper = createBorderMapper(
  "borderRight",
  "UNSAFE_borderRight"
);
export const borderRightActiveMapper = createBorderMapper(
  "borderRightActive",
  "UNSAFE_borderRightActive"
);
export const borderRightFocusMapper = createBorderMapper(
  "borderRightFocus",
  "UNSAFE_borderRightFocus"
);
export const borderRightHoverMapper = createBorderMapper(
  "borderRightHover",
  "UNSAFE_borderRightHover"
);
export const borderTopMapper = createBorderMapper(
  "borderTop",
  "UNSAFE_borderTop"
);
export const borderTopActiveMapper = createBorderMapper(
  "borderTopActive",
  "UNSAFE_borderTopActive"
);
export const borderTopFocusMapper = createBorderMapper(
  "borderTopFocus",
  "UNSAFE_borderTopFocus"
);
export const borderTopHoverMapper = createBorderMapper(
  "borderTopHover",
  "UNSAFE_borderTopHover"
);
