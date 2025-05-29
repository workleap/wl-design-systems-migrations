import { createCssPropertyMapper } from "../../helpers.js";

import { SimpleMarginMapping as HopperSimpleMarginMapping } from "@hopper-ui/components";
import { SimpleMarginMapping as OrbiterSimpleMarginMapping } from "@workleap/orbiter-ui";

export const gapMapper = createCssPropertyMapper({
  propertyName: "gap",
  unsafePropertyName: "UNSAFE_gap",
  validGlobalValues: ["normal", "0"],
  sourceValidKeys: OrbiterSimpleMarginMapping,
  targetValidKeys: HopperSimpleMarginMapping,
});

export const rowGapMapper = createCssPropertyMapper({
  propertyName: "rowGap",
  unsafePropertyName: "UNSAFE_rowGap",
  validGlobalValues: ["normal", "0"],
  sourceValidKeys: OrbiterSimpleMarginMapping,
  targetValidKeys: HopperSimpleMarginMapping,
});

export const columnGapMapper = createCssPropertyMapper({
  propertyName: "columnGap",
  unsafePropertyName: "UNSAFE_columnGap",
  validGlobalValues: ["normal", "0"],
  sourceValidKeys: OrbiterSimpleMarginMapping,
  targetValidKeys: HopperSimpleMarginMapping,
});
