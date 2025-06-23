import { getLocalNameFromImport } from "../utils/migration.ts";
import type { Runtime } from "../utils/types.js";

export interface ImportMap { componentName: string; localName: string; newComponentName: string; newLocalName: string }

export function migrateImport(importCases: ImportMap[], localNamesWithoutMigration: Set<string>, runtime: Runtime) {
  importCases.forEach(importCase => {
    addImportCase(
      importCase,
      runtime
    );
  });

  // Remove all matching component specifiers from the original import  
  importCases.forEach(importCase => {
    const { localName } = importCase;
    if (localNamesWithoutMigration.has(localName)) {
      // If the local name has instances that have not been migrated, skip removal
      return;
    }
    removeImportCase(importCase, runtime);
  });
}

function removeImportCase({ componentName, localName }: ImportMap, runtime: Runtime) {
  const { j, root, mappings } = runtime;
  const { sourcePackage } = mappings;

  root
    .find(j.ImportDeclaration, {
      source: {
        value: sourcePackage
      }
    })
    .forEach(path => {
      const importSpecifiers = path.node.specifiers || [];

      const filteredSpecifiers = importSpecifiers.filter(
        (specifier: any) =>
          !j.ImportSpecifier.check(specifier) ||
          !specifier.imported ||
          !(specifier.imported.name === componentName && 
          getLocalNameFromImport(specifier) === localName)
      );

      // Update the original import declaration if there are remaining imports
      if (filteredSpecifiers.length > 0) {
        const newImportDeclaration = j.importDeclaration(
          sortImportSpecifiers(filteredSpecifiers),
          j.stringLiteral(sourcePackage)
        );

        // Preserve the original importKind (for import type declarations)
        if (path.node.importKind) {
          newImportDeclaration.importKind = path.node.importKind;
        }
        j(path).replaceWith(newImportDeclaration);
      } else {
        // If there are no remaining imports, remove the declaration
        j(path).remove();
      }
    });
}

function addImportCase(
  { componentName,
    localName,
    newComponentName,
    newLocalName }: ImportMap,
  runtime: Runtime
) {
  const { j, root, mappings } = runtime;
  const { sourcePackage, targetPackage } = mappings;
 
  // Collect all import specifiers that need to be migrated
  const newImportSpecifiers: any[] = [];

  // Find all import declarations from the source package
  root
    .find(j.ImportDeclaration, {
      source: {
        value: sourcePackage
      }
    })
    .forEach(path => {
      const importSpecifiers = path.node.specifiers || [];

      // Find ALL component specifiers matching the component name and local name
      const componentSpecifiers = importSpecifiers.filter(
        specifier =>
          j.ImportSpecifier.check(specifier) &&
          specifier.imported &&
          specifier.imported.name === componentName && 
          getLocalNameFromImport(specifier) === localName
      );

      // Process each matching component specifier
      componentSpecifiers.forEach(componentSpecifier => {
        if (j.ImportSpecifier.check(componentSpecifier)) {
          // Get the local name (alias) of the component, or use the original name if no alias
          const isAliased = newLocalName !== newComponentName;

          // Check if this is a type import (either the whole import or this specific specifier)
          const isTypeImport =
            path.node.importKind === "type" ||
            (componentSpecifier as any).importKind === "type";

          // Create a new import specifier for the target package
          const newImportSpecifier = j.importSpecifier(
            j.identifier(newComponentName),
            isAliased ? j.identifier(newLocalName) : null
          );

          // Set the importKind for inline type imports only (not for separate import type declarations)
          if (isTypeImport && path.node.importKind !== "type") {
            (newImportSpecifier as any).importKind = "type";
          }

          newImportSpecifiers.push(newImportSpecifier);

          // Store whether this specifier came from a separate type import declaration
          (newImportSpecifier as any)._isFromSeparateTypeImport =
            path.node.importKind === "type";
        }
      });
    });


  // Check if there's already an import from the target package
  const existingTargetImport = root.find(j.ImportDeclaration, {
    source: {
      value: targetPackage
    }
  });

  if (existingTargetImport.length > 0) {
    // Check if we need to handle type imports differently
    const allAreFromSeparateTypeImports = newImportSpecifiers.every(
      spec => (spec as any)._isFromSeparateTypeImport
    );

    const targetImportPath = existingTargetImport.paths()[0];

    if (!targetImportPath) {
      return;
    }

    const existingIsTypeImport = targetImportPath.node.importKind === "type";

    // If we have separate type imports, handle them appropriately
    if (allAreFromSeparateTypeImports) {
      if (existingIsTypeImport) {
        // Both existing and new are type imports - merge them
        const targetSpecifiers = targetImportPath.node.specifiers || [];
        
        // Filter out duplicates - only add specifiers that don't already exist
        const filteredNewSpecifiers = newImportSpecifiers.filter(newSpec => {
          return !targetSpecifiers.some(
            (existingSpec: any) =>
              j.ImportSpecifier.check(existingSpec) &&
              existingSpec.imported &&
              existingSpec.imported.name === newSpec.imported.name &&
              (existingSpec.local?.name || existingSpec.imported.name) ===
                newLocalName
          );
        });

        if (filteredNewSpecifiers.length > 0) {
          const combinedSpecifiers = [...targetSpecifiers, ...filteredNewSpecifiers];
          const newImportDeclaration = j.importDeclaration(
            sortImportSpecifiers(combinedSpecifiers),
            j.stringLiteral(targetPackage)
          );
          // Set the import kind to type
          newImportDeclaration.importKind = "type";
                  
          j(targetImportPath).replaceWith(newImportDeclaration);
        }
      } else {
        // Existing is regular import, new are type imports - create separate type import
        const newImport = j.importDeclaration(
          sortImportSpecifiers(newImportSpecifiers),
          j.stringLiteral(targetPackage)
        );
        newImport.importKind = "type";

        // Insert after the existing import
        j(targetImportPath).insertAfter(newImport);
      }
    } else {
      // Add the specifiers to the existing import declaration
      // Access the node's specifiers safely
      if (targetImportPath && targetImportPath.node) {
        const targetSpecifiers = targetImportPath.node.specifiers || [];

        // Filter out duplicates - only add specifiers that don't already exist
        const filteredNewSpecifiers = targetSpecifiers.some(
          (existingSpec: any) =>
            j.ImportSpecifier.check(existingSpec) &&
              existingSpec.imported &&
              existingSpec.imported.name === newComponentName &&
              (existingSpec.local?.name || existingSpec.imported.name) ===
                newLocalName
        ) ? [] : newImportSpecifiers;

        if (filteredNewSpecifiers.length > 0) {
          // Combine new imports with existing ones
          // For normal cases: add new imports after existing ones
          // For multiple imports of same component: add new imports before existing ones
          const hasMultipleImportsOfSameComponent =
            newImportSpecifiers.length > 1;

          const combinedSpecifiers = hasMultipleImportsOfSameComponent
            ? [...filteredNewSpecifiers, ...targetSpecifiers] // New first for multiple imports
            : [...targetSpecifiers, ...filteredNewSpecifiers]; // Existing first normally

          const newImportDeclaration = j.importDeclaration(
            sortImportSpecifiers(combinedSpecifiers),
            j.stringLiteral(targetPackage)
          );
          j(targetImportPath).replaceWith(newImportDeclaration);
        }
      }
    } // Close the else block
  } else {
    // Create a new import declaration if one doesn't exist
    const allAreFromSeparateTypeImports = newImportSpecifiers.every(
      spec => (spec as any)._isFromSeparateTypeImport
    );

    const newImport = j.importDeclaration(
      sortImportSpecifiers(newImportSpecifiers),
      j.stringLiteral(targetPackage)
    );

    // Set import kind for type imports
    if (allAreFromSeparateTypeImports) {
      newImport.importKind = "type";
    }
    
    // Find all import declarations to add it at the end of the imports section
    const allImports = root.find(j.ImportDeclaration);
    if (allImports.length > 0) {          
      allImports.at(0).insertBefore(newImport);//We put it at beginning because insertAfter uses empty lines wrongly
    } else {
      // If there are no imports, add it to the beginning of the file
      root.get().node.program.body.unshift(newImport);
    }
  }
}

/**
 * Sorts import specifiers alphabetically by their imported name
 * @param specifiers - Array of import specifiers to sort
 * @returns Sorted array of import specifiers
 */
function sortImportSpecifiers(specifiers: any[]): any[] {
  return specifiers.sort((a, b) => {
    // Handle ImportSpecifier nodes - sort by local name (what the import is called in the code)
    if (a.imported && b.imported) {
      const aLocalName = a.local?.name || a.imported.name;
      const bLocalName = b.local?.name || b.imported.name;

      return aLocalName.localeCompare(bLocalName);
    }
    // Handle other types of specifiers (like ImportDefaultSpecifier) - sort by local name
    if (a.local && b.local) {
      return a.local.name.localeCompare(b.local.name);
    }

    return 0;
  });
}