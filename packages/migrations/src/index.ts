import { existsSync, readFileSync } from "fs";
import type {
  API,
  FileInfo,
  Options
} from "jscodeshift";
import { analyze } from "./analysis/analyze.ts";
import { mappings as hopper2HopperMappings } from "./mappings/hopper-to-hopper/index.ts";
import { mappings as orbiter2HopperMappings } from "./mappings/orbiter-to-hopper/index.ts";
import { migrate } from "./migrations/migrate.ts";
import { logToFile } from "./utils/logger.ts";
import { createLazyMigrationNotesManager } from "./utils/migration-notes.ts";
import { createLazyRepoInfo } from "./utils/repo-cache.ts";
import type { MapMetaData, Runtime } from "./utils/types.ts";

function loadAliases(aliasesInput: object, logger: Runtime["log"]): Record<string, string | string[]> | undefined {
  // First, check if it's a valid file path
  if (typeof aliasesInput === "string" && existsSync(aliasesInput)) {
    try {
      const aliasesContent = readFileSync(aliasesInput, "utf8");
      const aliases = JSON.parse(aliasesContent);
      logger(`Loaded aliases from file: ${aliasesInput}`);

      return aliases;
    } catch (error) {
      logger(`Failed to load aliases from file ${aliasesInput}: ${error}`, "error");

      return undefined;
    }
  }
  
  // If not a file, try to parse as JSON string
  try {    
    const aliases = typeof aliasesInput === "string" ? JSON.parse(aliasesInput) : aliasesInput;
    logger("Loaded aliases from JSON string: ", JSON.stringify(aliases));

    return aliases;
  } catch (error) {
    logger(`Failed to parse aliases JSON string: ${error}`, "error");

    return undefined;
  }
}

export default function transform(
  file: FileInfo,
  api: API,
  options?: Options
): string | undefined {
  // Create lazy-loaded repository information getters
  const { getRepoInfo, getBranch } = createLazyRepoInfo(file.path);

    
  // Create lazy-loaded migration notes manager getter
  const { getMigrationNotesManager } = createLazyMigrationNotesManager();
  const logger: Runtime["log"] = (...args) => {
    logToFile(file.path, ...args);
  };

  const mappings = getMappingTable(options, logger);
  
  // Load aliases if provided
  const aliases = options?.aliases ? loadAliases(options.aliases, logger) : undefined;

  const runtime: Runtime = {
    j: api.jscodeshift,
    root: api.jscodeshift(file.source),
    filePath: file.path,
    mappings: mappings,
    getRepoInfo,
    getBranch,
    getMigrationNotesManager,
    log: logger,
    aliases
  };

  try {
    if (options?.a !== undefined && options?.a !== "") {
      const outputPath = options.a as string;
      analyze(runtime, outputPath, {
        ...options,
        "filter-unmapped": options["filter-unmapped"] as
          | "components"
          | "props"
          | undefined,
        "include-ignoreList": options["include-ignoreList"] as
          | boolean
          | undefined,
        project: options.project as string | undefined,
        deep: options.deep as boolean | undefined
      });

      return undefined; // Analysis does not change anything. returning result.source is not accurate as it may have been modified through parsing.
    } else {
      return migrate(runtime, options);
    }
  } catch (error) {
    const errorMessage = `Error: ${error}`;
    runtime.log(errorMessage, "error");

    return errorMessage;
  }
}


export function getMappingTable(options: Options | undefined, logger: Runtime["log"]): MapMetaData {
  const target = options?.mappings ?? "orbiter-to-hopper";
  switch (target) {
    case "hopper":
      return hopper2HopperMappings;
    case "orbiter-to-hopper":
      return orbiter2HopperMappings;
    default:
      logger(`Unknown mapping target: ${target}. Using default 'orbiter-to-hopper' mappings.`);
      throw new Error(`Unknown mapping target: ${target}`);
  }
}