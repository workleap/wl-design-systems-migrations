import { createHopperCssPropertyMapper } from "../../helpers.ts";

import { BoxShadowMapping as HopperBoxShadowMapping } from "@hopper-ui/components";
import { BoxShadowMapping as OrbiterBoxShadowMapping } from "@workleap/orbiter-ui";

export const boxShadowMapper = createHopperCssPropertyMapper({
  propertyName: "boxShadow",
  unsafePropertyName: "UNSAFE_boxShadow",
  validGlobalValues: ["none"],
  sourceValidKeys: OrbiterBoxShadowMapping,
  targetValidKeys: HopperBoxShadowMapping
});

export const boxShadowActiveMapper = createHopperCssPropertyMapper({
  propertyName: "boxShadowActive",
  unsafePropertyName: "UNSAFE_boxShadowActive",
  validGlobalValues: ["none"],
  sourceValidKeys: OrbiterBoxShadowMapping,
  targetValidKeys: HopperBoxShadowMapping
});

export const boxShadowFocusMapper = createHopperCssPropertyMapper({
  propertyName: "boxShadowFocus",
  unsafePropertyName: "UNSAFE_boxShadowFocus",
  validGlobalValues: ["none"],
  sourceValidKeys: OrbiterBoxShadowMapping,
  targetValidKeys: HopperBoxShadowMapping
});

export const boxShadowHoverMapper = createHopperCssPropertyMapper({
  propertyName: "boxShadowHover",
  unsafePropertyName: "UNSAFE_boxShadowHover",
  validGlobalValues: ["none"],
  sourceValidKeys: OrbiterBoxShadowMapping,
  targetValidKeys: HopperBoxShadowMapping
});
