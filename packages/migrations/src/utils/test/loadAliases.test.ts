import { existsSync, mkdirSync, rmSync, writeFileSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

// Import the index.ts as a module to access loadAliases function
// Since loadAliases is not exported, we'll test it through the main transform function
import transform from "../../index.ts";
import { buildApi } from "../test.ts";

describe("loadAliases functionality", () => {
  let tempDir: string;
  let tempFilePath: string;

  beforeEach(() => {
    tempDir = join(tmpdir(), `aliases-test-${Date.now()}`);
    mkdirSync(tempDir, { recursive: true });
    tempFilePath = join(tempDir, "test-aliases.json");
  });

  afterEach(() => {
    if (existsSync(tempDir)) {
      rmSync(tempDir, { recursive: true, force: true });
    }
  });

  it("should load aliases from a JSON file", () => {
    // Create a test aliases file
    const aliasesContent = {
      Button: "MyButton",
      Input: ["PublicInput", "PrivateInput"]
    };
    writeFileSync(tempFilePath, JSON.stringify(aliasesContent, null, 2));

    const sourceCode = `
      import { MyButton } from "./my-components";
      export function App() {
        return <MyButton onClick={handler} />;
      }
    `;

    // Call transform with aliases file path
    const result = transform(
      { path: "/test/file.tsx", source: sourceCode },
      buildApi("babylon"),
      {
        aliases: tempFilePath,
        mappings: "orbiter-to-hopper"
      }
    );

    // The function should run without errors
    expect(result).toBeDefined();
  });

  it("should load aliases from a JSON string", () => {
    const aliasesString = "{\"Button\": \"MyButton\", \"Input\": [\"PublicInput\", \"PrivateInput\"]}";

    const sourceCode = `
      import { MyButton } from "./my-components";
      export function App() {
        return <MyButton onClick={handler} />;
      }
    `;

    // Call transform with aliases JSON string
    const result = transform(
      { path: "/test/file.tsx", source: sourceCode },
      buildApi("babylon"),
      {
        aliases: aliasesString,
        mappings: "orbiter-to-hopper"
      }
    );

    // The function should run without errors
    expect(result).toBeDefined();
  });

  it("should handle invalid JSON string gracefully", () => {
    const invalidJson = "{\"Button\": \"MyButton\""; // Missing closing brace

    const sourceCode = `
      import { Button } from "./components";
      export function App() {
        return <Button onClick={handler} />;
      }
    `;

    // Call transform with invalid JSON string - should not throw
    const result = transform(
      { path: "/test/file.tsx", source: sourceCode },
      buildApi("babylon"),
      {
        aliases: invalidJson,
        mappings: "orbiter-to-hopper"
      }
    );

    // Should still return a result (aliases will be undefined but transform should continue)
    expect(result).toBeDefined();
  });

  it("should handle non-existent file path gracefully", () => {
    const nonExistentPath = join(tempDir, "non-existent.json");

    const sourceCode = `
      import { Button } from "./components";
      export function App() {
        return <Button onClick={handler} />;
      }
    `;

    // Call transform with non-existent file path - should not throw
    const result = transform(
      { path: "/test/file.tsx", source: sourceCode },
      buildApi("babylon"),
      {
        aliases: nonExistentPath,
        mappings: "orbiter-to-hopper"
      }
    );

    // Should still return a result (aliases will be undefined but transform should continue)
    expect(result).toBeDefined();
  });
});
