import { getComponentTargetName } from "../utils/mapping.js";
import { Runtime } from "../utils/types.js";

/**
 * Migrates specific components from one package to another
 * @param j - jscodeshift API
 * @param root - AST root
 * @param sourcePackage - Package to migrate from
 * @param targetPackage - Package to migrate to
 * @param sourceComponentName - Component name to migrate
 * @returns void
 */
export function migrateImport(
  componentName: string,
  runtime: Runtime
): {
  oldLocalName: string;
  newLocalName: string;
} | null {
  const { j, root, mappings } = runtime;
  const { sourcePackage, targetPackage } = mappings;
  const targetComponentName = getComponentTargetName(componentName, mappings);
  let result: ReturnType<typeof migrateImport> = null;

  if (!targetComponentName) {
    return null; // No target component name found, exit early
  }

  // Find all import declarations from the source package
  root
    .find(j.ImportDeclaration, {
      source: {
        value: sourcePackage,
      },
    })
    .forEach((path) => {
      const importSpecifiers = path.node.specifiers || [];

      // Find the specific component specifier
      const componentSpecifier = importSpecifiers.find(
        (specifier) =>
          j.ImportSpecifier.check(specifier) &&
          specifier.imported &&
          specifier.imported.name === componentName
      );

      // If the component is found in the imports
      if (componentSpecifier && j.ImportSpecifier.check(componentSpecifier)) {
        // Get the local name (alias) of the component, or use the original name if no alias
        const localName = componentSpecifier.local?.name || componentName;
        const isAliased = localName !== componentName;

        // Create a new import specifier for the target package
        const newImportSpecifier = j.importSpecifier(
          j.identifier(targetComponentName),
          isAliased ? j.identifier(localName) : null
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

            // Check if the component is already imported (avoid duplicates)
            const alreadyImported = targetSpecifiers.some(
              (spec) =>
                j.ImportSpecifier.check(spec) &&
                spec.imported &&
                spec.imported.name === targetComponentName
            );

            // Only add the new specifier if it's not already imported
            if (!alreadyImported) {
              j(targetImportPath).replaceWith(
                j.importDeclaration(
                  [...targetSpecifiers, newImportSpecifier],
                  j.stringLiteral(targetPackage)
                )
              );
            }
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

        result = {
          oldLocalName: localName,
          newLocalName: isAliased ? localName : targetComponentName,
        };
      }
    });

  return result;
}
