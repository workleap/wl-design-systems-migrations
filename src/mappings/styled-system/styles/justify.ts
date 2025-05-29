import { createCssPropertyMapper } from "../../helpers.js";

export const justifyContentMapper = createCssPropertyMapper({
  propertyName: "justifyContent",
  validGlobalValues: [
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

export const justifyItemsMapper = createCssPropertyMapper({
  propertyName: "justifyItems",
  validGlobalValues: [
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

export const justifySelfMapper = createCssPropertyMapper({
  propertyName: "justifySelf",
  validGlobalValues: [
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
