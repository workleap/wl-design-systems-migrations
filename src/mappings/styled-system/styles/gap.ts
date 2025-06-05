import { createHopperCssPropertyMapper } from "../../helpers.js";

import { SimpleMarginMapping as HopperSimpleMarginMapping } from "@hopper-ui/components";
import { SimpleMarginMapping as OrbiterSimpleMarginMapping } from "@workleap/orbiter-ui";

export const gapMapper = createHopperCssPropertyMapper({
  propertyName: "gap",
  unsafePropertyName: "UNSAFE_gap",
  validGlobalValues: ["normal"],
  sourceValidKeys: OrbiterSimpleMarginMapping,
  targetValidKeys: HopperSimpleMarginMapping
});

export const rowGapMapper = createHopperCssPropertyMapper({
  propertyName: "rowGap",
  unsafePropertyName: "UNSAFE_rowGap",
  validGlobalValues: ["normal"],
  sourceValidKeys: OrbiterSimpleMarginMapping,
  targetValidKeys: HopperSimpleMarginMapping
});

export const columnGapMapper = createHopperCssPropertyMapper({
  propertyName: "columnGap",
  unsafePropertyName: "UNSAFE_columnGap",
  validGlobalValues: ["normal"],
  sourceValidKeys: OrbiterSimpleMarginMapping,
  targetValidKeys: HopperSimpleMarginMapping
});
