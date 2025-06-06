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
pnpm analyze                # Complete usage report
pnpm analyze:components     # Unmapped components only
pnpm analyze:props         # Unmapped properties only
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

Main mapping object in [`src/mappings/index.ts`](/src/mappings/index.ts):

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
      todoComments: "Use Inline instead", //optional
      props: {
        mappings: { width: "UNSAFE_width" }
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
  fluid: (originalValue, { j, tag }) => {
    const value = tryGettingLiteralValue(originalValue);
    if (!originalValue || Boolean(value) !== false) {
      return { to: "width", value: j.stringLiteral("100%") };
    }
    return null;
  }
}
```

**Adding developer comments:**

```ts
mappings: {
  reverse: (originalValue, { j, tag }) => ({
    to: "reverse",
    value: originalValue,
    todoComments: "Remove reverse prop, see: https://hopper.workleap.design/components/Flex#migration-notes"
  })
}
```

### Adding New Properties

Use the `additions` field for new properties:

```ts
additions: {
  display: "block",
  UNSAFE_gap: (tag, { j, log }) => 
    hasAttribute(tag.node.attributes, ["gap", "UNSAFE_gap"]) ? null : "1.25rem"
}
```

### Component-Level Configuration

**Adding developer comments:**

For adding migration comments to a component, use the `todoComments` field. This will add TODO comments to any usage of the component.

```ts
components: {
  Counter: {
    todoComments: "`Counter` is not supported anymore. You need to find an alternative."
  },
}
```

### Helper Functions

Key utilities from [`src/mappings/helpers.ts`](/src/mappings/helpers.ts):

- `tryGettingLiteralValue()` - Extract literal values (most common)
- `hasAttribute()` - Check if element has specific attributes
- `createPropertyMapper()` - Generic property mapping
- `createHopperCssPropertyMapper()` - CSS property mapping

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

3. **Update `output.tsx`** with the correct expected transformation result
