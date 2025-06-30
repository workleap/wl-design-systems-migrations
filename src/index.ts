import type {
  API,
  FileInfo,
  Options
} from "jscodeshift";
import { analyze } from "./analysis/analyze.js";
import { mappings as hopper2HopperMappings } from "./mappings/hopper-to-hopper/index.js";
import { mappings as orbiter2HopperMappings } from "./mappings/orbiter-to-hopper/index.ts";
import { migrate } from "./migrations/migrate.js";
import { logToFile } from "./utils/logger.js";
import { createLazyMigrationNotesManager } from "./utils/migration-notes.js";
import { createLazyRepoInfo } from "./utils/repo-cache.js";
import type { MapMetaData, Runtime } from "./utils/types.js";

export default function transform(
  file: FileInfo,
  api: API,
  options?: Options
): string | undefined {
  // Create lazy-loaded repository information getters
  const { getRepoInfo, getBranch } = createLazyRepoInfo(file.path);
  
  // Create lazy-loaded migration notes manager getter
  const { getMigrationNotesManager } = createLazyMigrationNotesManager();

  const mappings = getMappingTable(options);

  const runtime: Runtime = {
    j: api.jscodeshift,
    root: api.jscodeshift(file.source),
    filePath: file.path,
    mappings: mappings,
    getRepoInfo,
    getBranch,
    getMigrationNotesManager,
    log: (...args) => {
      logToFile(file.path, ...args);
    }
  };

  try {
    if (options?.a !== undefined && options?.a !== "") {
      const outputPath = options.a as string;
      const result = analyze(runtime, outputPath, {
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

      return result.source;
    } else {
      return migrate(runtime, options);
    }
  } catch (error) {
    const errorMessage = `Error: ${error}`;
    runtime.log(errorMessage, "error");

    return errorMessage;
  }
}
function getMappingTable(options: Options | undefined) : MapMetaData {
  const target = options?.mappings ?? "orbiter-to-hopper";
  switch (target) {
    case "hopper":
      return hopper2HopperMappings;
    case "orbiter-to-hopper":
      return orbiter2HopperMappings;
    default:
      throw new Error(`Unknown mapping target: ${target}`);
  }
}

