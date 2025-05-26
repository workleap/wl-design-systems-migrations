import { createStyleMapper } from "../../helpers.js";

export const justifyContentMapper = createStyleMapper({
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

export const justifyItemsMapper = createStyleMapper({
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

export const justifySelfMapper = createStyleMapper({
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
