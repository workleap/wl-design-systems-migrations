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
    mappings: mappings,
  };

  return migrate(runtime, options);
}
