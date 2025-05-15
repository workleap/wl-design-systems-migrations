import type {
  API,
  ASTNode,
  ASTPath,
  Block,
  Collection,
  CommentBlock,
  CommentLine,
  FileInfo,
  Line,
  Node,
  Options,
} from "jscodeshift";
import core from "jscodeshift";
import {
  ComponentMapMetaData,
  mappings,
  type MapMetaData,
} from "./mappings.js";

type CommentKind = Block | Line | CommentBlock | CommentLine;

/**
 * Migrates specific components from one package to another
 * @param j - jscodeshift API
 * @param root - AST root
 * @param sourcePackage - Package to migrate from
 * @param targetPackage - Package to migrate to
 * @param sourceComponentName - Component name to migrate
 * @returns void
 */
function migrateImport(
  componentName: string,
  runtime: Runtime
): { localName?: string } {
  const {
    j,
    root,
    mappings: { sourcePackage, targetPackage },
  } = runtime;
  const targetComponentName = mappings.components[componentName]?.targetName;
  const result: ReturnType<typeof migrateImport> = {};

  if (!targetComponentName) {
    return result; // No target component name found, exit early
  }

  // Find all import declarations from the source package
  root
    .find(j.ImportDeclaration, {
      source: {
        value: sourcePackage,
      },
    })
    .forEach((path: any) => {
      const importSpecifiers = path.node.specifiers || [];

      // Find the specific component specifier
      const componentSpecifier = importSpecifiers.find(
        (specifier: any) =>
          j.ImportSpecifier.check(specifier) &&
          specifier.imported &&
          specifier.imported.name === componentName
      );

      // If the component is found in the imports
      if (componentSpecifier && j.ImportSpecifier.check(componentSpecifier)) {
        // Get the local name (alias) of the component, or use the original name if no alias
        const localName = componentSpecifier.local?.name || componentName;
        result.localName = localName;

        // Create a new import specifier for the target package
        const newImportSpecifier = j.importSpecifier(
          j.identifier(targetComponentName),
          localName !== targetComponentName ? j.identifier(localName) : null
        );

        // Remove the component from the original import
        const filteredSpecifiers = importSpecifiers.filter(
          (specifier: any) =>
            !j.ImportSpecifier.check(specifier) ||
            !specifier.imported ||
            specifier.imported.name !== componentName
        );

        // Update the original import declaration if there are remaining imports
        if (filteredSpecifiers.length > 0) {
          j(path).replaceWith(
            j.importDeclaration(
              filteredSpecifiers,
              j.stringLiteral(sourcePackage)
            )
          );
        } else {
          // If there are no remaining imports, remove the declaration
          j(path).remove();
        }

        // Check if there's already an import from the target package
        const existingTargetImport = root.find(j.ImportDeclaration, {
          source: {
            value: targetPackage,
          },
        });

        if (existingTargetImport.length > 0) {
          // Add the specifier to the existing import declaration
          const targetImportPath = existingTargetImport.paths()[0];

          // Access the node's specifiers safely
          if (targetImportPath && targetImportPath.node) {
            const targetSpecifiers = targetImportPath.node.specifiers || [];

            // Add the new specifier to the existing ones
            j(targetImportPath).replaceWith(
              j.importDeclaration(
                [...targetSpecifiers, newImportSpecifier],
                j.stringLiteral(targetPackage)
              )
            );
          }
        } else {
          // Create a new import declaration if one doesn't exist
          const newImport = j.importDeclaration(
            [newImportSpecifier],
            j.stringLiteral(targetPackage)
          );

          // Add the new import right after the updated original import
          // or at the top of the file if we removed the original import
          if (filteredSpecifiers.length > 0) {
            j(path).insertAfter(newImport);
          } else {
            // Find all import declarations to add it at the end of the imports section
            const allImports = root.find(j.ImportDeclaration);
            if (allImports.length > 0) {
              // Get the last import and insert after it
              allImports.at(allImports.length - 1).insertAfter(newImport);
            } else {
              // If there are no imports, add it to the beginning of the file
              root.get().node.program.body.unshift(newImport);
            }
          }
        }
      }
    });

  return result;
}

/**
 * Renames JSX attributes for a specific component
 * @param j - jscodeshift API
 * @param root - AST root
 * @param componentName - Component name to modify
 * @param oldAttrName - Old attribute name
 * @param newAttrName - New attribute name
 */
function migrateAttribute(
  componentName: string,
  oldAttrName: string,
  newAttrName: string,
  runtime: Runtime
): void {
  const { j, root } = runtime;
  root
    .find(j.JSXOpeningElement, {
      name: {
        name: componentName,
      },
    })
    .forEach((path: any) => {
      const attributes = path.node.attributes || [];
      const targetAttribute = attributes.find(
        (attr: any) => attr.name && attr.name.name === oldAttrName
      );

      if (targetAttribute) {
        j(path).replaceWith(
          j.jsxOpeningElement(
            j.jsxIdentifier(componentName),
            [
              ...attributes.filter(
                (attr: any) => attr.name && attr.name.name !== oldAttrName
              ),
              j.jsxAttribute(
                j.jsxIdentifier(newAttrName),
                targetAttribute.value
              ),
            ],
            path.node.selfClosing
          )
        );
      }
    });
}

/**
 * Creates a function that migrates a component from one package to another
 * @param j - jscodeshift API
 * @param root - AST root
 * @param sourcePackage - Package to migrate from
 * @param targetPackage - Package to migrate to
 * @returns A function that takes a component name and migrates it
 */
function migrate(componentName: string, runtime: Runtime): void {
  const { localName } = migrateImport(componentName, runtime);
  const { mappings } = runtime;

  if (localName) {
    Object.entries(mappings.components[componentName]?.props || {}).forEach(
      ([oldAttrName, newAttrName]) => {
        migrateAttribute(localName, oldAttrName, newAttrName, runtime);
      }
    );
  }
}

interface Runtime {
  j: core.JSCodeshift;
  root: Collection<ASTNode>;
  mappings: MapMetaData;
}

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
  const componentName: string | null = options?.component;
  if (componentName && mappings.components[componentName]) {
    migrate(componentName, runtime);
  } else {
    // Migrate all components in the map
    Object.keys(mappings.components).forEach((sourceComponentName) => {
      migrate(sourceComponentName, runtime);
    });
  }
  return runtime.root.toSource();
}
