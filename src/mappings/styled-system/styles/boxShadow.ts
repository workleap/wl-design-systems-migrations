import { createStyleMapper } from "../../helpers.ts";

import { BoxShadowMapping as HopperBoxShadowMapping } from "@hopper-ui/components";
import { BoxShadowMapping as OrbiterBoxShadowMapping } from "@workleap/orbiter-ui";

export const boxShadowMapper = createStyleMapper({
  propertyName: "boxShadow",
  unsafePropertyName: "UNSAFE_boxShadow",
  extraGlobalValues: ["none"],
  orbiterValidKeys: OrbiterBoxShadowMapping,
  hopperValidKeys: HopperBoxShadowMapping,
});

export const boxShadowActiveMapper = createStyleMapper({
  propertyName: "boxShadowActive",
  unsafePropertyName: "UNSAFE_boxShadowActive",
  extraGlobalValues: ["none"],
  orbiterValidKeys: OrbiterBoxShadowMapping,
  hopperValidKeys: HopperBoxShadowMapping,
});

export const boxShadowFocusMapper = createStyleMapper({
  propertyName: "boxShadowFocus",
  unsafePropertyName: "UNSAFE_boxShadowFocus",
  extraGlobalValues: ["none"],
  orbiterValidKeys: OrbiterBoxShadowMapping,
  hopperValidKeys: HopperBoxShadowMapping,
});

export const boxShadowHoverMapper = createStyleMapper({
  propertyName: "boxShadowHover",
  unsafePropertyName: "UNSAFE_boxShadowHover",
  extraGlobalValues: ["none"],
  orbiterValidKeys: OrbiterBoxShadowMapping,
  hopperValidKeys: HopperBoxShadowMapping,
});
