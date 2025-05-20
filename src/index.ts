import type {
  API,
  Block,
  CommentBlock,
  CommentLine,
  FileInfo,
  Line,
  Options,
} from "jscodeshift";
import { mappings } from "./mappings.js";
import { analyze } from "./utils/analyze.js";
import { migrate } from "./utils/migrate.js";
import { migrateComponent } from "./utils/migrateComponent.js";
import { MapMetaData, Runtime } from "./utils/types.js";

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
  };

  if (options?.a !== undefined) {
    const outputPath = options.a as string;
    const result = analyze(runtime, outputPath, options);
    return result.source;
  } else {
    return migrate(runtime, options);
  }
}
