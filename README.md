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

#### Migrate a Specific Component

```bash
npx codemod workleap/orbiter-to-hopper -c Div
```

#### Target a Specific Directory

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

To test changes locally before publishing:

```bash
codemod --source /path/to/your/local/copy
```

> [!TIP]
> To run the latest modifications, the `cdmd_dist` folder should not exist. If you use the `pnpm deploy:codemod`, this folder is getting deleted after each deployment automatically.

### Simple Modifications

Modify the [mappings.ts](/src/mappings/mappings.ts) for simple mappings. Just add the components and props to map.

```ts
{
  sourcePackage: "@workleap/orbiter-ui",
  targetPackage: "@hopper-ui/components",
  components: {
    Span: "Span",
    Text: "Text",    
    Div: {
      targetName: "Div",
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
        additions: { //add these prop/values to the mapped component
          "display" : "block"
        }
      },
    },
  },
};
```
