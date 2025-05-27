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
):
  | {
      oldLocalName: string;
      newLocalName: string;
    }[]
  | null {
  const { j, root, mappings } = runtime;
  const { sourcePackage, targetPackage } = mappings;
  const targetComponentName = getComponentTargetName(componentName, mappings);
  const results: { oldLocalName: string; newLocalName: string }[] = [];

  if (!targetComponentName) {
    return null; // No target component name found, exit early
  }

  // Collect all import specifiers that need to be migrated
  const newImportSpecifiers: any[] = [];

  // Find all import declarations from the source package
  root
    .find(j.ImportDeclaration, {
      source: {
        value: sourcePackage,
      },
    })
    .forEach((path) => {
      const importSpecifiers = path.node.specifiers || [];

      // Find ALL component specifiers matching the component name
      const componentSpecifiers = importSpecifiers.filter(
        (specifier) =>
          j.ImportSpecifier.check(specifier) &&
          specifier.imported &&
          specifier.imported.name === componentName
      );

      // Process each matching component specifier
      componentSpecifiers.forEach((componentSpecifier) => {
        if (j.ImportSpecifier.check(componentSpecifier)) {
          // Get the local name (alias) of the component, or use the original name if no alias
          const localName = componentSpecifier.local?.name || componentName;
          const isAliased = localName !== componentName;

          // Create a new import specifier for the target package
          const newImportSpecifier = j.importSpecifier(
            j.identifier(targetComponentName),
            isAliased ? j.identifier(localName) : null
          );

          newImportSpecifiers.push(newImportSpecifier);

          results.push({
            oldLocalName: localName,
            newLocalName: isAliased ? localName : targetComponentName,
          });
        }
      });

      // Remove all matching component specifiers from the original import
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
    });

  // Only proceed if we have imports to migrate
  if (newImportSpecifiers.length === 0) {
    return results.length > 0 ? results : null;
  }

  // Check if there's already an import from the target package
  const existingTargetImport = root.find(j.ImportDeclaration, {
    source: {
      value: targetPackage,
    },
  });

  if (existingTargetImport.length > 0) {
    // Add the specifiers to the existing import declaration
    const targetImportPath = existingTargetImport.paths()[0];

    // Access the node's specifiers safely
    if (targetImportPath && targetImportPath.node) {
      const targetSpecifiers = targetImportPath.node.specifiers || [];

      // Filter out duplicates - only add specifiers that don't already exist
      const filteredNewSpecifiers = newImportSpecifiers.filter((newSpec) => {
        const newLocalName = newSpec.local?.name || newSpec.imported.name;
        return !targetSpecifiers.some(
          (existingSpec: any) =>
            j.ImportSpecifier.check(existingSpec) &&
            existingSpec.imported &&
            existingSpec.imported.name === targetComponentName &&
            (existingSpec.local?.name || existingSpec.imported.name) ===
              newLocalName
        );
      });

      if (filteredNewSpecifiers.length > 0) {
        // Combine new imports with existing ones
        // For normal cases: add new imports after existing ones
        // For multiple imports of same component: add new imports before existing ones
        const hasMultipleImportsOfSameComponent =
          newImportSpecifiers.length > 1;

        const combinedSpecifiers = hasMultipleImportsOfSameComponent
          ? [...filteredNewSpecifiers, ...targetSpecifiers] // New first for multiple imports
          : [...targetSpecifiers, ...filteredNewSpecifiers]; // Existing first normally

        j(targetImportPath).replaceWith(
          j.importDeclaration(
            combinedSpecifiers,
            j.stringLiteral(targetPackage)
          )
        );
      }
    }
  } else {
    // Create a new import declaration if one doesn't exist
    const newImport = j.importDeclaration(
      newImportSpecifiers,
      j.stringLiteral(targetPackage)
    );

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

  return results.length > 0 ? results : null;
}
