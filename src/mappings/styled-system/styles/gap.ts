import { createStyleMapper } from "../../helpers.js";

import { SimpleMarginMapping as HopperSimpleMarginMapping } from "@hopper-ui/components";
import { SimpleMarginMapping as OrbiterSimpleMarginMapping } from "@workleap/orbiter-ui";

export const gapMapper = createStyleMapper({
  propertyName: "gap",
  unsafePropertyName: "UNSAFE_gap",
  extraGlobalValues: ["normal", "0"],
  orbiterValidKeys: OrbiterSimpleMarginMapping,
  hopperValidKeys: HopperSimpleMarginMapping,
});

export const rowGapMapper = createStyleMapper({
  propertyName: "rowGap",
  unsafePropertyName: "UNSAFE_rowGap",
  extraGlobalValues: ["normal", "0"],
  orbiterValidKeys: OrbiterSimpleMarginMapping,
  hopperValidKeys: HopperSimpleMarginMapping,
});

export const columnGapMapper = createStyleMapper({
  propertyName: "columnGap",
  unsafePropertyName: "UNSAFE_columnGap",
  extraGlobalValues: ["normal", "0"],
  orbiterValidKeys: OrbiterSimpleMarginMapping,
  hopperValidKeys: HopperSimpleMarginMapping,
});
