import type { StyledSystemProps as HopperStyledSystemProps } from "@hopper-ui/components";
import type { StyledSystemProps as OrbiterStyledSystemProps } from "@workleap/orbiter-ui";
import type { PropertyMapperFunction, PropsMapping } from "../../utils/types.js";

export type OrbiterStyledSystemPropsKeys = keyof OrbiterStyledSystemProps;
export type HopperStyledSystemPropsKeys = keyof HopperStyledSystemProps;

export type StyledSystemPropsMapping = PropsMapping<
  OrbiterStyledSystemPropsKeys,
  HopperStyledSystemPropsKeys
>;

export type StyledSystemPropertyMapper =
  PropertyMapperFunction<HopperStyledSystemPropsKeys>;
