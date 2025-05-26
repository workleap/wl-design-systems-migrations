import { createMapper } from "../../helpers.js";

export const alignContentMapper = createMapper({
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

export const alignItemsMapper = createMapper({
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

export const alignSelfMapper = createMapper({
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
