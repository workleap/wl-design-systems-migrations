import type {
  API,
  FileInfo,
  Options
} from "jscodeshift";
import { analyze } from "./analysis/analyze.js";
import { mappings } from "./mappings/index.ts";
import { migrate } from "./migrations/migrate.js";
import { logToFile } from "./utils/logger.js";
import type { Runtime } from "./utils/types.js";

export default function transform(
  file: FileInfo,
  api: API,
  options?: Options
): string | undefined {
  const runtime: Runtime = {
    j: api.jscodeshift,
    root: api.jscodeshift(file.source),
    filePath: file.path,
    mappings: mappings,
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
          | undefined
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
