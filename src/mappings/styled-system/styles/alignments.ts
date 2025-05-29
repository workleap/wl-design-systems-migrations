import { createCssPropertyMapper } from "../../helpers.js";

export const alignContentMapper = createCssPropertyMapper({
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
    "space-evenly",
  ],
});

export const alignItemsMapper = createCssPropertyMapper({
  propertyName: "alignItems",
  validGlobalValues: [
    "center",
    "start",
    "end",
    "flex-start",
    "flex-end",
    "normal",
    "baseline",
    "stretch",
  ],
});

export const alignSelfMapper = createCssPropertyMapper({
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
    "stretch",
  ],
});
