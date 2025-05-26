import { createMapper } from "../../helpers.js";
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
export const colorMapper = createMapper({
  propertyName: "color",
  unsafePropertyName: "UNSAFE_color",
  extraGlobalValues: ["currentcolor"],
  orbiterValidKeys: OrbiterTextColorMapping,
  hopperValidKeys: HopperTextColorMapping,
});

export const colorActiveMapper = createMapper({
  propertyName: "colorActive",
  unsafePropertyName: "UNSAFE_colorActive",
  extraGlobalValues: ["currentcolor"],
  orbiterValidKeys: OrbiterTextColorMapping,
  hopperValidKeys: HopperTextColorMapping,
});

export const colorFocusMapper = createMapper({
  propertyName: "colorFocus",
  unsafePropertyName: "UNSAFE_colorFocus",
  extraGlobalValues: ["currentcolor"],
  orbiterValidKeys: OrbiterTextColorMapping,
  hopperValidKeys: HopperTextColorMapping,
});

export const colorHoverMapper = createMapper({
  propertyName: "colorHover",
  unsafePropertyName: "UNSAFE_colorHover",
  extraGlobalValues: ["currentcolor"],
  orbiterValidKeys: OrbiterTextColorMapping,
  hopperValidKeys: HopperTextColorMapping,
});

// Background color mappers
export const backgroundColorMapper = createMapper({
  propertyName: "backgroundColor",
  unsafePropertyName: "UNSAFE_backgroundColor",
  extraGlobalValues: ["currentcolor"],
  orbiterValidKeys: OrbiterBackgroundColorMapping,
  hopperValidKeys: HopperBackgroundColorMapping,
});

export const backgroundColorActiveMapper = createMapper({
  propertyName: "backgroundColorActive",
  unsafePropertyName: "UNSAFE_backgroundColorActive",
  extraGlobalValues: ["currentcolor"],
  orbiterValidKeys: OrbiterBackgroundColorMapping,
  hopperValidKeys: HopperBackgroundColorMapping,
});

export const backgroundColorFocusMapper = createMapper({
  propertyName: "backgroundColorFocus",
  unsafePropertyName: "UNSAFE_backgroundColorFocus",
  extraGlobalValues: ["currentcolor"],
  orbiterValidKeys: OrbiterBackgroundColorMapping,
  hopperValidKeys: HopperBackgroundColorMapping,
});

export const backgroundColorHoverMapper = createMapper({
  propertyName: "backgroundColorHover",
  unsafePropertyName: "UNSAFE_backgroundColorHover",
  extraGlobalValues: ["currentcolor"],
  orbiterValidKeys: OrbiterBackgroundColorMapping,
  hopperValidKeys: HopperBackgroundColorMapping,
});
