#!/usr/bin/env node

import chalk from "chalk";
import { execSync } from "child_process";
import { Command } from "commander";
import { existsSync, rmSync } from "fs";
import { createRequire } from "module";
import ora from "ora";
import { join, resolve } from "path";
import { simpleGit } from "simple-git";
import tempDir from "temp-dir";

const require = createRequire(import.meta.url);
const packageJson = require("../package.json");

const REPO_URL = "https://github.com/workleap/wl-design-systems-migrations.git";
const TEMP_REPO_DIR = join(tempDir, "workleap-migrations-temp");

interface RunOptions {
  mappings?: string;
  component?: string;
  deep?: boolean;
  analysis?: boolean;
  dryRun?: boolean;
  interactive?: boolean;
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

function installDependencies(repoPath: string): void {
  const spinner = ora("Installing dependencies...").start();
  
  try {
    execSync("pnpm install", { 
      cwd: repoPath, 
      stdio: "pipe" 
    });
    spinner.succeed("Dependencies installed");
  } catch (error) {
    spinner.fail("Failed to install dependencies");
    throw error;
  }
}

function runCodemod(repoPath: string, targetPath: string, options: RunOptions): void {
  const spinner = ora("Running codemod...").start();
  
  try {
    const args: string[] = [
      "codemod",
      "--source", repoPath,
      "-t", targetPath
    ];

    // Add optional arguments
    if (options.mappings) {
      args.push("--mappings", options.mappings);
    }
    
    if (options.component) {
      args.push("-c", options.component);
    }
    
    if (options.deep) {
      args.push("--deep", "true");
    }
    
    if (options.analysis) {
      args.push("--analysis", "true");
    }
    
    if (options.dryRun) {
      args.push("-d");
    }
    
    if (options.interactive === false) {
      args.push("--no-interactive");
    }

    console.log(chalk.blue("\nRunning command:"), chalk.gray(`pnpx ${args.join(" ")}`));
    
    execSync(`pnpx ${args.join(" ")}`, { 
      cwd: process.cwd(),
      stdio: "inherit" 
    });
    
    spinner.succeed("Codemod completed successfully");
  } catch (error) {
    spinner.fail("Codemod execution failed");
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
    .description("CLI tool for running Workleap design system migration codemods")
    .version(packageJson.version)
    .argument("<target>", "Target directory or file to transform")
    .option("-m, --mappings <type>", "Which mappings table to use (orbiter-to-hopper, hopper)", "orbiter-to-hopper")
    .option("-c, --component <name>", "Specific component to migrate")
    .option("--deep", "Enable deep analysis mode")
    .option("--analysis", "Run analysis only (no transformations)")
    .option("-d, --dry-run", "Run in dry-run mode (preview changes)")
    .option("--no-interactive", "Run without interactive prompts")
    .action(async (target: string, options: RunOptions) => {
      const targetPath = resolve(target);
      
      if (!existsSync(targetPath)) {
        console.error(chalk.red(`Error: Target path "${targetPath}" does not exist`));
        process.exit(1);
      }

      try {
        console.log(chalk.blue("🚀 Workleap Design System Migrations"));
        console.log(chalk.gray(`Target: ${targetPath}`));
        console.log(chalk.gray(`Mappings: ${options.mappings}`));
        
        if (options.component) {
          console.log(chalk.gray(`Component: ${options.component}`));
        }
        
        console.log("");

        // Clone the repository
        const repoPath = await cloneRepo();

        // Install dependencies
        installDependencies(repoPath);

        // Run the codemod
        runCodemod(repoPath, targetPath, options);

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
  $ workleap-migrations ./src
  $ workleap-migrations ./src --mappings orbiter-to-hopper
  $ workleap-migrations ./src --component Button --dry-run
  $ workleap-migrations ./src --deep --analysis
  $ workleap-migrations ./src --no-interactive
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
