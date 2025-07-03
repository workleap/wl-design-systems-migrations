#!/usr/bin/env node

import chalk from "chalk";
import { execSync } from "child_process";
import { Command } from "commander";
import { existsSync, rmSync } from "fs";
import ora from "ora";
import { join, resolve } from "path";
import { cwd } from "process";
import { simpleGit } from "simple-git";
import tempDir from "temp-dir";
import packageJson from "../package.json" with { type: "json" };


const REPO_URL = "https://github.com/workleap/wl-design-systems-migrations.git";
const TEMP_REPO_DIR = join(tempDir, "workleap-migrations-temp");

interface RunOptions {
  mappings?: string;
  target: string;
  source?: string;
  component?: string;
  deep?: boolean ;
  mode: "migrate" | "analyze";
  usageReportFile: string;
  project?: string;
  filterUnmapped?: "components" | "props";
  includeIgnoreList?: boolean;
}

async function cloneRepo(): Promise<string> {
  const spinner = ora("Cloning latest migration repository...").start();
  
  try {
    // Clean up any existing temp directory
    if (existsSync(TEMP_REPO_DIR)) {
      rmSync(TEMP_REPO_DIR, { recursive: true, force: true });
    }

    const git = simpleGit();
    await git.clone(REPO_URL, TEMP_REPO_DIR, ["--depth", "1"]);
    
    spinner.succeed("Repository cloned successfully");

    return TEMP_REPO_DIR;
  } catch (error) {
    spinner.fail("Failed to clone repository");
    throw error;
  }
}

function runCommand(mode: "migrate" | "analyze", repoPath: string, targetPath: string, options: RunOptions): void {
  const spinner = ora("Running command...").start();

  //get the folder of path to the running cli script
  const cliPath = resolve(import.meta.url.replace("file:", ""), "..");

  try {
    const args: string[] = [
      "jscodeshift",
      targetPath,
      "-t", `${repoPath}/packages/migrations/src/index.ts`,
      "--parser", "babylon", // we are still trying to behave like Codemod as our mappings are basically implemented and tested by Codemod tool: https://github.com/codemod-com/codemod/blob/96305838e999f16e9eea011b01301f022a74c89a/packages/codemod-utils/src/jscodeshift/parser.ts#L59
      "--parser-config", `${cliPath}/parser-config.json`,
      "--extensions", "ts,tsx,js,jsx",
      "--ignore-pattern", "*.d.ts",
      "--ignore-pattern", "**/node_modules/**",
      "--ignore-pattern", "**/.git/**",
      "--ignore-pattern", "**/.github/**",
      "--ignore-pattern", "**/.vscode/**",
      "--ignore-pattern", "**/dist/**",
      "--ignore-pattern", "**/build/**"
      
    ];

    // Add optional arguments
    if (options.mappings) {
      args.push("--mappings", options.mappings);
    }
    
    
    if (mode === "analyze") {
      args.push("--a", options.usageReportFile);
      args.push("--deep", options.deep ? "true" : "false");
      args.push("--cpus", "1"); // Limit to 1 CPU for analysis as it uses aggregated analysis json file
    } else {
      if (options.component) {args.push("--c", options.component);}
    }

    if (options.project) {
      args.push("--project", options.project);
    }

    if (options.filterUnmapped) {
      args.push("--filter-unmapped", options.filterUnmapped);
    }

    if (options.includeIgnoreList) {
      args.push("--include-ignoreList", "true");
    }

    console.log(chalk.blue("\nRunning command:"), chalk.gray(`pnpx ${args.join(" ")}`));
    
    execSync(`pnpx ${args.join(" ")}`, { 
      cwd: process.cwd(),
      stdio: "inherit" 
    });
    
    spinner.succeed("Migration completed successfully");
  } catch (error) {
    spinner.fail("Migration execution failed");
    throw error;
  }
}

function cleanup(): void {
  if (existsSync(TEMP_REPO_DIR)) {
    rmSync(TEMP_REPO_DIR, { recursive: true, force: true });
  }
}

async function main() {
  const program = new Command();

  program
    .name("workleap-migrations")
    .description("CLI tool for running Workleap design system migrations or analyzing components")
    .version(packageJson.version)    
    .argument("[mode]", "Mode to run: 'migrate' or 'analyze'", "migrate")
    .option("-t, --target <target>", "Target directory or file to transform", process.cwd())
    .option("-s, --source [source]", "Source directory for file to transform. If not provided, it will clone the related Github repository to a temporary directory.", TEMP_REPO_DIR)
    .option("-m, --mappings <type>", "Which mappings table to use (orbiter-to-hopper, hopper)", "orbiter-to-hopper")
    .option("-c, --component <name>", "Specific component to migrate. Comma-separated list of component names, or use available categories, or use 'all' to migrate all components", "all")
    .option("--deep [deep]", "Enable deep analysis to include file information for each prop value. When enabled, adds a 'files' property containing filenames where each value is used.", false)
    .option("--project <project>", "Specify the project name for analysis")
    .option("--filter-unmapped <filter-unmapped>", "Filter analysis to show only unmapped items. Options: 'components' (unmapped components only) or 'props' (unmapped props for mapped components only).")
    .option("--include-ignoreList <include-ignoreList>", "Include ignored properties (aria-*, data-*, className, style, etc.) in analysis. By default, these properties are excluded to focus on component-specific migration needs.", false)
    .option("--usage-report-file <usage-report-file>", "File to save usage report for analysis mode. Defaults to 'usage-report.json'", "usage-report.json")
    .action(async (mode: "migrate" | "analyze", options: RunOptions) => {
      const targetPath = resolve(options.target);
 
      try {
        console.log(chalk.blue("🚀 Workleap Design System Migrations"));
        console.log(chalk.gray(`Mode: ${mode}`));
        console.log(chalk.gray(`Target: ${targetPath}`));
        console.log(chalk.gray(`Mappings: ${options.mappings}`));
        
        if (options.component) {
          console.log(chalk.gray(`Component(s): ${options.component}`));
        }

        // Clone the repository if no source is provided
        const repoPath = options.source ? join(cwd(), options.source) : await cloneRepo();

        // Run the migration
        runCommand(mode, repoPath, targetPath, options);

        console.log(chalk.green("\n✅ Migration completed successfully!"));
      } catch (error) {
        console.error(chalk.red("\n❌ Migration failed:"));
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
      } finally {
        // Clean up temporary files
        cleanup();
      }
    });

  // Add help examples
  program.addHelpText("after", `
Examples:
  $ workleap-migrations
  $ workleap-migrations --mappings orbiter-to-hopper
  $ workleap-migrations --component Button
  $ workleap-migrations analyze --deep true
`);

  await program.parseAsync();
}

// Handle process termination
process.on("SIGINT", () => {
  console.log(chalk.yellow("\n🛑 Process interrupted, cleaning up..."));
  cleanup();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log(chalk.yellow("\n🛑 Process terminated, cleaning up..."));
  cleanup();
  process.exit(0);
});

main().catch(error => {
  console.error(chalk.red("Unexpected error:"), error);
  cleanup();
  process.exit(1);
});
