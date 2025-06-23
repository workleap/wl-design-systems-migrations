import type { ASTPath, JSXOpeningElement } from "jscodeshift";
import { getFullComponentMappings as getFullComponentMapData, getTodoComment } from "../utils/migration.ts";
import type {
  ComponentMapMetaData,
  Runtime
} from "../utils/types.js";
import { addAttribute } from "./addAttribute.js";
import { migrateAttribute } from "./migrateAttribute.js";

export function migrateComponentInstances(
  instances: ASTPath<JSXOpeningElement>[],
  oldComponentName: string,
  oldLocalName: string,
  newLocalName: string,
  initialComponentMapData: ComponentMapMetaData,
  runtime: Runtime
) {
  // Rename component
  if (newLocalName !== oldLocalName) {
    instances.forEach(instance => {
      (instance.node.name as any).name = newLocalName;

      // also rename closing tag
      const parent = instance.parentPath.node;
      if (parent.closingElement) {
        (parent.closingElement.name as any).name = newLocalName;
      }
    });
  }

  const componentMapData = getFullComponentMapData(initialComponentMapData, runtime);    

  // Migrate attributes
  Object.entries(componentMapData.props?.mappings || {}).forEach(
    ([oldAttrName, newAttrName]) => {
      if (oldAttrName === newAttrName) {return;} // Skip if no change
      migrateAttribute(instances, oldAttrName, newAttrName, oldComponentName, runtime);
    }
  );

  // Add additional attributes for this specific component alias
  Object.entries(componentMapData.props?.additions || {}).forEach(
    ([newAttrName, newAttrValue]) => {
      instances.forEach(path => {
        if (typeof newAttrValue === "function") {
          const newValue = newAttrValue(path, runtime);
          if (newValue !== null) {
            addAttribute(
              path,
              newAttrName,
              newValue,
              runtime
            );
          }
        } else {addAttribute(path, newAttrName, newAttrValue, runtime);}
      });
    }
  );

  // Remove attributes
  const removals = componentMapData.props?.removals || [];
  if (removals.length > 0) {
    instances.forEach(path => {
      const list = path.node.attributes?.filter(
        attr => !(attr.type === "JSXAttribute" && typeof attr.name.name === "string" && removals.includes(attr.name.name))
      );
      path.node.attributes = list;
    });
  }

  // Handle component-level migration notes
  if (typeof componentMapData === "object" && componentMapData?.migrationNotes) {
    try {
      runtime.getMigrationNotesManager().addMigrationNotes(oldComponentName, componentMapData.migrationNotes, runtime.filePath);
    } catch (error) {
      runtime.log(String(error));
    }
  }

  // Add todoComments if any
  if (
    typeof componentMapData === "object" &&
      componentMapData.todoComments !== undefined
  ) {
    const todoComment = componentMapData.todoComments;

    instances.forEach(path => {
      let comments : string | string[] | undefined = [];
      if (typeof todoComment === "function") {
        comments = todoComment(path, runtime);
      } else {
        comments = todoComment;
      }

      if (typeof comments === "string") {
        comments = [comments];
      } else if (comments === undefined) {
        comments = [];
      }           

      path.node.comments = [
        ...path.node.comments || [],
        ...comments.map(msg => getTodoComment(msg, runtime, true))
      ];
    });
  }
}