import type { ASTPath, JSXOpeningElement } from "jscodeshift";
import { getTodoComment } from "../utils/migration.ts";
import type { PropertyMapperFunction, Runtime } from "../utils/types.js";

export function migrateAttribute(
  instances: ASTPath<JSXOpeningElement>[],
  oldAttrName: string,
  newAttributeMap: string | PropertyMapperFunction,
  oldComponentName: string,
  runtime: Runtime
): void {
  const { j, log } = runtime;
  instances.forEach(path => {
    const attributes = path.node.attributes || [];
    const sourceAttribute = attributes.find(
      (attr: any) => attr.name && attr.name.name === oldAttrName
    );

    if (sourceAttribute && sourceAttribute.type === "JSXAttribute") {
      const newAttribute: { name: string; value: any; todoComments?: string; migrationNotes?: string | string[]; removeIt?: boolean } =
        {
          name: "",
          value: null
        };

      if (typeof newAttributeMap === "function") {
        const mapResult = newAttributeMap(sourceAttribute.value, {
          ...runtime,
          tag: path
        });
        if (mapResult && "removeIt" in mapResult) {
          newAttribute.removeIt = true;
        } else if (mapResult) {
          const { to, value, todoComments, migrationNotes } = mapResult;
          newAttribute.name = to ?? oldAttrName;
          newAttribute.value = value === undefined ? sourceAttribute.value : value;
          newAttribute.todoComments = todoComments;
          newAttribute.migrationNotes = migrationNotes;
        } else {
          return; // Skip if there is no mapping
        }
      } else {
        newAttribute.name = newAttributeMap;
        newAttribute.value = sourceAttribute.value;
      }

      // Check if the new attribute name already exists
      const existingNewAttribute = attributes.find(
        (attr: any) =>
          attr != sourceAttribute &&
          attr.name &&
          attr.name.name === newAttribute.name
      );

      if (existingNewAttribute) {
        log(
          `WARNING: Attribute '${newAttribute.name}' already exists, skipping migration of '${oldAttrName}'`
        );

        return;
      }

      // Replace just the source attribute in place
      const sourceAttributeIndex = attributes.indexOf(sourceAttribute);

      attributes[sourceAttributeIndex] = j.jsxAttribute(
        j.jsxIdentifier(newAttribute.name),
        newAttribute.value
      );

      // Add comments if provided
      if (newAttribute.todoComments) {
        attributes[sourceAttributeIndex].comments = [
          ...attributes[sourceAttributeIndex].comments || [],
          getTodoComment(newAttribute.todoComments, runtime)
        ];
      }


      // Handle property-level migration notes
      if (newAttribute.migrationNotes) {
        try {
          runtime.getMigrationNotesManager().addMigrationNotes(`${oldComponentName}.${oldAttrName}`, newAttribute.migrationNotes, runtime.filePath);
        } catch (error) {
          runtime.log(String(error));
        }
      }

      //Remove the attribute if specified
      if (newAttribute.removeIt) {
        attributes.splice(sourceAttributeIndex, 1);
      }
    }
  });
}
