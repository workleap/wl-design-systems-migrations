import { addImportCase } from "../../../migrations/migrateImport.ts";
import { getTodoComment } from "../../../utils/migration.ts";
import type { ComponentMapping, Runtime } from "../../../utils/types.ts";

export const disclosureMapping = {
  Disclosure: [(tag, runtime: Runtime) => {
    const { j } = runtime;
    
    // Get the JSX element (parent of the opening tag)
    const jsxElement = tag.parent.value;
    let tagComment = "Please review the Disclosure migration changes, especially the trigger slot and DisclosurePanel wrapper.";
    const notDoneComment = "It cannot be migrated automatically. Please do it manually by adding slot=`trigger` to the trigger and replace the content tag with `DisclosurePanel` component. More details: https://hopper.workleap.design/components/Disclosure#usage-custom-header";


    if (jsxElement.children && jsxElement.children.length >= 2) {
      const children = jsxElement.children.filter((child: any) =>
        child.type === "JSXElement" || child.type === "JSXFragment"
      );

      if (children.length === 2) {
        const firstChild = children[0];// trigger item
        const secondChild = children[1];// content item
        
        // Handle first child: add slot="trigger"
        if (firstChild.type === "JSXElement" && firstChild.openingElement) {
          // Add slot="trigger" attribute to the first child
          const firstChildAttributes = firstChild.openingElement.attributes || [];
          const slotAttribute = j.jsxAttribute(
            j.jsxIdentifier("slot"),
            j.stringLiteral("trigger")
          );
          firstChildAttributes.push(slotAttribute);
          firstChild.openingElement.attributes = firstChildAttributes;
        } else {
          // Add comment for manual handling
          const comment = getTodoComment(
            "Please add slot=\"trigger\" to the first child element manually.",
            runtime,
            true
          );
          firstChild.comments = [...firstChild.comments || [], comment];
        }
        
        // Handle second child: replace with DisclosurePanel
        if (secondChild.type === "JSXElement" && secondChild.openingElement) {
          // Replace the tag name with DisclosurePanel
          secondChild.openingElement.name = j.jsxIdentifier("DisclosurePanel");
          if (secondChild.closingElement) {
            secondChild.closingElement.name = j.jsxIdentifier("DisclosurePanel");
          }
          
          // Add import for DisclosurePanel
          addImportCase({
            target: { componentName: "DisclosurePanel", localName: "DisclosurePanel" }
          }, runtime);
        } else {
          // Add comment for manual handling
          const comment = getTodoComment(
            "Please replace the second child with a DisclosurePanel element manually.",
            runtime,
            true
          );
          secondChild.comments = [...secondChild.comments || [], comment];
        }
      } else {
        tagComment = notDoneComment;
      }
    } else {
      tagComment = notDoneComment;
    }

    return {
      props: {
        mappings: {    
          "defaultOpen": "defaultExpanded",
          "open": "isExpanded",
          "onOpenChange": "onExpandedChange"
        }
      },
      todoComments: tagComment
    };
  }],
  DisclosureProps: "DisclosureProps"
} satisfies Record<string, ComponentMapping>;

export const disclosureArrowMapping = {
  DisclosureArrow: {
    to: "ToggleArrow",
    props: {
      mappings: {  
        open: "isExpanded"
      }
    }
  },

  DisclosureArrowProps: "ToggleArrowProps"
} satisfies Record<string, ComponentMapping>;
