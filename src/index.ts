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
import { migrateComponent } from "./utils/migrateComponent.js";
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
    mappings: mappings,
  };

  // Easily migrate individual components by name
  const componentName: string = options?.c ?? "all";
  if (componentName !== "all" && mappings.components[componentName]) {
    migrateComponent(componentName, runtime);
  } else if (componentName === "all") {
    // Migrate all components in the map
    Object.keys(mappings.components).forEach((sourceComponentName) => {
      migrateComponent(sourceComponentName, runtime);
    });
  } else {
    console.log(`Component ${componentName} not found in mappings.`);
  }
  return runtime.root.toSource();
}
