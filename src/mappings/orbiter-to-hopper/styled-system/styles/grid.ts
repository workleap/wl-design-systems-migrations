import {
  createCssPropertyMapper,
  isFrValue,
  isPercentageValue
} from "../../../../utils/mapping.ts";

import {
  SizingMapping as HopperSizingMapping
} from "@hopper-ui/components";
import { SizingMapping as OrbiterSizingMapping } from "@workleap/orbiter-ui";

export const createGridAutoColumnsMapper = <T extends string = string>(
  propertyName: T,
  unsafePropertyName: T
) =>
  createCssPropertyMapper({
    propertyName,
    unsafePropertyName,
    validGlobalValues: ["auto", "min-content", "max-content", 0],
    sourceValidKeys: OrbiterSizingMapping,
    targetValidKeys: HopperSizingMapping,
    customMapper: (value, originalValue) => {
      if (isPercentageValue(value) || isFrValue(value)) {
        return {
          to: propertyName,
          value: originalValue
        };
      }

      return null;
    }
  });

export const createGridAutoRowsMapper = <T extends string = string>(
  propertyName: T,
  unsafePropertyName: T
) =>
  createCssPropertyMapper({
    propertyName,
    unsafePropertyName,
    validGlobalValues: ["auto", "min-content", "max-content", 0],
    sourceValidKeys: OrbiterSizingMapping,
    targetValidKeys: HopperSizingMapping,
    customMapper: (value, originalValue) => {
      if (isPercentageValue(value) || isFrValue(value)) {
        return {
          to: propertyName,
          value: originalValue
        };
      }

      return null;
    }
  });

export const createGridTemplateColumnsMapper = <T extends string = string>(
  propertyName: T,
  unsafePropertyName: T
) =>
  createCssPropertyMapper({
    propertyName,
    unsafePropertyName,
    validGlobalValues: [
      "none",
      "subgrid",
      "auto",
      "max-content",
      "min-content",
      0
    ],
    sourceValidKeys: OrbiterSizingMapping,
    targetValidKeys: HopperSizingMapping,
    customMapper: (value, originalValue) => {
      if (isPercentageValue(value) || isFrValue(value)) {
        return {
          to: propertyName,
          value: originalValue
        };
      }

      return null;
    }
  });

export const createGridTemplateRowsMapper = <T extends string = string>(
  propertyName: T,
  unsafePropertyName: T
) =>
  createCssPropertyMapper({
    propertyName,
    unsafePropertyName,
    validGlobalValues: [
      "none",
      "subgrid",
      "auto",
      "max-content",
      "min-content",
      0
    ],
    sourceValidKeys: OrbiterSizingMapping,
    targetValidKeys: HopperSizingMapping,
    customMapper: (value, originalValue) => {
      if (isPercentageValue(value) || isFrValue(value)) {
        return {
          to: propertyName,
          value: originalValue
        };
      }

      return null;
    }
  });

export const gridAutoColumnsMapper = createGridAutoColumnsMapper(
  "gridAutoColumns",
  "UNSAFE_gridAutoColumns"
);

export const gridAutoRowsMapper = createGridAutoRowsMapper(
  "gridAutoRows",
  "UNSAFE_gridAutoRows"
);

export const gridTemplateColumnsMapper = createGridTemplateColumnsMapper(
  "gridTemplateColumns",
  "UNSAFE_gridTemplateColumns"
);

export const gridTemplateRowsMapper = createGridTemplateRowsMapper(
  "gridTemplateRows",
  "UNSAFE_gridTemplateRows"
);
