# Design Systems Migrations Tools <!-- omit in toc -->

This tool automates the migration of components between design systems. Currently supports migration from [Orbiter](https://github.com/workleap/wl-orbiter) to [Hopper](https://github.com/workleap/wl-hopper), with extensible architecture for other design system migrations.

**Key Features:**

- ✅ **Automated component migrations** - Updates import statements and component names
- ✅ **Property transformations** - Maps old properties to new equivalents
- ✅ **Migration analysis** - Generates usage reports and migration guidance
- ✅ **Extensible mappings** - Support for multiple design system migrations

## Table of contents <!-- omit in toc -->

- [Quick Start](#quick-start)
  - [Using the CLI (Recommended)](#using-the-cli-recommended)
  - [Orbiter to Hopper Migration Example](#orbiter-to-hopper-migration-example)
- [Usage Examples](#usage-examples)
  - [Migrate All Components](#migrate-all-components)
  - [Migrate by Category](#migrate-by-category)
  - [Migrate Specific Components](#migrate-specific-components)
  - [Target Specific Path](#target-specific-path)
- [Usage Analysis](#usage-analysis)
- [Contributing](#contributing)

## Quick Start

### Using the CLI (Recommended)

The easiest way to run migrations is using our CLI tool:

```bash
# Run directly with pnpx (no installation required)
pnpx @workleap/migrations
```

The CLI automatically:

- Clones the latest migration repository
- Runs the migrations with your specified options
- Cleans up temporary files

For more CLI options:

```bash
pnpx @workleap/migrations --help
```

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

The default mapping table is set for Orbiter to Hopper. If you want to run it for other mappings, you need to set it through the `mappings` parameter.  

### Migrate All Components

```bash
pnpx @workleap/migrations
```

### Migrate by Category

```bash
# Migrate layout components (Flex, Grid, Div, etc.)
pnpx @workleap/migrations -c layout

# Migrate button components
pnpx @workleap/migrations -c buttons

# Other categories: visual, menu, overlay, tags, disclosure
```

### Migrate Specific Components

```bash
# Single component
pnpx @workleap/migrations -c Div

# Multiple components
pnpx @workleap/migrations -c Div,Text,Button
```

### Target Specific Path

Run the command in the desire path or pass the target path with the `-t` argument.

```bash
pnpx @workleap/migrations -t /app/users
```

## Usage Analysis

Generate usage reports to understand your migration scope:

```bash
# Basic analysis
pnpx @workleap/migrations analyze 

# Detailed analysis with file locations
pnpx @workleap/migrations analyze --deep true

# Project-specific analysis
pnpx @workleap/migrations analyze --project frontend-team

# Using hopper mappings for analysis
pnpx @workleap/migrations analyze --mappings hopper

# Analyze unmapped components only
pnpx @workleap/migrations analyze --filter-unmapped components
```

**Key Parameters:**

| Parameter | Description | Example |
|-----------|-------------|---------|
| `-c <components>` | Specify components to migrate | `-c layout` or `-c Div,Text` |
| `-t <path>` | Target specific path | `-t /app/users` |
| `--project <name>` | Track usage by project/team. It is pretty useful when you analysis multiple repos and want to aggregate analysis results. | `--project frontend-team` |
| `--mappings <type>` | Specify mapping table (`orbiter-to-hopper` (default) or `hopper`) | `--mappings hopper` |
| `--deep true` | Include file locations | `--deep true` |
| `--filter-unmapped <type>` | Show only unmapped items | `--filter-unmapped props` |
| `analyze` | Pass it as first argument to analyze. Otherwise, it runs migrations | `N/A` |

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
