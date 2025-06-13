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
codemod --source /path/to/your/local/copy
```

> [!TIP]
> Delete the `cdmd_dist` folder to ensure latest modifications run. The deploy script handles this automatically.

### Analysis Scripts

Analyze component usage across all locally cloned repositories:

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
      todoComments: "Use Inline instead", // string | string[] | function
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

### Adding New Properties

Use the `additions` field for new properties. You can provide static values or functions:

```ts
additions: {
  display: "block", // static value
  UNSAFE_gap: (tag, runtime) => 
    hasAttribute(tag.node, ["gap", "UNSAFE_gap"]) ? null : "1.25rem"
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

### Helper Functions

Key utilities from [`src/utils/mapping.ts`](/src/utils/mapping.ts):

**Core extraction functions:**

- `tryGettingLiteralValue(value, runtime)` - Extract literal values from JSX attributes (most common)
- `hasAttribute(tag, keys)` - Check if JSX element has specific attributes
- `getAttributeLiteralValue(tag, attributeName, runtime)` - Extract literal value from a specific attribute

**Property mapping functions:**

- `createHopperCssPropertyMapper(options)` - CSS property mapping for Hopper styled system
- `createCssPropertyMapper(options)` - Generic CSS property mapping

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
