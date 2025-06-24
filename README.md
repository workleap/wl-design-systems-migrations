# Orbiter to Hopper Codemod <!-- omit in toc -->

This codemod automates the migration of components from [Orbiter](https://github.com/workleap/wl-orbiter) to the [Hopper](https://github.com/workleap/wl-hopper) design system.

The codemod handles various migration scenarios including:

- ✅ **Component migrations** - Automatically updates import statements and component names
- ✅ **Property transformations** - Maps old properties to new equivalents (e.g., `disabled` → `isDisabled`)
- ✅ **Deprecated component handling** - Keeps deprecated components in original package with todo comments for manual migration
- ✅ **Todo comment generation** - Adds contextual migration guidance directly in your code
- ✅ **Migration notes collection** - Generates comprehensive notes about important changes that require manual review

## Table of contents <!-- omit in toc -->

- [Before Migration](#before-migration)
- [After Migration](#after-migration)
- [Usage Guide](#usage-guide)
  - [Running Migrations](#running-migrations)
    - [Migrate All Components](#migrate-all-components)
    - [Migrate Component Categories](#migrate-component-categories)
    - [Migrate Specific Components](#migrate-specific-components)
    - [Target a Specific Path](#target-a-specific-path)
    - [Additional Options](#additional-options)
  - [Migration Notes](#migration-notes)
  - [Analyzing Component Usage](#analyzing-component-usage)
    - [Project-Specific Analysis](#project-specific-analysis)
    - [Deep Analysis](#deep-analysis)
    - [Specifying Mapping Table](#specifying-mapping-table)
    - [Filtering Analysis Results](#filtering-analysis-results)
- [Allowed Parameters](#allowed-parameters)
- [Shimmed components](#shimmed-components)
  - [Card](#card)
- [Contributing](#contributing)

## Before Migration

```tsx
import { Div } from "@workleap/orbiter-ui";

export function App() {
  return <Div width="100px"/>;
}
```

## After Migration

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
pnpx codemod workleap/orbiter-to-hopper
```

#### Migrate Component Categories

| Category | Description | Command | Mapping File |
|----------|-------------|---------|--------------|
| **Layout** | Layout containers, HTML wrappers, content elements (Flex, Grid, Div, Span, Article, Nav, ...) | `pnpx codemod workleap/orbiter-to-hopper -c layout` | [layout-components-mappings.ts](/src/mappings/orbiter/layout-components-mappings.ts) |
| **Buttons** | Button components and variants | `pnpx codemod workleap/orbiter-to-hopper -c buttons` | [button-components-mappings.ts](/src/mappings/orbiter/button-components-mappings.ts) |
| **Visual** | Visual elements and feedback components (Avatar, Image, Illustration, Spinner, ...) | `pnpx codemod workleap/orbiter-to-hopper -c visual` | [visual-components-mappings.ts](/src/mappings/orbiter/visual-components-mappings.ts) |
| **Menu** | Menu and navigation components (Menu, MenuItem, ListBox, ListBoxItem, ...) | `pnpx codemod workleap/orbiter-to-hopper -c menu` | [menu-components-mappings.ts](/src/mappings/orbiter/menu-components-mappings.ts) |
| **Overlay** | Overlay and dialog components (Modal, Popover, Tooltip, ...) | `pnpx codemod workleap/orbiter-to-hopper -c overlay` | [overlay-components-mappings.ts](/src/mappings/orbiter/overlay-components-mappings.ts) |
| **Tags** | Tag and labeling components (Tag, TagGroup, Lozenge, ...) | `pnpx codemod workleap/orbiter-to-hopper -c tags` | [tags-components-mappings.ts](/src/mappings/orbiter/tags-components-mappings.ts) |

#### Migrate Specific Components

Migrate a single component:

```bash
pnpx codemod workleap/orbiter-to-hopper -c Div
```

Migrate multiple specific components:

```bash
pnpx codemod workleap/orbiter-to-hopper -c Div,Text,Button
```

#### Target a Specific Path

Run the command in the desire path or pass the target path with the `-t` argument.

```bash
pnpx codemod workleap/orbiter-to-hopper -t /app/users
```

#### Additional Options

For more configuration options, refer to the [Codemod CLI options documentation](https://docs.codemod.com/deploying-codemods/cli#options).

### Migration Notes

The codemod automatically generates migration notes to help track important changes that require manual review. These notes are collected during the transformation process and aggregated into a `migration-notes.md` file.

### Analyzing Component Usage

To generate a report of Orbiter component usage patterns, use the following command:

```bash
pnpx codemod workleap/orbiter-to-hopper -a orbiter-usage.json -n 1
```

⚠️ **Important**: The `-n 1` flag limits execution to a single thread, which ensures accurate output collection.

#### Project-Specific Analysis

You can track component usage across different projects or teams using the `--project` parameter:

```bash
pnpx codemod workleap/orbiter-to-hopper -a orbiter-usage.json --project frontend-team -n 1
pnpx codemod workleap/orbiter-to-hopper -a orbiter-usage.json --project mobile-app -n 1
```

The analysis automatically accumulates results across multiple project runs, providing both project-specific counts and overall totals in the output.

#### Deep Analysis

To include detailed file location information for each property value, use the `--deep` parameter:

```bash
pnpx codemod workleap/orbiter-to-hopper -a orbiter-usage.json --deep true --project frontend-team -n 1
```

When deep analysis is enabled, each property value will include a `files` array containing repository URLs (GitHub or Azure DevOps) with line numbers where that specific value is used. For repositories that are not supported, file paths are used as fallback.

#### Specifying Mapping Table

By default, analysis is performed using Orbiter mappings. You can specify which mapping table to use with the `--mappings` parameter:

```bash
# Default (orbiter mappings)
pnpx codemod workleap/orbiter-to-hopper -a orbiter-usage.json --deep true -n 1

# Using hopper mappings
pnpx codemod workleap/orbiter-to-hopper -a hopper-usage.json --mappings hopper --deep true -n 1
```

The output file name will automatically reflect the mapping type used.

#### Filtering Analysis Results

You can filter the analysis to focus on specific areas that need attention:

**Analyze only unmapped components:**

```bash
pnpx codemod workleap/orbiter-to-hopper -a orbiter-usage-not-mapped-components.json --filter-unmapped components -n 1
```

**Analyze only unmapped properties for mapped components:**

```bash
pnpx codemod workleap/orbiter-to-hopper -a orbiter-usage-not-mapped-props.json --filter-unmapped props -n 1
```

**Include ignored properties in analysis:**

By default, the analysis excludes standard React/DOM properties like `aria-*`, `data-*`, `className`, `style`, etc. to focus on component-specific migration needs. To include these properties in the analysis, use the `--include-ignoreList` flag:

```bash
pnpx codemod workleap/orbiter-to-hopper -a orbiter-usage-complete.json --include-ignoreList -n 1
```

This can be combined with other filters for comprehensive analysis:

```bash
pnpx codemod workleap/orbiter-to-hopper -a orbiter-usage-all-unmapped.json --filter-unmapped props --include-ignoreList -n 1
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
      "usage": {
        "total": 15,
        "projects": {
          "frontend-team": 10,
          "mobile-app": 5
        }
      },
      "props": {
        "size": {
          "usage": 75,
          "values": {
            "lg": { 
              "usage": {
                "total": 50, 
                "projects": { 
                  "frontend-team": 30, 
                  "mobile-app": 20 
                }
              },
              "files": [ //if --deep true is passed
                "https://github.com/myorg/myrepo/blob/main/src/components/Header.tsx#L15",
                "https://dev.azure.com/myorg/myproject/_git/myrepo?path=%2Fsrc%2Fcomponents%2FHero.tsx&version=GBmain&line=23",
                "/src/pages/Dashboard.tsx"] 
            },
            "md": { 
              "usage": {
                "total": 25, 
                "projects": { 
                  "frontend-team": 15, 
                  "mobile-app": 10 
                }
              }
            }
          }
        }
      }
    },
    "Div": {
      "usage": {
        "total": 5,
        "projects": {
          "frontend-team": 3,
          "mobile-app": 2
        }
      },
      ...
    }
  }
}
```

## Allowed Parameters

| Parameter                  | Description                                                                         | Example                           |
| -------------------------- | ----------------------------------------------------------------------------------- | --------------------------------- |
| `-a <filename>`            | Output analysis results to a JSON file                                              | `-a orbiter-usage.json`           |
| `-c <components>`          | Specify which components to migrate (`all`, category name, or comma-separated list) | `-c layout`, `-c Div,Text,Button` |
| `-t <path>`                | Target path for migration (use current directory if not specified)                  | `-t /app/users`                   |
| `--project <name>`         | Track usage by project/team (accumulates across runs)                               | `--project frontend-team`         |
| `--deep true`              | Include file paths for each property value                                          | `--deep true`                     |
| `--filter-unmapped <type>` | Filter to show only unmapped items (`components` or `props`)                        | `--filter-unmapped props`         |
| `--include-ignoreList`     | Include ignored properties (aria-*, data-*, etc.) in analysis                       | `--include-ignoreList`            |
| `--mappings <type>`        | Specify which mapping to use for analysis or migration (`orbiter` or `hopper`)      | `--mappings hopper`               |
| `-n 1`                     | Use single thread for accurate output collection                                    | `-n 1`                            |

**⚠️ Important Notes:**

- Always use `-n 1` when generating analysis output to ensure accuracy
- Project-specific analysis accumulates results across multiple runs
- Deep analysis provides detailed file location tracking but may increase processing time
- Results are automatically sorted by usage frequency (most used first)

## Shimmed components

Shimmed components are compatibility layers that bridge the gap between Orbiter and Hopper component implementations.
They're designed to ease the migration process by preserving the expected behavior and API of Orbiter components while using Hopper's underlying implementation.

When a component's implementation differs significantly between the two design systems, a shim can provide a transitional solution that:

- Maintains backward compatibility with existing Orbiter component usage patterns
- Preserves complex layout structures and child component relationships
- Handles prop transformations that can't be handled by simple one-to-one mappings
- Reduces the need for extensive manual refactoring

Shims are particularly useful for complex components where the mental model or component architecture has changed between design systems.
They allow you to migrate your codebase incrementally while maintaining functionality.

### Card

Orbiter previously implemented a Card component that handled layout and styling for its children (e.g., Image, Illustration, Heading, Header, Content, Button, ButtonGroup). Hopper’s Card, in contrast, is a simpler styled div.

This shim bridges the gap between the two implementations, making Hopper’s Card behave like Orbiter’s. It’s intended to ease the migration process by preserving the expected structure and usage from Orbiter.

- [Hopper's Card](https://hopper.workleap.design/components/Card)
- [Orbiter's Card](https://wl-orbiter-website.netlify.app/?path=/docs/card--docs)

See the [implementation](src/shims/OrbiterCard.tsx)
See the [Stackblitz](https://stackblitz.com/edit/hopper-sandbox-qs8euohl?file=src%2FOrbiterCard.tsx) for examples.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines on how to contribute to this project.
