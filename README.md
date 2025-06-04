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

Migrate layout and structural components only (Flex, Grid, Div, Span, Article, Nav, ...). This includes all layout containers, HTML wrapper components, content elements, and placeholders. You can see the complete list in [layout-components-mappings.ts](/src/mappings/layout-components-mappings.ts) file.

```bash
npx codemod workleap/orbiter-to-hopper -c layout
```

#### Migrate Specific Components

Migrate a single component:

```bash
npx codemod workleap/orbiter-to-hopper -c Div
```

Migrate multiple specific components:

```bash
npx codemod workleap/orbiter-to-hopper -c Div,Text,Button
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

#### Filtering Analysis Results

You can filter the analysis to focus on specific areas that need attention:

**Analyze only unmapped components:**

```bash
npx codemod workleap/orbiter-to-hopper -a orbiter-usage-not-mapped-components.json --filter-unmapped components -n 1
```

**Analyze only unmapped properties for mapped components:**

```bash
npx codemod workleap/orbiter-to-hopper -a orbiter-usage-not-mapped-props.json --filter-unmapped props -n 1
```

**Include ignored properties in analysis:**

By default, the analysis excludes standard React/DOM properties like `aria-*`, `data-*`, `className`, `style`, etc. to focus on component-specific migration needs. To include these properties in the analysis, use the `--include-ignoreList` flag:

```bash
npx codemod workleap/orbiter-to-hopper -a orbiter-usage-complete.json --include-ignoreList -n 1
```

This can be combined with other filters for comprehensive analysis:

```bash
npx codemod workleap/orbiter-to-hopper -a orbiter-usage-all-unmapped.json --filter-unmapped props --include-ignoreList -n 1
```

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

### Quick Analysis Scripts

For development and testing purposes, you can use the predefined npm scripts that handle the analysis commands. These scripts analyze ALL the repos that are cloned locally:

**Generate complete usage report:**

```bash
npm run analyze
```

**Analyze only unmapped components:**

```bash
npm run analyze:components
```

**Analyze only unmapped properties:**

```bash
npm run analyze:props
```

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
- `createHopperCssPropertyMapper`: A specialized version of `createCssPropertyMapper` specifically for Hopper styled system properties.
- `hasAttribute`: Check if a JSX element has specific attributes.
- `getAttributeLiteralValue`: Extract literal values from JSX attributes.
- `tryGettingLiteralValue`: Safely extract literal values from various AST node types.
- `isPercentageValue`: Check if a value is a CSS percentage (e.g., "50%").
- `isFrValue`: Check if a value is a CSS fr unit (e.g., "1fr").

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
    return hasAttribute(tag.node.attributes, ["gap", "UNSAFE_gap"])
      ? null
      : "1.25rem";
  }
}
```

Functions receive the JSX element and runtime context, allowing you to conditionally add properties based on existing attributes or other logic. Return `null` to skip adding the property.

#### Mapping existing properties

When mapping existing properties from Orbiter to Hopper, you can use simple string mappings or functions for more complex transformations.

**Simple property mapping:**

```ts
mappings: {
  width: "UNSAFE_width",
  height: "UNSAFE_height",
}
```

**Function-based mapping with transformation:**

```ts
mappings: {
  fluid: (originalValue, { j, tag }) => {
    const value = tryGettingLiteralValue(originalValue);
    if (!originalValue || Boolean(value) != false) {
      return {
        to: "width",
        value: j.stringLiteral("100%"),
      };
    }
    return null;
  },
}
```

**Adding comments to transformations:**

When creating property mapping functions, you can include helpful comments for developers by adding a `comments` field to the returned object. This is particularly useful for deprecated properties or when manual intervention is needed:

```ts
mappings: {
  reverse: (originalValue, { j, tag }) => {
    return {
      to: "reverse",
      value: originalValue,
      comments: " TODO: Remove the \"reverse\" property, read this: https://hopper.workleap.design/components/Flex#migration-notes",
    };
  },
}
```

The comments will be added as inline comments next to the transformed property, helping developers understand what changes were made and what actions they might need to take.

**Function parameters:**

Property mapping functions receive two parameters:

1. `originalValue`: The original attribute value from the JSX element
2. Context object containing:
   - `j`: The jscodeshift API for creating new AST nodes
   - `tag`: The JSX element being processed, giving you access to inspect other attributes or the element structure
   - `log`: Logger instance for debugging (available in some contexts)
