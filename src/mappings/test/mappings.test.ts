import assert from "node:assert";
import { readFileSync } from "node:fs";
import { test } from "vitest";
import { migrate } from "../../migrations/migrate.ts";
import { getRuntime } from "../../utils/test.ts";

test("migrates input.tsx to match expected output.tsx", () => {
  // Read the input and expected output files
  const INPUT = readFileSync(new URL("./mocks/input.tsx", import.meta.url), "utf8");
  const EXPECTED_OUTPUT = readFileSync(
    new URL("./mocks/output.tsx", import.meta.url),
    "utf8"
  );

  const actualOutput = migrate(getRuntime(INPUT));

  assert.deepEqual(
    actualOutput,
    EXPECTED_OUTPUT.replace("// prettier-ignore\n", "")
  );
});
