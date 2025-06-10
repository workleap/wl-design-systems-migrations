import { defaultJSCodeshiftParser } from "@codemod.com/codemod-utils";
import jscodeshift, { type API } from "jscodeshift";
import { mappings as initialMappings } from "../mappings/index.ts";
import type { MapMetaData, Runtime } from "./types.ts";

export const buildApi = (parser?: string | jscodeshift.Parser): API => ({
  j: parser ? jscodeshift.withParser(parser) : jscodeshift,
  jscodeshift: parser ? jscodeshift.withParser(parser) : jscodeshift,
  stats: () => {
    console.error(
      "The stats function was called, which is not supported on purpose"
    );
  },
  report: () => {
    console.error(
      "The report function was called, which is not supported on purpose"
    );
  }
});

export const getRuntime = (
  source: string,
  mappingsOverrides?: Partial<MapMetaData>
): Runtime => {
  const api = buildApi(defaultJSCodeshiftParser); //to make sure our tests work like the codemod parser

  return {
    root: api.jscodeshift(source),
    filePath: "test.tsx",
    j: api.j,
    mappings: {
      ...initialMappings,
      ...mappingsOverrides
    },
    log: console.log
  };
};

export function removeSpacesAndNewlines(str: string): string {
  return str.replace(/\s+/g, " ").replace(/\n/g, " ").trim();
}
