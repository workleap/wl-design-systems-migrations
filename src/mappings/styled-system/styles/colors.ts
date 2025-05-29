import { createCssPropertyMapper } from "../../helpers.js";
import { HopperStyledSystemPropsKeys } from "../types.js";

import {
  BackgroundColorMapping as HopperBackgroundColorMapping,
  TextColorMapping as HopperTextColorMapping,
} from "@hopper-ui/components";
import {
  BackgroundColorMapping as OrbiterBackgroundColorMapping,
  TextColorMapping as OrbiterTextColorMapping,
} from "@workleap/orbiter-ui";

// Text color mappers
export const colorMapper = createCssPropertyMapper({
  propertyName: "color",
  unsafePropertyName: "UNSAFE_color",
  validGlobalValues: ["currentcolor"],
  sourceValidKeys: OrbiterTextColorMapping,
  targetValidKeys: HopperTextColorMapping,
});

export const colorActiveMapper = createCssPropertyMapper({
  propertyName: "colorActive",
  unsafePropertyName: "UNSAFE_colorActive",
  validGlobalValues: ["currentcolor"],
  sourceValidKeys: OrbiterTextColorMapping,
  targetValidKeys: HopperTextColorMapping,
});

export const colorFocusMapper = createCssPropertyMapper({
  propertyName: "colorFocus",
  unsafePropertyName: "UNSAFE_colorFocus",
  validGlobalValues: ["currentcolor"],
  sourceValidKeys: OrbiterTextColorMapping,
  targetValidKeys: HopperTextColorMapping,
});

export const colorHoverMapper = createCssPropertyMapper({
  propertyName: "colorHover",
  unsafePropertyName: "UNSAFE_colorHover",
  validGlobalValues: ["currentcolor"],
  sourceValidKeys: OrbiterTextColorMapping,
  targetValidKeys: HopperTextColorMapping,
});

// Background color mappers
export const backgroundColorMapper = createCssPropertyMapper({
  propertyName: "backgroundColor",
  unsafePropertyName: "UNSAFE_backgroundColor",
  validGlobalValues: ["currentcolor"],
  sourceValidKeys: OrbiterBackgroundColorMapping,
  targetValidKeys: HopperBackgroundColorMapping,
});

export const backgroundColorActiveMapper = createCssPropertyMapper({
  propertyName: "backgroundColorActive",
  unsafePropertyName: "UNSAFE_backgroundColorActive",
  validGlobalValues: ["currentcolor"],
  sourceValidKeys: OrbiterBackgroundColorMapping,
  targetValidKeys: HopperBackgroundColorMapping,
});

export const backgroundColorFocusMapper = createCssPropertyMapper({
  propertyName: "backgroundColorFocus",
  unsafePropertyName: "UNSAFE_backgroundColorFocus",
  validGlobalValues: ["currentcolor"],
  sourceValidKeys: OrbiterBackgroundColorMapping,
  targetValidKeys: HopperBackgroundColorMapping,
});

export const backgroundColorHoverMapper = createCssPropertyMapper({
  propertyName: "backgroundColorHover",
  unsafePropertyName: "UNSAFE_backgroundColorHover",
  validGlobalValues: ["currentcolor"],
  sourceValidKeys: OrbiterBackgroundColorMapping,
  targetValidKeys: HopperBackgroundColorMapping,
});
