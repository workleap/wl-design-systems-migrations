import babylon, { type ParserOptions } from "@babel/parser";
import jscodeshift, { type API } from "jscodeshift";
import { tmpdir } from "os";
import parserConfig from "../../../cli/src/parser-config.json" with { type: "json" };
import { mappings as initialMappings } from "../mappings/orbiter-to-hopper/index.ts";
import { getMigrationNotesManager } from "./migration-notes.ts";
import type { MapMetaData, Runtime } from "./types.ts";

const defaultParser: jscodeshift.Parser = {
  parse: (source: string) => babylon.parse(source, parserConfig as ParserOptions)
};

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
  const api = buildApi(defaultParser); //to make sure our tests work like the Jscodeshift CLI's parser

  // Create a migration notes manager with a temporary directory and random filename for tests
  const testMigrationNotesManager = getMigrationNotesManager(
    tmpdir(), 
    `migration-notes-${Math.random().toString(36).substring(2, 10)}.md.tmp`
  );
  
  return {
    root: api.jscodeshift(source),
    filePath: "test.tsx",
    j: api.j,
    mappings: {
      ...initialMappings, //TODO : we should fix to not rely on one mapping table only
      ...mappingsOverrides
    },
    getMigrationNotesManager: () => testMigrationNotesManager,
    getRepoInfo: () => null, // No git info in tests
    getBranch: () => "main", // Default branch for tests
    log: () => {}
  };
};

export function removeSpacesAndNewlines(str: string): string {
  return str.replace(/\s+/g, " ").replace(/\n/g, " ").trim();
}
