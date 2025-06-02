# Orbiter to Hopper Codemod

This codemod automates the migration of components from [Orbiter](https://github.com/workleap/wl-orbiter) to the [Hopper](https://github.com/workleap/wl-hopper) design system.

## Examples

### Before Migration

```tsx
import { Div } from "@workleap/orbiter-ui";

export function App() {
  return <Div width="100px"/>;
}
```

### After Migration

```tsx
import { Div } from "@hopper-ui/components";

export function App() {
  return <Div UNSAFE_width="100px"/>;
}
```

## Usage Guide

### Running Migrations

#### Migrate All Components

```bash
npx codemod workleap/orbiter-to-hopper
```

Or explicitly specify all components:

```bash
npx codemod workleap/orbiter-to-hopper -c all
```

#### Migrate Layout Components Only

Migrate layout related components only (Flex, Grid, Div, ...). You can see the list in [layoutComponents.ts](/src/utils/layoutComponents.ts) file.

```bash
npx codemod workleap/orbiter-to-hopper -c layout
```

#### Migrate a Single Component Only

```bash
npx codemod workleap/orbiter-to-hopper -c Div
```

#### Target a Specific Path

Run the command in the desire path or pass the target path with the `-t` argument.

```bash
npx codemod workleap/orbiter-to-hopper -t /app/users
```

#### Additional Options

For more configuration options, refer to the [Codemod CLI options documentation](https://docs.codemod.com/deploying-codemods/cli#options).

### Analyzing Component Usage

To generate a report of Orbiter component usage patterns, use the following command:

```bash
npx codemod workleap/orbiter-to-hopper -a orbiter-usage.json -n 1
```

⚠️ **Important**: The `-n 1` flag limits execution to a single thread, which ensures accurate output collection.

This command generates a JSON file (`orbiter-usage.json`) containing usage statistics ordered by frequency. The output format prioritizes frequently used components and their properties:

```json
{
  "overall": {
    "usage": {
      "components": 20,
      "props": 80
    }
  },  
  "components": {  
    "Text": {
      "usage": 15,
      "props": {
        "size": {
          "usage": 75,
          "values": [
            "\"lg\"",
          ]
        }
      }
    },
    "Div": {
      "usage": 5,
      "props": {
        "backgroundColor": {
          "usage": 5,
          "values": [
            "\"neutral-weakest\"",
            "\"neutral-disabled\"",
            "style.backgroundColor"
          ]
        }
      }
    }
  }
}
```

## Contributing

### Setup

1. First, [install the codemod CLI globally](https://docs.codemod.com/deploying-codemods/cli#installation).

2. Make your modifications to the codebase.

### Publishing

To publish a new version:

```bash
pnpm publish
```

### Local Testing

Run the `pnpm sample` to see the dry mode changes for a [sample file](/test/input.tsx). You can call `pnpm sample:write` to write the changes to type check them, but remember to revert it as this file is used for unit tests.

#### Local Testing with External Repository

To test changes locally with an external repository before publishing:

```bash
codemod --source /path/to/your/local/copy
```

> [!TIP]
> To run the latest modifications, the `cdmd_dist` folder should not exist. If you use the `pnpm deploy:codemod`, this folder is getting deleted after each deployment automatically.

### Mappings Structure

The [mappings.ts](/src/mappings/mappings.ts) contains all mappings information. Just add the rules there. For example:

```ts
{
  sourcePackage: "@workleap/orbiter-ui",
  targetPackage: "@hopper-ui/components",
  components: {
    Span: "Span",
    Text: "Text",    
    Div: {
      to: "Div",
      props: {
        mappings: {
          width: "UNSAFE_width",
          height: "UNSAFE_height",
          maxWidth: (oldValue) => {
              return {
                  to: "UNSAFE_maxWidth"
                  value: oldValue,
              }
          }
        }
        additions: { //add these prop/values to the mapped component ONLY IF the property is not there already.
          "display" : "block"
        }
      },
    },
  },
};
```

There are some [helper functions](/src/mappings/helpers.ts) that can help you write mappings more easily:

- `createPropertyMapper`: A generic method to create mapping for properties.
- `createCssPropertyMapper`: To create map for styled system properties between Orbiter and Hopper.

#### Adding new property

To add a new property to a component, you should use the `additions` field. It accepts either simple key/value pairs or functions for dynamic property generation.

**Simple key/value:**

```ts
additions: {
  "display": "block"
}
```

**Function-based (for conditional logic):**

```ts
additions: {
  UNSAFE_gap: (tag, { j, log }) => {
    return hasAttribute(tag.value.attributes, ["gap", "UNSAFE_gap"])
      ? null
      : "1.25rem";
  }
}
```

Functions receive the JSX element and runtime context, allowing you to conditionally add properties based on existing attributes or other logic. Return `null` to skip adding the property.
