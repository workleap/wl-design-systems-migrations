import type {
  API,
  Block,
  CommentBlock,
  CommentLine,
  FileInfo,
  Line,
  Options,
} from "jscodeshift";
import { analyze } from "./analysis/analyze.js";
import { mappings } from "./mappings/mappings.js";
import { migrate } from "./migrations/migrate.js";
import { logToFile } from "./utils/logger.js";
import { Runtime } from "./utils/types.js";

type CommentKind = Block | Line | CommentBlock | CommentLine;

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
    },
  };

  try {
    if (options?.a !== undefined && options?.a !== "") {
      const outputPath = options.a as string;
      const result = analyze(runtime, outputPath, options);
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
