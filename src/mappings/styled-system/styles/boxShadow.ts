import { createCssPropertyMapper } from "../../helpers.ts";

import { BoxShadowMapping as HopperBoxShadowMapping } from "@hopper-ui/components";
import { BoxShadowMapping as OrbiterBoxShadowMapping } from "@workleap/orbiter-ui";

export const boxShadowMapper = createCssPropertyMapper({
  propertyName: "boxShadow",
  unsafePropertyName: "UNSAFE_boxShadow",
  validGlobalValues: ["none"],
  sourceValidKeys: OrbiterBoxShadowMapping,
  targetValidKeys: HopperBoxShadowMapping,
});

export const boxShadowActiveMapper = createCssPropertyMapper({
  propertyName: "boxShadowActive",
  unsafePropertyName: "UNSAFE_boxShadowActive",
  validGlobalValues: ["none"],
  sourceValidKeys: OrbiterBoxShadowMapping,
  targetValidKeys: HopperBoxShadowMapping,
});

export const boxShadowFocusMapper = createCssPropertyMapper({
  propertyName: "boxShadowFocus",
  unsafePropertyName: "UNSAFE_boxShadowFocus",
  validGlobalValues: ["none"],
  sourceValidKeys: OrbiterBoxShadowMapping,
  targetValidKeys: HopperBoxShadowMapping,
});

export const boxShadowHoverMapper = createCssPropertyMapper({
  propertyName: "boxShadowHover",
  unsafePropertyName: "UNSAFE_boxShadowHover",
  validGlobalValues: ["none"],
  sourceValidKeys: OrbiterBoxShadowMapping,
  targetValidKeys: HopperBoxShadowMapping,
});
