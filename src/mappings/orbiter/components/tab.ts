import { addImportCase } from "../../../migrations/migrateImport.ts";
import { tryGettingLiteralValue } from "../../../utils/mapping.ts";
import { createFinalChildrenArray, createIndentedElementList, extractBaseIndentation } from "../../../utils/migration.ts";
import type { ComponentMapping, Runtime } from "../../../utils/types.ts";

const basicMappings: ComponentMapping = {
  props: {
    mappings: {    
      orientation: () => ({
        todoComments: "`orientation` is not supported anymore. More details: https://hopper.workleap.design/components/Tabs#migration-notes"      
      }),
      manual: () => ({
        todoComments: "`manual` is not supported anymore. Refer to this sample(https://hopper.workleap.design/components/Tabs#usage-manually-activated-tabs) to quickly match old sizes. More details: https://hopper.workleap.design/components/Tabs#migration-notes"      
      }),
      collapsible: (originalValue, innerRuntime) => {
        const value = tryGettingLiteralValue(originalValue, innerRuntime);
        if (value === false) {
          return {            
            removeIt: true
          };
        }

        return {          
          migrationNotes: "Tabs are NOT collapsible by default. It means if you have multiple tabs you may get different view if they are not all visible at once. Please manually validate it"
        };
      }      
    }
  }
};

export const tabMapping = {
  Tabs: [(tag, runtime: Runtime) => {
    const { j } = runtime;
    
    // Get the JSX element (parent of the opening tag)
    const jsxElement = tag.parent.value;
    let tagComment = "Please review the Tabs migration changes, especially the TabList and TabPanel structure.";
    const notDoneComment = "It cannot be migrated automatically. Please do it manually by restructuring Items with Header/Content to TabList/Tab and TabPanel components. More details: https://hopper.workleap.design/components/Tabs#usage";

    if (jsxElement.children && jsxElement.children.length > 0) {
      const itemChildren = jsxElement.children.filter((child: any) =>
        child.type === "JSXElement" && 
        child.openingElement && 
        child.openingElement.name.type === "JSXIdentifier" &&
        child.openingElement.name.name === "Item"
      );

      if (itemChildren.length > 0) {
        // Check if all items have the expected Header/Content structure
        const validItems = [];
        let allItemsValid = true;

        for (const item of itemChildren) {
          const itemElementChildren = item.children?.filter((child: any) =>
            child.type === "JSXElement"
          ) || [];

          if (itemElementChildren.length === 2) {
            const headerChild = itemElementChildren.find((child: any) =>
              child.openingElement?.name?.type === "JSXIdentifier" &&
              child.openingElement.name.name === "Header"
            );
            const contentChild = itemElementChildren.find((child: any) =>
              child.openingElement?.name?.type === "JSXIdentifier" &&
              child.openingElement.name.name === "Content"
            );

            if (headerChild && contentChild) {
              // Get the key attribute from the Item
              const keyAttr = item.openingElement.attributes?.find((attr: any) =>
                attr.type === "JSXAttribute" && attr.name.name === "key"
              );

              // Get all other attributes from Item (excluding key)
              const itemOtherAttrs = item.openingElement.attributes?.filter((attr: any) =>
                attr.type === "JSXAttribute" && attr.name.name !== "key"
              ) || [];

              validItems.push({
                item,
                headerChild,
                contentChild,
                keyAttr,
                itemOtherAttrs
              });
            } else {
              allItemsValid = false;
              break;
            }
          } else {
            allItemsValid = false;
            break;
          }
        }

        if (allItemsValid && validItems.length > 0) {
          // Extract the base indentation from the first Item
          const baseIndent = extractBaseIndentation(jsxElement, "Item");
          const tabIndent = baseIndent + "  "; // Add 2 spaces for Tab elements

          // Rename Header to Tab and add id attribute from key
          const tabElements = [];
          
          for (const { headerChild, keyAttr, itemOtherAttrs } of validItems) {
            // Rename the tag from Header to Tab
            headerChild.openingElement.name = j.jsxIdentifier("Tab");
            if (headerChild.closingElement) {
              headerChild.closingElement.name = j.jsxIdentifier("Tab");
            }
            
            // Add id attribute from the key
            if (keyAttr) {
              headerChild.openingElement.attributes = headerChild.openingElement.attributes || [];
              headerChild.openingElement.attributes.push(
                j.jsxAttribute(
                  j.jsxIdentifier("id"),
                  keyAttr.value
                )
              );
            }

            // Add other attributes from Item (except key), with prop name conversions
            for (const attr of itemOtherAttrs) {
              let attrName = attr.name.name;
              
              // Convert 'disabled' to 'isDisabled'
              if (attrName === "disabled") {
                attrName = "isDisabled";
              }
              
              headerChild.openingElement.attributes = headerChild.openingElement.attributes || [];
              headerChild.openingElement.attributes.push(
                j.jsxAttribute(
                  j.jsxIdentifier(attrName),
                  attr.value
                )
              );
            }

            tabElements.push(headerChild);
          }

          // Create TabList with properly indented Tab elements
          const indentedTabElements = createIndentedElementList(tabElements, baseIndent, tabIndent, runtime);
          const tabListElement = j.jsxElement(
            j.jsxOpeningElement(j.jsxIdentifier("TabList"), [], false),
            j.jsxClosingElement(j.jsxIdentifier("TabList")),
            indentedTabElements
          );

          // Rename Content to TabPanel and add id attribute from key
          const tabPanelElements = [];
          
          for (const { contentChild, keyAttr } of validItems) {
            // Rename the tag from Content to TabPanel
            contentChild.openingElement.name = j.jsxIdentifier("TabPanel");
            if (contentChild.closingElement) {
              contentChild.closingElement.name = j.jsxIdentifier("TabPanel");
            }
            
            // Add id attribute from the key
            if (keyAttr) {
              contentChild.openingElement.attributes = contentChild.openingElement.attributes || [];
              contentChild.openingElement.attributes.push(
                j.jsxAttribute(
                  j.jsxIdentifier("id"),
                  keyAttr.value
                )
              );
            }

            tabPanelElements.push(contentChild);
          }

          // Create final children array with proper indentation
          const newChildren = createFinalChildrenArray(tabListElement, tabPanelElements, baseIndent, runtime);
          jsxElement.children = newChildren;

          // Add imports for the new components
          addImportCase({
            target: { componentName: "TabList", localName: "TabList" }
          }, runtime);
          addImportCase({
            target: { componentName: "Tab", localName: "Tab" }
          }, runtime);
          addImportCase({
            target: { componentName: "TabPanel", localName: "TabPanel" }
          }, runtime);
        } else {
          tagComment = notDoneComment;
        }
      }
    }

    return {
      ...basicMappings,
      todoComments: tagComment
    };
  }],
  TabProps: "TabsProps"
} satisfies Record<string, ComponentMapping>;