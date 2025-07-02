# Workleap Design Systems Migrations CLI

A command-line tool for running Workleap design system migration codemods. This tool automatically clones the latest migration repository and applies codemods to your project.

## Installation

You can run this tool directly using `npx` without installing it globally:

```bash
npx @workleap/design-systems-migrations-cli ./src
```

Or install it globally:

```bash
npm install -g @workleap/design-systems-migrations-cli
```

## Usage

```bash
workleap-migrations <target> [options]
```

### Arguments

- `<target>` - Target directory or file to transform

### Options

- `-m, --mappings <type>` - Which mappings table to use (`orbiter-to-hopper`, `hopper`) (default: `orbiter-to-hopper`)
- `-c, --component <name>` - Specific component to migrate
- `--deep` - Enable deep analysis mode
- `--analysis` - Run analysis only (no transformations)
- `-d, --dry-run` - Run in dry-run mode (preview changes)
- `--no-interactive` - Run without interactive prompts
- `-V, --version` - Display version number
- `-h, --help` - Display help for command

## Examples

```bash
# Migrate entire src directory using orbiter-to-hopper mappings
workleap-migrations ./src

# Specify different mappings
workleap-migrations ./src --mappings orbiter-to-hopper

# Migrate specific component only
workleap-migrations ./src --component Button

# Preview changes without applying them
workleap-migrations ./src --component Button --dry-run

# Run deep analysis
workleap-migrations ./src --deep --analysis

# Run without interactive prompts
workleap-migrations ./src --no-interactive
```

## How It Works

1. **Clone Repository**: Downloads the latest version of the migration repository
2. **Install Dependencies**: Installs necessary dependencies in the cloned repository
3. **Run Codemod**: Executes the codemod with your specified options
4. **Cleanup**: Removes temporary files after completion

## Available Mappings

- `orbiter-to-hopper` - Migrate from Orbiter design system to Hopper
- `hopper` - Analysis only for Hopper components (no transformations)

## Requirements

- Node.js 18 or later
- pnpm (for dependency management)

## License

MIT - See LICENSE file for details.
