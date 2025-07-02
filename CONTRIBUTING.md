# Contributing to Orbiter to Hopper Codemod

Thank you for your interest in contributing! This guide helps you contribute effectively to the Orbiter to Hopper migration codemod.

## Quick Start

1. [Install the codemod CLI globally](https://docs.codemod.com/deploying-codemods/cli#installation)
2. Make your modifications to the codebase
3. Test locally using `pnpm sample`
4. Publish with `pnpm deploy:codemod`

## Development Workflow

### Local Testing

**Test with sample file:**

```bash
pnpm sample                 # Dry run (preview changes)
pnpm sample:write          # Apply changes (remember to revert)
```

**Test with external repository:**

```bash
codemod --source /path_to_local_copy_of_this_repo
```

> [!TIP]
> Delete the `cdmd_dist` folder to ensure latest modifications run. The deploy script handles this automatically.

### Analysis Scripts

Analyze component, function, and type usage across all locally cloned repositories:

```bash
# For orbiter mappings (default)
pnpm analyze:orbiter:state          # Complete usage report
pnpm analyze:orbiter:components     # Unmapped components only
pnpm analyze:orbiter:props          # Unmapped properties only

# For hopper mappings
pnpm analyze:hopper:state           # Complete usage report with hopper mappings
pnpm analyze:hopper:state:deep      # Deep analysis with hopper mappings
```

You can also use the scripts with custom parameters:

```bash
# Using custom parameters
./scripts/analyze-state.sh --mappings hopper
./scripts/analyze.not-mapped-components.sh --deep true --mappings hopper
```

## Architecture Overview

### Project Structure

```text
src/
├── mappings/           # Mapping rules and transformations
│   ├── index.ts       # Main mapping configuration
│   ├── components/    # Component-specific mappings
│   └── styled-system/ # Style property mappings
├── migrations/        # Core transformation logic
└── analysis/          # Usage analysis tools

test/
├── input.tsx          # Test cases (Orbiter components)
├── output.txt         # Expected results (Hopper components)
├── analyze.test.ts    # Analysis functionality tests
├── migrate.test.ts    # Migration functionality tests
├── mappings.test.ts   # Mappings table tests
└── utils.ts           # Test utilities and helpers
```

### Mapping Configuration

Main mapping object in [`src/mappings/orbiter/index.ts`](/src/mappings/orbiter/index.ts):

```ts
{
  sourcePackage: "@workleap/orbiter-ui",
  targetPackage: "@hopper-ui/components",
  propsDefaults: {
    mappings: {
      disabled: "isDisabled",
      readOnly: "isReadOnly"
    }
  },
  components: {
    Div: {
      to: "Div",
      todoComments: "Use Inline instead",
      migrationNotes: "The new component will have a different padding. Related Chromatic tests will be affected.",
      props: {
        mappings: { width: "UNSAFE_width" },
        additions: { display: "block" } // new properties to add
      }
    }
  }
}
```

## Writing Mapping Rules

### Property Mappings

**Simple mapping:**

```ts
mappings: {
  width: "UNSAFE_width",
  height: "UNSAFE_height"
}
```

**Function-based transformation:**

```ts
mappings: {
  fluid: (originalValue, runtime) => {
    const value = tryGettingLiteralValue(originalValue, runtime);
    if (!originalValue || Boolean(value) !== false) {
      return { to: "width", value: runtime.j.stringLiteral("100%") };
    }
    return null;
  }
}
```

**Adding developer comments:**

```ts
mappings: {
  reverse: (originalValue, runtime) => ({
    to: "reverse",
    value: originalValue,
    todoComments: "Remove reverse prop, see: https://hopper.workleap.design/components/Flex#migration-notes"
  })
}
```

**Adding Migration Notes:**

The `migrationNotes` field generates a consolidated `migration-notes.md` file that provides guidance for developers about migration-related changes. Unlike `todoComments` which add inline comments to the code, migration notes create a separate documentation file:

```ts
components: {
  // Component-level migration notes
  Button: {
    to: "Button",
    migrationNotes: [
      "Button component has been migrated from Orbiter to Hopper.",
      "Please review the implementation for any breaking changes."
    ]
  },
  
  // Property-level migration notes
  Flex: {
    to: "Flex",
    props: {
      mappings: {
        reverse: (originalValue, runtime) => ({
          to: "reverse",
          value: originalValue,
          migrationNotes: "The reverse prop behavior may have changed in Hopper. Please verify the layout."
        })
      }
    }
  }
}
```

**When to use `migrationNotes` vs `todoComments`:**

- **Use `migrationNotes`** for high-level guidance, breaking changes, and general migration information
- **Use `todoComments`** for specific code changes that need immediate developer attention

### Adding New Properties

Use the `additions` field for new properties. You can provide static values or functions:

```ts
additions: {
  display: "block", // static value
  UNSAFE_gap: (tag, runtime) => 
    hasAttribute(tag.node, ["gap", "UNSAFE_gap"]) ? null : "1.25rem"
}
```

### Removing Properties

Use the `removals` field to remove properties from the target component:

```ts
props: {
  removals: ["title", "deprecated"],  // Remove these properties
  mappings: {
    // ... other mappings
  }
}
```

The `removals` field accepts an array of property names that should be removed from the component during migration. This is useful when properties are no longer supported or have been replaced by different patterns.

**Removing properties during transformation:**

Use `removeIt: true` to completely remove a property during migration:

```ts
mappings: {
  conditionalRemoval: (originalValue, runtime) => {
    const value = tryGettingLiteralValue(originalValue, runtime);
    if (value === "legacy") {
      return { removeIt: true };  // Remove if legacy value
    }
    return { to: "newProp", value: originalValue };  // Otherwise transform
  }
}
```

**PropertyAdderFunction signature:**

```ts
type PropertyAdderFunction = (
  tag: ASTPath<JSXOpeningElement>,
  runtime: Runtime
) => string | number | boolean | object | JSXAttribute["value"] | null;
```

**Important:** Use `tag.node` to access the JSX opening element when calling helper functions like `hasAttribute(tag.node, ...)` or `getAttributeLiteralValue(tag.node, ...)`.

**Real-world example:**

```ts
additions: {
  UNSAFE_marginBottom: (tag, runtime) => {
    if (hasAttribute(tag.node, ["marginBottom", "UNSAFE_marginBottom"])) {
      return null; // Don't add if already exists
    }
    
    const size = hasAttribute(tag.node, "size")
      ? getAttributeLiteralValue(tag.node, "size", runtime)
      : "md";
    
    return `calc(1.75rem * .5)`; // Default margin for md size
  }
}
```

### Component-Level Configuration

**Adding developer comments:**

The `todoComments` field supports multiple formats for maximum flexibility:

```ts
components: {
  // Simple string comment
  Counter: {
    todoComments: "`Counter` is not supported anymore. You need to find an alternative."
  },
  
  // Array of comments
  OldComponent: {
    todoComments: [
      "This component is deprecated",
      "Consider using NewComponent instead"
    ]
  },
  
  // Dynamic function-based comments
  IllustratedMessage: {
    todoComments: (tag, runtime) => {
      const msgs = [];
      if (hasAttribute(tag.node, "orientation")) {
        msgs.push("orientation has been removed.");
      }
      if (hasAttribute(tag.node, ["width", "height"])) {
        msgs.push("width and height props now affect the whole wrapper.");
      }
      return msgs; // returns string[] or undefined
    }
  }
}
```

**Skipping import migration:**

Use the `skipImport` field when you want to prevent a component from being migrated to the target package while still applying property transformations and todo comments:

```ts
components: {
  // Skip import migration but still transform props and add comments
  Overlay: {
    skipImport: true,
    todoComments: "This component is deprecated. Use Modal instead.",
  }, 
}
```

**Behavior with `skipImport: true`:**

- ✅ Component import remains in the original package (`@workleap/orbiter-ui`)
- ✅ Property transformations are still applied
- ✅ Todo comments are still added to guide developers
- ✅ Component usage analysis still works
- ❌ Component name won't be changed (even if `to` field is specified)

### Dynamic Component Mappings

Components can have multiple conditional mappings using an array of `ComponentMappingFunction`s. This allows a single component to be transformed into different target components based on its attributes:

```ts
components: {
  // Single component with multiple possible mappings
  Item: [
    // First mapping function - check for "x" attribute
    (tag, runtime) => {
      if (hasAttribute(tag.node, "x")) {
        return {
          to: "ListItem",
          props: {
            mappings: {
              x: "itemId"
            }
          }
        };
      }
    },
    
    // Second mapping function - check for "y" attribute
    (tag, runtime) => {
      if (hasAttribute(tag.node, "y")) {
        return {
          to: "MenuItem", 
          props: {
            mappings: {
              y: "menuId"
            }
          }
        };
      }
    },
    
    // Third mapping function - fallback for unsupported cases
    (tag, runtime) => {
      if (hasAttribute(tag.node, "z")) {
        return {
          skipImport: true,
          todoComments: "This usage pattern is not supported. Consider alternative approach."
        };
      }
    }
  ]
}
```

**How dynamic mappings work:**

1. **Only available for tags:** If it is being used for types (e.g. `DivProps`), these functions are getting ignored.
2. **Sequential evaluation:** Functions are called in order until one returns a mapping
3. **First match wins:** The first function that returns a non-undefined result is used
4. **Conditional logic:** Use `hasAttribute()`, `getAttributeLiteralValue()`, and other helpers to analyze the component
5. **Flexible transformations:** Each mapping can specify different target components, properties, and import behavior

**Example transformation:**

```tsx
// Input
<Item x="user1" />       // Matches first mapping function
<Item y="menu1" />       // Matches second mapping function  
<Item z="legacy" />      // Matches third mapping function
<Item />                 // No match - remains unchanged

// Output  
<ListItem itemId="user1" />
<MenuItem menuId="menu1" />  
{/* Migration TODO: This usage pattern is not supported. Consider alternative approach. */}
<Item z="legacy" />
<Item />
```

**Import handling with dynamic mappings:**

When components have dynamic mappings, the codemod automatically handles import management:

- **Multiple targets:** Different instances map to different components
- **Alias preservation:** Local aliases are maintained with numeric suffixes when needed
- **Import consolidation:** All required components are imported efficiently
- **Mixed usage:** Supports cases where some instances are migrated and others remain in original package

### Advanced Transformation Patterns

**Property removal and child manipulation:**

For complex transformations that involve removing properties and adding child elements, you can combine the `removals` field with helper functions like `addChildrenTo`:

```ts
components: {
  Section: [(tag, runtime) => {
    if (isWithinComponent(tag, "ListBox", runtime.mappings.targetPackage, runtime)) {
      const titleValue = getAttributeValue(tag.node, "title");
      
      // Add a Header child with the title value
      addChildrenTo(tag, "Header", [titleValue], runtime);
      
      return {
        to: "ListBoxSection",
        props: {
          removals: ["title"]  // Remove the title prop since it's now a child
        }
      };
    }
  }]
}
```

This pattern is useful when migrating from attribute-based APIs to child-based APIs:

```tsx
// Input
<Section title="My Section">Content</Section>

// Output  
<ListBoxSection>
  <Header>My Section</Header>
  Content
</ListBoxSection>
```

### Helper Functions

Key utilities from [`src/utils/mapping.ts`](/src/utils/mapping.ts):

**Core extraction functions:**

- `tryGettingLiteralValue(value, runtime)` - Extract literal values from JSX attributes (most common)
- `hasAttribute(tag, keys)` - Check if JSX element has specific attributes
- `getAttributeLiteralValue(tag, attributeName, runtime)` - Extract literal value from a specific attribute
- `getAttributeValue(tag, attributeName)` - Get the raw value of a JSX attribute (returns the AST node)

**Component context functions:**

- `isWithinComponent(path, componentNames, packageName, runtime)` - Check if current element is within a specific parent component

**DOM manipulation functions:**

- `addChildrenTo(tag, childName, values, runtime)` - Add child elements to a component with specified values
- `createObjectExpression(obj, runtime)` - Create JSX object expression from a plain object

**Property mapping functions:**

- `createHopperCssPropertyMapper(options)` - CSS property mapping for Hopper styled system
- `createCssPropertyMapper(options)` - Generic CSS property mapping
- `getReviewMePropertyName(propertyName)` - Generate ReviewMe property name with prefix

**Value validation utilities:**

- `isPercentageValue(value)` - Check if value is a percentage (e.g., "50%")
- `isFrValue(value)` - Check if value is a fractional unit (e.g., "1fr")
- `isAttributeValueType(val)` - Validate if value is a valid JSX attribute value

### Runtime Interface

The `runtime` parameter provides access to transformation utilities:

```ts
interface Runtime {
  j: core.JSCodeshift;              // jscodeshift API
  root: Collection<ASTNode>;        // AST root collection
  mappings: MapMetaData;            // Current mappings configuration
  filePath: string;                 // Current file being processed
  log: (message: string, ...args: any[]) => void;  // Logging function
  getRepoInfo: () => RepoInfo | null;  // Repository information
  getBranch: () => string;          // Current git branch
}
```

Common usage:

```ts
const { j, log } = runtime;
const value = j.stringLiteral("100%");
log("Applied fluid transformation");
```

## Testing

### Test Mappings

- **[`test/input.tsx`](/test/input.tsx)** - Orbiter component test cases
- **[`test/output.txt`](/test/output.txt)** - Expected transformation results

### Adding Test Cases

1. **Add test case to `input.tsx`:**

   ```tsx
   <Flex padding="400">Content</Flex>
   <MyComponent newProp="value">Test</MyComponent>
   ```

2. **Generate output:**

   ```bash
   pnpm sample
   ```

3. **Update `output.txt`** with the correct expected transformation result
