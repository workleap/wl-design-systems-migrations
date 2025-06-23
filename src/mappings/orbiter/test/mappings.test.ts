import * as fs from "fs";
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "vitest";
import { migrate } from "../../../migrations/migrate.ts";
import { getRuntime } from "../../../utils/test.ts";

test.only("migrates input.tsx to match expected output.tsx and generates migration notes", async () => {
  // Read the input and expected output files
  const INPUT = readFileSync(new URL("./mocks/input.tsx", import.meta.url), "utf8");
  const EXPECTED_OUTPUT = readFileSync(
    new URL("./mocks/output.tsx", import.meta.url),
    "utf8"
  );

  // Get runtime and override the migration notes manager
  const runtime = getRuntime(INPUT);
  const actualOutput = migrate(runtime);

  // Test the code transformation
  assert.deepEqual(
    actualOutput,
    EXPECTED_OUTPUT.replace("// prettier-ignore\n", "")
  );

  // Wait a bit for the async migration notes generation to complete
  await new Promise(resolve => setTimeout(resolve, 100));
 
  const actualNotes = fs.readFileSync(runtime.getMigrationNotesManager().getOutputFilePath(), "utf-8");
  const expectedNotes = fs.readFileSync(new URL("./mocks/migration-notes-expected.md", import.meta.url), "utf-8");

  assert.deepEqual(actualNotes.trim(), expectedNotes.replace("<!-- markdownlint-disable -->", "").trim());
}, 10000);
