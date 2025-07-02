import type { StyledSystemProps as OrbiterStyledSystemProps } from "@workleap/orbiter-ui";
import type { HopperStyledSystemPropsKeys, PropertyMapperFunction, PropsMapping } from "../../../utils/types.ts";

export type OrbiterStyledSystemPropsKeys = keyof OrbiterStyledSystemProps;
  
export type StyledSystemPropsMapping = PropsMapping<
  OrbiterStyledSystemPropsKeys,
  HopperStyledSystemPropsKeys
>;

export type StyledSystemPropertyMapper =
  PropertyMapperFunction<HopperStyledSystemPropsKeys>;
