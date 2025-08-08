import { describe, expect, it } from "vitest";
import { getRuntime } from "../../utils/test.ts";
import type { Runtime } from "../../utils/types.ts";
import { migrate } from "../migrate.ts";

// Helper function to create runtime with aliases
function createRuntimeWithAliases(
  sourceCode: string,
  aliases?: Record<string, string | string[]>
): Runtime {
  const runtime = getRuntime(sourceCode);
  if (aliases) {
    runtime.aliases = aliases;
  }

  return runtime;
}

describe("migrateAliases", () => {
  it("should migrate alias components without changing imports", () => {
    const sourceCode = `
      import { PublicButton } from "./public";

      export function App() {
        return <PublicButton width="120px" rowGap="0" onClick={callback} />;
      }
    `;

    const runtime = createRuntimeWithAliases(sourceCode, {
      Button: "PublicButton"
    });

    // Use migrate function with Button component option
    const result = migrate(runtime);

    expect(result).toBeDefined();
    // Component name should remain unchanged (PublicButton)
    expect(result!).toContain("PublicButton");
    // Import should remain unchanged
    expect(result!).toContain("import { PublicButton } from \"./public\"");
    // Props should be migrated based on Button mapping
    expect(result!).toContain("UNSAFE_width");
    expect(result!).toContain("rowGap=\"core_0\"");
    expect(result!).toContain("onPress=");
  });

  it("should handle multiple aliases for the same component", () => {
    const sourceCode = `
      import { PublicButton, PrivateButton } from "./buttons";

      export function App() {
        return (
          <>
            <PublicButton onClick={callback} />
            <PrivateButton onClick={handler} />
          </>
        );
      }
    `;

    const runtime = createRuntimeWithAliases(sourceCode, {
      Button: ["PublicButton", "PrivateButton"]
    });

    // Use migrate function with Button component option
    const result = migrate(runtime);

    expect(result).toBeDefined();
    // Component names should remain unchanged
    expect(result!).toContain("PublicButton");
    expect(result!).toContain("PrivateButton");
    // Import should remain unchanged
    expect(result!).toContain("import { PublicButton, PrivateButton } from \"./buttons\"");
    // Props should be migrated based on Button mapping (onClick maps to onPress)
    expect(result!).toContain("onPress={callback}");
    expect(result!).toContain("onPress={handler}");
  });

  it("should handle array of component names", () => {
    const sourceCode = `
      import { OfferBox, InfoCard, WarningCard } from "./cards";

      export function App() {
        return (
          <>
            <OfferBox width="100px" />
            <InfoCard height="200px" />
            <WarningCard margin="10px" />
          </>
        );
      }
    `;

    const runtime = createRuntimeWithAliases(sourceCode, {
      Div: ["OfferBox", "InfoCard", "WarningCard"]
    });

    // Use migrate function with Div component option
    const result = migrate(runtime);

    expect(result).toBeDefined();
    // Component names should remain unchanged
    expect(result!).toContain("OfferBox");
    expect(result!).toContain("InfoCard");
    expect(result!).toContain("WarningCard");
    // Import should remain unchanged
    expect(result!).toContain("import { OfferBox, InfoCard, WarningCard } from \"./cards\"");
  });

  it("should do nothing when no aliases are provided", () => {
    const sourceCode = `import { Button } from "@hopper-ui/components";

export function App() {
  return <Button onClick={callback} />;
}`;

    const runtime = createRuntimeWithAliases(sourceCode);

    // Use migrate function with Button component option - but no aliases are provided
    const result = migrate(runtime);

    // Should remain unchanged since no aliases and no Button imports from the source package
    expect(result).toBe(sourceCode);
  });

  it("should preserve local component names that aren't in aliases", () => {
    const sourceCode = `
      import { PublicButton, RegularButton } from "./buttons";

      export function App() {
        return (
          <>
            <PublicButton width="120px" />
            <RegularButton width="120px" />
          </>
        );
      }
    `;

    const runtime = createRuntimeWithAliases(sourceCode, {
      Button: "PublicButton"
    });

    // Use migrate function with Button component option - should only affect PublicButton (which is an alias)
    const result = migrate(runtime);

    expect(result).toBeDefined();
    // PublicButton should be migrated as an alias
    expect(result!).toContain("UNSAFE_width");
    // RegularButton should remain unchanged (not in aliases)
    expect(result!.match(/RegularButton width="120px"/)).toBeTruthy();
  });

  it("should migrate aliases with local names too", () => {
    const INPUT = `
      import { PublicButton, PrivateButton as PB, PrivateButton } from "./buttons";

      export function App() {
        return (
          <>
            <PublicButton width="120px" />
            <PrivateButton width="120px" />
            <PB width="120px" />
          </>
        );
      }
    `;

    const OUTPUT = `
      import { PublicButton, PrivateButton as PB, PrivateButton } from "./buttons";

      export function App() {
        return (
          <>
            <PublicButton UNSAFE_width="120px" />
            <PrivateButton UNSAFE_width="120px" />
            <PB UNSAFE_width="120px" />
          </>
        );
      }
    `;

    const runtime = createRuntimeWithAliases(INPUT, {
      Button: ["PublicButton", "PrivateButton"]
    });

    const actualOutput = migrate(runtime);

    expect(actualOutput).toEqual(OUTPUT);
  });
});
