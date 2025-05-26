import { create } from "domain";
import {
  createMapper,
  isGlobalValue,
  tryGettingLiteralValue,
} from "../../helpers.js";
import {
  HopperStyledSystemPropsKeys,
  StyledSystemPropertyMapper,
} from "../types.js";

export const justifyContentMapper = createMapper({
  propertyName: "justifyContent",
  extraGlobalValues: [
    "center",
    "start",
    "end",
    "flex-start",
    "flex-end",
    "left",
    "right",
    "normal",
    "space-between",
    "space-around",
    "space-evenly",
    "stretch",
  ],
});

export const justifyItemsMapper = createMapper({
  propertyName: "justifyItems",
  extraGlobalValues: [
    "normal",
    "stretch",
    "center",
    "start",
    "end",
    "flex-start",
    "flex-end",
    "self-start",
    "self-end",
    "left",
    "right",
    "baseline",
    "legacy",
  ],
});

export const justifySelfMapper = createMapper({
  propertyName: "justifySelf",
  extraGlobalValues: [
    "auto",
    "normal",
    "stretch",
    "center",
    "start",
    "end",
    "flex-start",
    "flex-end",
    "self-start",
    "self-end",
    "left",
    "right",
    "baseline",
  ],
});
