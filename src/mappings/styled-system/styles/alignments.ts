import { createStyleMapper } from "../../helpers.js";

export const alignContentMapper = createStyleMapper({
  propertyName: "alignContent",
  extraGlobalValues: [
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

export const alignItemsMapper = createStyleMapper({
  propertyName: "alignItems",
  extraGlobalValues: [
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

export const alignSelfMapper = createStyleMapper({
  propertyName: "alignSelf",
  extraGlobalValues: [
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
