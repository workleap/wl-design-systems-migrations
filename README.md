# Design System Migration Codemod <!-- omit in toc -->

This codemod automates the migration of components between design systems. Currently supports migration from [Orbiter](https://github.com/workleap/wl-orbiter) to [Hopper](https://github.com/workleap/wl-hopper), with extensible architecture for other design system migrations.

**Key Features:**

- ✅ **Automated component migrations** - Updates import statements and component names
- ✅ **Property transformations** - Maps old properties to new equivalents
- ✅ **Migration analysis** - Generates usage reports and migration guidance
- ✅ **Extensible mappings** - Support for multiple design system migrations

## Table of contents <!-- omit in toc -->

- [Quick Start](#quick-start)
  - [Orbiter to Hopper Migration Example](#orbiter-to-hopper-migration-example)
- [Usage Examples](#usage-examples)
  - [Migrate All Components](#migrate-all-components)
  - [Migrate by Category](#migrate-by-category)
  - [Migrate Specific Components](#migrate-specific-components)
  - [Target Specific Path](#target-specific-path)
- [Usage Analysis](#usage-analysis)
- [Contributing](#contributing)

## Quick Start

### Orbiter to Hopper Migration Example

Before:

```tsx
import { Div } from "@workleap/orbiter-ui";

export function App() {
  return <Div width="100px"/>;
}
```

After:

```tsx
import { Div } from "@hopper-ui/components";

export function App() {
  return <Div UNSAFE_width="100px"/>;
}
```

## Usage Examples

The default mapping table is set. for Orbiter to Hopper. If you want to run it for other mappings, you need to set it through the `mappings` parameter.

### Migrate All Components

```bash
pnpx codemod workleap/migrations
```

### Migrate by Category

```bash
# Migrate layout components (Flex, Grid, Div, etc.)
pnpx codemod workleap/migrations -c layout

# Migrate button components
pnpx codemod workleap/migrations -c buttons

# Other categories: visual, menu, overlay, tags, disclosure
```

### Migrate Specific Components

```bash
# Single component
pnpx codemod workleap/migrations -c Div

# Multiple components
pnpx codemod workleap/migrations -c Div,Text,Button
```

### Target Specific Path

Run the command in the desire path or pass the target path with the `-t` argument.

```bash
pnpx codemod workleap/migrations -t /app/users
```

## Usage Analysis

Generate usage reports to understand your migration scope:

```bash
# Basic analysis
pnpx codemod workleap/migrations -a usage-report.json -n 1

# Detailed analysis with file locations
pnpx codemod workleap/migrations -a usage-report.json --deep true -n 1

# Project-specific analysis
pnpx codemod workleap/migrations -a usage-report.json --project frontend-team -n 1

# Using hopper mappings for analysis
pnpx codemod workleap/migrations -a hopper-usage.json --mappings hopper -n 1

# Analyze unmapped components only
pnpx codemod workleap/migrations -a unmapped-components.json --filter-unmapped components -n 1
```

**Key Parameters:**

| Parameter | Description | Example |
|-----------|-------------|---------|
| `-a <filename>` | Output analysis to JSON file | `-a usage-report.json` |
| `-c <components>` | Specify components to migrate | `-c layout` or `-c Div,Text` |
| `-t <path>` | Target specific path | `-t /app/users` |
| `--project <name>` | Track usage by project/team. It is pretty usefule when you analysis multiple repos and want to aggregate analysis results. | `--project frontend-team` |
| `--mappings <type>` | Specify mapping table (`orbiter-to-hopper` (default) or `hopper`) | `--mappings hopper` |
| `--deep true` | Include file locations | `--deep true` |
| `--filter-unmapped <type>` | Show only unmapped items | `--filter-unmapped props` |
| `-n 1` | Use single thread (required for analysis) | `-n 1` |

**Sample Analysis Output:**

```json
{
  "overall": {
    "usage": {
      "components": 15,
      "componentProps": 45,
      "functions": 3,
      "types": 8
    }
  },
  "components": {
    "Text": {
      "usage": {
        "total": 25,
        "projects": {
          "frontend-team": 15,
          "mobile-app": 10
        }
      },
      "props": {
        "size": {
          "usage": 20,
          "values": {
            "lg": { "usage": { "total": 12 } },
            "md": { "usage": { "total": 8 } }
          }
        }
      }
    },
    "Button": {
      "usage": {
        "total": 18,
        "projects": { "frontend-team": 18 }
      }
    }
  },
  "functions": {
    "useResponsive": {
      "usage": {
        "total": 8,
        "projects": {
          "frontend-team": 5,
          "mobile-app": 3
        }
      },
      "values": {
        "useResponsive()": {
          "usage": { "total": 8 }
        }
      }
    }
  },
  "types": {
    "ComponentProps": {
      "usage": {
        "total": 12,
        "projects": {
          "frontend-team": 8,
          "mobile-app": 4
        }
      }
    }
  }
}
```

## Contributing

To add support for other design system migrations or contribute to existing ones, see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.
