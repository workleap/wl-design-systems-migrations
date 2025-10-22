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
  - [Component Aliases](#component-aliases)
- [Usage Analysis](#usage-analysis)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## Quick Start

### Using the CLI (Recommended)

The easiest way to run migrations is using our CLI tool:

```bash
# Run directly with pnpx (no installation required)
pnpx "@workleap/migrations"@latest
```

The CLI automatically:

- Clones the latest migration repository
- Runs the migrations with your specified options
- Cleans up temporary files

For more CLI options:

```bash
pnpx "@workleap/migrations"@latest --help
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
pnpx "@workleap/migrations"@latest
```

### Migrate by Category

```bash
# Migrate layout components (Flex, Grid, Div, etc.)
pnpx "@workleap/migrations"@latest -c layout

# Migrate button components
pnpx "@workleap/migrations"@latest -c buttons

# Other categories: visual, menu, overlay, tags, disclosure
```

### Migrate Specific Components

```bash
# Single component
pnpx "@workleap/migrations"@latest -c Div

# Multiple components
pnpx "@workleap/migrations"@latest -c Div,Text,Button
```

### Target Specific Path

Run the command in the desire path or pass the target path with the `-t` argument.

```bash
pnpx "@workleap/migrations"@latest -t /app/users
```

### Component Aliases

Handle custom component names that should be treated as specific design system components for migration. Aliases maintain their original imports while migrating their props according to the component mapping.

#### Using a JSON file

Create an aliases configuration file:

```json
{
  "Button": "PublicButton",
  "Div": ["InfoCard", "WarningCard", "PrivateAlert"]
}
```

Run migrations with aliases file:

```bash
pnpx "@workleap/migrations"@latest --aliases aliases.json
```

#### Using inline JSON string

Pass aliases directly as a JSON string:

```bash
# Single alias
pnpx "@workleap/migrations"@latest --aliases '{"Button": "MyButton"}'

# Multiple aliases
pnpx "@workleap/migrations"@latest --aliases '{"Button": ["PublicButton", "PrivateButton"], "Div": "CustomDiv"}'
```

**Example transformation:**

Before:

```tsx
import { PublicButton } from "./components";

export function App() {
  return <PublicButton width="120px" onClick={callback} />;
}
```

After:

```tsx
import { PublicButton } from "./components"; // Import unchanged

export function App() {
  return <PublicButton UNSAFE_width="120px" onPress={callback} />; // Props migrated
}
```

## Usage Analysis

Generate usage reports to understand your migration scope:

```bash
# Basic analysis
pnpx "@workleap/migrations"@latest analyze 

# Detailed analysis with file locations
pnpx "@workleap/migrations"@latest analyze --deep true

# Project-specific analysis
pnpx "@workleap/migrations"@latest analyze --project frontend-team

# Using hopper mappings for analysis
pnpx "@workleap/migrations"@latest analyze --mappings hopper

# Analyze unmapped components only
pnpx "@workleap/migrations"@latest analyze --filter-unmapped components
```

**Key Parameters:**

| Parameter | Description | Example |
|-----------|-------------|---------|
| `-c <components>` | Specify components to migrate | `-c layout` or `-c Div,Text` |
| `-t <path>` | Target specific path | `-t /app/users` |
| `--aliases <path>` | Path to JSON file containing component aliases mapping | `--aliases aliases.json` |
| `--project <name>` | Track usage by project/team. It is pretty useful when you analysis multiple repos and want to aggregate analysis results. | `--project frontend-team` |
| `--mappings <type>` | Specify mapping table (`orbiter-to-hopper` (default) or `hopper`) | `--mappings hopper` |
| `--deep true` | Include file locations | `--deep true` |
| `--filter-unmapped <type>` | Show only unmapped items | `--filter-unmapped props` |
| `--usage-report-file <file>` | File to save usage report for analysis mode (defaults to `usage-report.json`) | `--usage-report-file custom-report.json` |
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

## Troubleshooting

### Node.js Version Issues

If you encounter this error:

```text
Error [ERR_REQUIRE_ESM]: require() of ES Module
```

You need to update your Node.js version to **v24.0.0** or later. This error occurs when using an incompatible Node.js version with ES modules.

To update Node.js:

```bash
# Using nvm (recommended)
nvm install 24
nvm use 24

# Or download from nodejs.org
# https://nodejs.org/
```

## Contributing

To add support for other design system migrations or contribute to existing ones, see [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.
