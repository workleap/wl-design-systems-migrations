import assert from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "vitest";
import { migrate } from "../src/migrations/migrate.ts";
import { getRuntime } from "./utils.ts";

test("migrates input.tsx to match expected output.tsx", () => {
  // Read the input and expected output files
  const INPUT = readFileSync(new URL("input.tsx", import.meta.url), "utf8");
  const EXPECTED_OUTPUT = readFileSync(
    new URL("output.tsx", import.meta.url),
    "utf8"
  );

  const actualOutput = migrate(getRuntime(INPUT));

  assert.deepEqual(
    actualOutput,
    EXPECTED_OUTPUT.replace("// prettier-ignore\n", "")
  );
});
