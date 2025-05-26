import { createStyleMapper } from "../../helpers.js";
import {
  HopperStyledSystemPropsKeys,
  StyledSystemPropertyMapper,
} from "../types.js";

import {
  ComplexPaddingMapping as HopperComplexPaddingMapping,
  SimplePaddingMapping as HopperSimplePaddingMapping,
} from "@hopper-ui/components";
import {
  ComplexPaddingMapping as OrbiterComplexPaddingMapping,
  SimplePaddingMapping as OrbiterSimplePaddingMapping,
} from "@workleap/orbiter-ui";

export const paddingMapper = createStyleMapper({
  propertyName: "padding",
  unsafePropertyName: "UNSAFE_padding",
  orbiterValidKeys: OrbiterComplexPaddingMapping,
  hopperValidKeys: HopperComplexPaddingMapping,
  customMapper: (value, originalValue, runtime) => {
    const { j } = runtime;
    if (typeof value === "number") {
      return {
        to: "padding",
        value: j.stringLiteral(`core_${value}`),
      };
    }
    return null;
  },
});

export const paddingBottomMapper = createStyleMapper({
  propertyName: "paddingBottom",
  unsafePropertyName: "UNSAFE_paddingBottom",
  orbiterValidKeys: OrbiterSimplePaddingMapping,
  hopperValidKeys: HopperSimplePaddingMapping,
});

export const paddingLeftMapper = createStyleMapper({
  propertyName: "paddingLeft",
  unsafePropertyName: "UNSAFE_paddingLeft",
  orbiterValidKeys: OrbiterSimplePaddingMapping,
  hopperValidKeys: HopperSimplePaddingMapping,
});

export const paddingRightMapper = createStyleMapper({
  propertyName: "paddingRight",
  unsafePropertyName: "UNSAFE_paddingRight",
  orbiterValidKeys: OrbiterSimplePaddingMapping,
  hopperValidKeys: HopperSimplePaddingMapping,
});

export const paddingTopMapper = createStyleMapper({
  propertyName: "paddingTop",
  unsafePropertyName: "UNSAFE_paddingTop",
  orbiterValidKeys: OrbiterSimplePaddingMapping,
  hopperValidKeys: HopperSimplePaddingMapping,
});

export const paddingXMapper = createStyleMapper({
  propertyName: "paddingX",
  unsafePropertyName: "UNSAFE_paddingX",
  orbiterValidKeys: OrbiterSimplePaddingMapping,
  hopperValidKeys: HopperSimplePaddingMapping,
});

export const paddingYMapper = createStyleMapper({
  propertyName: "paddingY",
  unsafePropertyName: "UNSAFE_paddingY",
  orbiterValidKeys: OrbiterSimplePaddingMapping,
  hopperValidKeys: HopperSimplePaddingMapping,
});
