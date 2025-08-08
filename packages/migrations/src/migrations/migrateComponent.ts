import type { ASTPath, Collection, JSXOpeningElement } from "jscodeshift";

import { getLocalNameFromImport, resolveAliasLocalNames, resolveComponentMapping, tryToGetStaticMapping } from "../utils/migration.ts";
import type {
  ComponentMapMetaData,
  Runtime
} from "../utils/types.ts";
import { migrateComponentInstances } from "./migrateComponentInstances.ts";
import { type ImportMap, migrateImport } from "./migrateImport.ts";

export function migrateComponent(componentName: string, runtime: Runtime): void {
  // 1. Find all local names for the component from imports.
  const importedLocalNames = getAllLocalImports(componentName, runtime);
  
  // 2. Find all alias names for this component if aliases are provided
  const aliasesLocalNames = resolveAliasLocalNames(componentName, runtime);
  
  // 3. Combine imported local names and alias names
  const allLocalNames = [...importedLocalNames, ...aliasesLocalNames];
  
  if (allLocalNames.length === 0) {
    return;
  }

  // 4. For each instance, resolve the mapping and collect migration data for only the components that have mappings available.
  const { instances, localNamesWithoutMigration } = getMigratableComponentInstances(allLocalNames, componentName, aliasesLocalNames, runtime);

  // 5. Create a map for localName to the list of newComponentNames. (e.g. when `Button as B` will be migrated to `LinkButton as B` and `TextButton as B1`)
  const { localToNewComponentNamesMap, getNewLocalName } = getLocalToNewComponentNamesMap(
    instances,
    localNamesWithoutMigration,
    componentName
  );

  
  // 6. Apply migrations to each instance.
  instances.forEach(({ tags, mapping, localName, newComponentName, isAlias }) => {
    const newLocalName = isAlias ? localName : getNewLocalName(localName, newComponentName); // Aliases keep their original names

    migrateComponentInstances(tags, componentName, localName, newLocalName, mapping, runtime);
  });

  
  // 7. Handle imports (only for non-alias components)
  const requiredImports: ImportMap[] = [];

  localToNewComponentNamesMap.forEach((newComponentNames, localName) => {
    // Skip import handling for aliases
    if (aliasesLocalNames.includes(localName)) {
      return;
    }
    
    newComponentNames.forEach(newComponentName => {
      const newLocalName = getNewLocalName(localName, newComponentName);
      requiredImports.push({ source: { componentName, localName }, target: { componentName: newComponentName, localName: newLocalName } });
    });
  });

  // unusedImports: 
  //  - includes: unused imports (by unused we mean that cannot find a tag with this local name)
  //  - includes: imports without related tags (like type imports)
  //  - exclude: removed skipImport  
  //  - exclude: aliases (they don't have imports to handle)
  const unusedImports = importedLocalNames
    .filter(localName => !localToNewComponentNamesMap.has(localName))
    .filter(localName => 
      instances.find(item => item.localName === localName && item.skipImport) === undefined
    );

  unusedImports.forEach(localName => {
    const mapping = resolveComponentMapping(componentName, undefined, runtime);
    const newComponentName = typeof mapping === "string" ? mapping : (mapping?.to ?? componentName);    

    requiredImports.push({ source: { componentName, localName }, target: { componentName: newComponentName, localName } });
  });

  migrateImport(requiredImports, localNamesWithoutMigration, runtime);
}

function getAllLocalImports(componentName: string, runtime: Runtime) {
  const { j, root, mappings } = runtime;
  const { sourcePackage } = mappings;
  const results: string[] = [];

  const sourceDeclarations = root.find(j.ImportDeclaration, {
    source: { value: sourcePackage }
  });

  sourceDeclarations.forEach(path => {
    const specifiers = path.node.specifiers || [];
    specifiers.forEach(specifier => {
      if (
        j.ImportSpecifier.check(specifier) &&
          specifier.imported.name === componentName
      ) {
        const localName = getLocalNameFromImport(specifier);
        results.push(localName);
      }
    });
  });

  return results;
}

interface MigratableComponentInstance {
  tags: ASTPath<JSXOpeningElement>[];
  mapping: ComponentMapMetaData;
  localName: string;
  newComponentName: string;
  skipImport: boolean;
  isAlias: boolean;
}

function getMigratableComponentInstances(localNames: string[], componentName: string, aliasesLocalNames: string[], runtime: Runtime) {
  const migratableInstances: MigratableComponentInstance[] = [];
  const { j, root } = runtime;

  //Find all instances of the component regardless of having mapping or not.
  const allAvailableInstances = root
    .find(j.JSXOpeningElement)
    .filter(
      path =>
        j.JSXIdentifier.check(path.node.name) &&
        localNames.includes(path.node.name.name)
    );

  const localNamesWithoutMigration: Set<string> = new Set();
  const staticMapping = tryToGetStaticMapping(componentName, runtime);

  if (staticMapping) {
    processStaticMapping(allAvailableInstances, staticMapping, componentName, migratableInstances, aliasesLocalNames);

    return { instances: migratableInstances, localNamesWithoutMigration };
  } else {
    processDynamicMapping(allAvailableInstances, componentName, migratableInstances, localNamesWithoutMigration, aliasesLocalNames, runtime);
  }

  return { instances: migratableInstances, localNamesWithoutMigration };
}

function createMigratableComponentInstance(
  tags: ASTPath<JSXOpeningElement>[],
  mapping: ComponentMapMetaData,
  localName: string,
  componentName: string,  
  aliasesLocalNames: string[]
): MigratableComponentInstance {
  const isAlias = aliasesLocalNames.includes(localName);

  return { 
    tags, 
    mapping, 
    localName,         
    newComponentName: typeof mapping === "string" ? mapping : (mapping.to || componentName),
    skipImport: typeof mapping === "string" ? false : (mapping.skipImport ?? false),
    isAlias
  };
}

function getLocalToNewComponentNamesMap(
  instances: MigratableComponentInstance[],
  localNamesWithoutMigration: Set<string>,
  componentName: string
) {
  const localToNewComponentNamesMap = new Map<string, string[]>();
    
  instances
    .filter(o => !o.skipImport)
    .forEach(({ localName, newComponentName }) => {
      if (!localToNewComponentNamesMap.has(localName)) {
        localToNewComponentNamesMap.set(localName, []);
      }
      localToNewComponentNamesMap.get(localName)?.push(newComponentName);
    });

  const getNewLocalName = (localName: string, newComponentName: string) => {
    const newComponentNameList = localToNewComponentNamesMap.get(localName);
    if (!newComponentNameList) {
      return localName; // If no new component names, return the original local name. It happens when skipImport is true.
    }

    if (localName === componentName) {// it is not an aliased local name, so we can use the new component name directly.
      return newComponentName;
    }

    //Aliased local names should be suffixed with an index if there are multiple new component names.
    const idx = newComponentNameList.indexOf(newComponentName);

    if (localNamesWithoutMigration.has(localName)) {//we should keep the original local name for the not-mapped instances
      return `${localName}${idx + 1}`;
    }

    //All items have mapping, so we can reuse the local name safely
    return `${localName}${idx === 0 ? "" : idx}`;
  };

  return { localToNewComponentNamesMap, getNewLocalName };
}

function processStaticMapping(
  allAvailableInstances: Collection<JSXOpeningElement>,
  staticMapping: ComponentMapMetaData,
  componentName: string,
  migratableInstances: MigratableComponentInstance[],
  aliasesLocalNames: string[]
): void {
  // If there is a static mapping, we can use it for all instances.
  const localNameTagsMap = groupTagsByLocalName(allAvailableInstances, staticMapping);
  
  localNameTagsMap.forEach(({ mapping, tags }, localName) => {
    migratableInstances.push(createMigratableComponentInstance(tags, mapping, localName, componentName, aliasesLocalNames));
  });
}

function processDynamicMapping(
  allAvailableInstances: Collection<JSXOpeningElement>,
  componentName: string,
  migratableInstances: MigratableComponentInstance[],
  localNamesWithoutMigration: Set<string>,
  aliasesLocalNames: string[],
  runtime: Runtime
): void {
  allAvailableInstances.forEach(tag => {
    const localName = (tag.node.name as any).name;
    const mapping = resolveComponentMapping(componentName, tag, runtime);  

    if (mapping) {
      migratableInstances.push(createMigratableComponentInstance([tag], mapping, localName, componentName, aliasesLocalNames));
    } else {
      localNamesWithoutMigration.add(localName);
    }
  });
}

function groupTagsByLocalName(
  allAvailableInstances: Collection<JSXOpeningElement>,
  staticMapping: ComponentMapMetaData
): Map<string, { mapping: ComponentMapMetaData; tags: ASTPath<JSXOpeningElement>[] }> {
  const localNameTagsMap: Map<string, { mapping: ComponentMapMetaData; tags: ASTPath<JSXOpeningElement>[] }> = new Map();
  
  allAvailableInstances.forEach(tag => {
    const localName = (tag.node.name as any).name;
    let localNameTags = localNameTagsMap.get(localName);
    if (!localNameTags) {
      localNameTags = { mapping: staticMapping, tags: [] };
      localNameTagsMap.set(localName, localNameTags);
    }
    localNameTags.tags.push(tag);
  });
  
  return localNameTagsMap;
}