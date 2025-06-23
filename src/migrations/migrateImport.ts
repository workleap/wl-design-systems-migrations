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

function isImportCaseAlreadyAdded(importCase: ImportMap, runtime: Runtime): boolean {
  const { j, root, mappings } = runtime;
  const { targetPackage } = mappings;
  const { newComponentName, newLocalName } = importCase;

  // Check if there's already an import from the target package with the same component and local name
  const existingImport = root.find(j.ImportDeclaration, {
    source: {
      value: targetPackage
    }
  });

  if (existingImport.length === 0) {
    return false;
  }

  // Check all import specifiers in the target package imports
  let isFound = false;
  existingImport.forEach(path => {
    const importSpecifiers = path.node.specifiers || [];
    
    const hasMatchingSpecifier = importSpecifiers.some((specifier: any) => {
      if (!j.ImportSpecifier.check(specifier) || !specifier.imported) {
        return false;
      }
      
      const importedName = specifier.imported.name;
      const localName = getLocalNameFromImport(specifier);
      
      return importedName === newComponentName && localName === newLocalName;
    });

    if (hasMatchingSpecifier) {
      isFound = true;
    }
  });

  return isFound;
}

export function addImportCase(
  importCase: ImportMap,
  runtime: Runtime
) {
  // Check if the import case is already added to the target package
  if (isImportCaseAlreadyAdded(importCase, runtime)) {
    return;
  }

  const { j, root, mappings } = runtime;
  const { sourcePackage, targetPackage } = mappings;
  const { componentName, localName, newComponentName, newLocalName } = importCase;
 
  const isAliased = newLocalName !== newComponentName;   
  const newImportSpecifier = j.importSpecifier(
    j.identifier(newComponentName),
    isAliased ? j.identifier(newLocalName) : null
  );
  let isFromSeparateTypeImport = false;

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
          // Check if this is a type import (either the whole import or this specific specifier)
          const isTypeImport =
            path.node.importKind === "type" ||
            (componentSpecifier as any).importKind === "type";

          // Set the importKind for inline type imports only (not for separate import type declarations)
          if (isTypeImport && path.node.importKind !== "type") {
            (newImportSpecifier as any).importKind = "type";
          }

          // Store whether this specifier came from a separate type import declaration
          isFromSeparateTypeImport = path.node.importKind === "type";
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
    const targetImportPath = existingTargetImport.paths()[0];

    if (!targetImportPath) {
      return;
    }

    const existingIsTypeImport = targetImportPath.node.importKind === "type";

    // If we have separate type imports, handle them appropriately
    if (isFromSeparateTypeImport) {
      if (existingIsTypeImport) {
        // Both existing and new are type imports - merge them
        const targetSpecifiers = targetImportPath.node.specifiers || [];


        const combinedSpecifiers = [...targetSpecifiers, newImportSpecifier];
        const newImportDeclaration = j.importDeclaration(
          sortImportSpecifiers(combinedSpecifiers),
          j.stringLiteral(targetPackage)
        );
          // Set the import kind to type
        newImportDeclaration.importKind = "type";
                  
        j(targetImportPath).replaceWith(newImportDeclaration);
      } else {
        // Existing is regular import, new are type imports - create separate type import
        const newImport = j.importDeclaration(
          [newImportSpecifier],
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
     
        const combinedSpecifiers = [...targetSpecifiers, newImportSpecifier]; // Existing first normally

        const newImportDeclaration = j.importDeclaration(
          sortImportSpecifiers(combinedSpecifiers),
          j.stringLiteral(targetPackage)
        );
        j(targetImportPath).replaceWith(newImportDeclaration);
      }
    } // Close the else block
  } else {
    // Create a new import declaration if one doesn't exist


    const newImport = j.importDeclaration(
      [newImportSpecifier],
      j.stringLiteral(targetPackage)
    );

    // Set import kind for type imports
    if (isFromSeparateTypeImport) {
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