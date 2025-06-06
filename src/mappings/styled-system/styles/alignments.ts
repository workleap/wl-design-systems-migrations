import { createHopperCssPropertyMapper } from "../../helpers.js";

export const alignContentMapper = createHopperCssPropertyMapper({
  propertyName: "alignContent",
  validGlobalValues: [
    "center",
    "start",
    "end",
    "flex-start",
    "flex-end",
    "normal",
    "baseline",
    "stretch",
    "space-between",
    "space-around",
    "space-evenly"
  ]
});

export const alignItemsMapper = createHopperCssPropertyMapper({
  propertyName: "alignItems",
  validGlobalValues: [
    "center",
    "start",
    "end",
    "flex-start",
    "flex-end",
    "normal",
    "baseline",
    "stretch"
  ]
});

export const alignSelfMapper = createHopperCssPropertyMapper({
  propertyName: "alignSelf",
  validGlobalValues: [
    "auto",
    "center",
    "start",
    "end",
    "flex-start",
    "flex-end",
    "normal",
    "baseline",
    "stretch"
  ]
});
