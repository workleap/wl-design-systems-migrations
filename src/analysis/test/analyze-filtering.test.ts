import assert from "node:assert";
import { describe, test } from "vitest";
import { getRuntime } from "../../utils/test.ts";
import { analyze } from "../analyze.ts";

describe("analyze - property filtering", () => {
  test("excludes aria-* attributes by default", () => {
    const INPUT = `
    import { Stack } from "@workleap/orbiter-ui";
    
    export function MyComponent() {
      return (
        <Stack 
          direction="row" 
          aria-label="Navigation"
          aria-hidden="true"
          aria-describedby="description"
          customProp="value"
        />
      ); 
    }`;

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    assert.ok(
      analysisResults.components.Stack,
      "Stack should be present in results"
    );
    const stackProps = Object.keys(analysisResults.components.Stack.props);

    // Should include regular props
    assert.ok(stackProps.includes("direction"), "direction should be present");
    assert.ok(
      stackProps.includes("customProp"),
      "customProp should be present"
    );

    // Should exclude aria-* attributes
    assert.ok(
      !stackProps.includes("aria-label"),
      "aria-label should be excluded"
    );
    assert.ok(
      !stackProps.includes("aria-hidden"),
      "aria-hidden should be excluded"
    );
    assert.ok(
      !stackProps.includes("aria-describedby"),
      "aria-describedby should be excluded"
    );
  });

  test("excludes data-* attributes by default", () => {
    const INPUT = `
    import { Stack } from "@workleap/orbiter-ui";
    
    export function MyComponent() {
      return (
        <Stack 
          direction="row" 
          data-testid="my-stack"
          data-custom="value"
          data-public="true"
          customProp="value"
        />
      ); 
    }`;

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    assert.ok(
      analysisResults.components.Stack,
      "Stack should be present in results"
    );
    const stackProps = Object.keys(analysisResults.components.Stack.props);

    // Should include regular props
    assert.ok(stackProps.includes("direction"), "direction should be present");
    assert.ok(
      stackProps.includes("customProp"),
      "customProp should be present"
    );

    // Should exclude data-* attributes
    assert.ok(
      !stackProps.includes("data-testid"),
      "data-testid should be excluded"
    );
    assert.ok(
      !stackProps.includes("data-custom"),
      "data-custom should be excluded"
    );
    assert.ok(
      !stackProps.includes("data-public"),
      "data-public should be excluded"
    );
  });

  test("excludes known ignored props by default", () => {
    const INPUT = `
    import { Stack } from "@workleap/orbiter-ui";
    
    export function MyComponent() {
      return (
        <Stack 
          direction="row" 
          className="my-class"
          style={{color: 'red'}}
          id="my-id"
          key="my-key"
          ref={myRef}
          role="button"
          slot="content"
          customProp="value"
        />
      ); 
    }`;

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    assert.ok(
      analysisResults.components.Stack,
      "Stack should be present in results"
    );
    const stackProps = Object.keys(analysisResults.components.Stack.props);

    // Should include regular props
    assert.ok(stackProps.includes("direction"), "direction should be present");
    assert.ok(
      stackProps.includes("customProp"),
      "customProp should be present"
    );

    // Should exclude known ignored props
    assert.ok(
      !stackProps.includes("className"),
      "className should be excluded"
    );
    assert.ok(!stackProps.includes("style"), "style should be excluded");
    assert.ok(!stackProps.includes("id"), "id should be excluded");
    assert.ok(!stackProps.includes("key"), "key should be excluded");
    assert.ok(!stackProps.includes("ref"), "ref should be excluded");
    assert.ok(!stackProps.includes("role"), "role should be excluded");
    assert.ok(!stackProps.includes("slot"), "slot should be excluded");
  });

  test("includes all props when --include-ignoreList is true", () => {
    const INPUT = `
    import { Stack } from "@workleap/orbiter-ui";
    
    export function MyComponent() {
      return (
        <Stack 
          direction="row" 
          aria-label="Navigation"
          data-testid="my-stack"
          className="my-class"
          customProp="value"
        />
      ); 
    }`;

    const { analysisResults } = analyze(getRuntime(INPUT), null, {
      "include-ignoreList": true
    });

    assert.ok(
      analysisResults.components.Stack,
      "Stack should be present in results"
    );
    const stackProps = Object.keys(analysisResults.components.Stack.props);

    // Should include all props when include-ignoreList is true
    assert.ok(stackProps.includes("direction"), "direction should be present");
    assert.ok(
      stackProps.includes("customProp"),
      "customProp should be present"
    );
    assert.ok(
      stackProps.includes("aria-label"),
      "aria-label should be included"
    );
    assert.ok(
      stackProps.includes("data-testid"),
      "data-testid should be included"
    );
    assert.ok(stackProps.includes("className"), "className should be included");
  });

  test("combines ignore filtering with filter-unmapped props", () => {
    const INPUT = `
    import { Stack } from "@workleap/orbiter-ui";
    
    export function MyComponent() {
      return (
        <Stack 
          direction="row"
          gap="16px"
          aria-label="Navigation"
          data-testid="my-stack"
          className="my-class"
          unmappedProp="value"
        />
      ); 
    }`;

    const { analysisResults } = analyze(getRuntime(INPUT), null, {
      "filter-unmapped": "props"
    });

    assert.ok(
      analysisResults.components.Stack,
      "Stack should be present in results"
    );
    const stackProps = Object.keys(analysisResults.components.Stack.props);

    // Should only include unmapped props that are also not in ignore list
    assert.ok(
      !stackProps.includes("direction"),
      "direction should be excluded (mapped)"
    );
    assert.ok(!stackProps.includes("gap"), "gap should be excluded (mapped)");
    assert.ok(
      !stackProps.includes("aria-label"),
      "aria-label should be excluded (ignored)"
    );
    assert.ok(
      !stackProps.includes("data-testid"),
      "data-testid should be excluded (ignored)"
    );
    assert.ok(
      !stackProps.includes("className"),
      "className should be excluded (ignored)"
    );
    assert.ok(
      stackProps.includes("unmappedProp"),
      "unmappedProp should be included"
    );
  });

  test("combines ignore filtering with filter-unmapped props and include-ignoreList", () => {
    const INPUT = `
    import { Stack } from "@workleap/orbiter-ui";
    
    export function MyComponent() {
      return (
        <Stack 
          direction="row"
          gap="16px"
          aria-label="Navigation"
          data-testid="my-stack"
          className="my-class"
          unmappedProp="value"
        />
      ); 
    }`;

    const { analysisResults } = analyze(getRuntime(INPUT), null, {
      "filter-unmapped": "props",
      "include-ignoreList": true
    });

    assert.ok(
      analysisResults.components.Stack,
      "Stack should be present in results"
    );
    const stackProps = Object.keys(analysisResults.components.Stack.props);

    // Should include unmapped props including those in ignore list
    assert.ok(
      !stackProps.includes("direction"),
      "direction should be excluded (mapped)"
    );
    assert.ok(!stackProps.includes("gap"), "gap should be excluded (mapped)");
    assert.ok(
      stackProps.includes("aria-label"),
      "aria-label should be included (unmapped, ignore list included)"
    );
    assert.ok(
      stackProps.includes("data-testid"),
      "data-testid should be included (unmapped, ignore list included)"
    );
    assert.ok(
      stackProps.includes("className"),
      "className should be included (unmapped, ignore list included)"
    );
    assert.ok(
      stackProps.includes("unmappedProp"),
      "unmappedProp should be included"
    );
  });

  test("handles mixed case with multiple components", () => {
    const INPUT = `
    import { Stack, Text } from "@workleap/orbiter-ui";
    
    export function MyComponent() {
      return (
        <>
          <Stack 
            direction="row"
            aria-label="Navigation"
            customStackProp="value"
          />
          <Text 
            fontSize="14px"
            data-testid="my-text"
            customTextProp="value"
          />
        </>
      ); 
    }`;

    const { analysisResults } = analyze(getRuntime(INPUT), null);

    assert.ok(
      analysisResults.components.Stack,
      "Stack should be present in results"
    );
    assert.ok(
      analysisResults.components.Text,
      "Text should be present in results"
    );

    const stackProps = Object.keys(analysisResults.components.Stack.props);
    const textProps = Object.keys(analysisResults.components.Text.props);

    // Stack props
    assert.ok(
      stackProps.includes("direction"),
      "Stack direction should be present"
    );
    assert.ok(
      stackProps.includes("customStackProp"),
      "Stack customStackProp should be present"
    );
    assert.ok(
      !stackProps.includes("aria-label"),
      "Stack aria-label should be excluded"
    );

    // Text props
    assert.ok(
      textProps.includes("fontSize"),
      "Text fontSize should be present"
    );
    assert.ok(
      textProps.includes("customTextProp"),
      "Text customTextProp should be present"
    );
    assert.ok(
      !textProps.includes("data-testid"),
      "Text data-testid should be excluded"
    );
  });
});
