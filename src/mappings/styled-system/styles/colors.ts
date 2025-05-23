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

import {
  BackgroundColorMapping as HopperBackgroundColorMapping,
  TextColorMapping as HopperTextColorMapping,
} from "@hopper-ui/components";
import {
  BackgroundColorMapping as OrbiterBackgroundColorMapping,
  TextColorMapping as OrbiterTextColorMapping,
} from "@workleap/orbiter-ui";

const createColorMapper =
  (
    propertyName: HopperStyledSystemPropsKeys,
    unsafePropertyName: HopperStyledSystemPropsKeys,
    isBackground: boolean = false
  ): StyledSystemPropertyMapper =>
  (oldValue, { j }) => {
    const value = tryGettingLiteralValue(oldValue);
    if (value !== null) {
      if (isGlobalValue(value, ["currentcolor"])) {
        return {
          to: propertyName,
          value: oldValue,
        };
      } else if (
        typeof value === "string" &&
        hasSameKey(
          value,
          isBackground
            ? OrbiterBackgroundColorMapping
            : OrbiterTextColorMapping,
          isBackground ? HopperBackgroundColorMapping : HopperTextColorMapping
        )
      ) {
        return {
          to: propertyName,
          value: oldValue,
        };
      } else if (
        typeof value === "string" &&
        hasCoreVersionKey(
          value,
          isBackground
            ? OrbiterBackgroundColorMapping
            : OrbiterTextColorMapping,
          isBackground ? HopperBackgroundColorMapping : HopperTextColorMapping
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

// Text color mappers
export const colorMapper = createColorMapper("color", "UNSAFE_color");
export const colorActiveMapper = createColorMapper(
  "colorActive",
  "UNSAFE_colorActive"
);
export const colorFocusMapper = createColorMapper(
  "colorFocus",
  "UNSAFE_colorFocus"
);
export const colorHoverMapper = createColorMapper(
  "colorHover",
  "UNSAFE_colorHover"
);

// Background color mappers
export const backgroundColorMapper = createColorMapper(
  "backgroundColor",
  "UNSAFE_backgroundColor",
  true
);
export const backgroundColorActiveMapper = createColorMapper(
  "backgroundColorActive",
  "UNSAFE_backgroundColorActive",
  true
);
export const backgroundColorFocusMapper = createColorMapper(
  "backgroundColorFocus",
  "UNSAFE_backgroundColorFocus",
  true
);
export const backgroundColorHoverMapper = createColorMapper(
  "backgroundColorHover",
  "UNSAFE_backgroundColorHover",
  true
);
