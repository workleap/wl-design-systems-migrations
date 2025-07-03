import { expect, test } from "vitest";
import { getRuntime } from "../../utils/test.ts";
import { performObjectAnalysis } from "../utils/object-analyzer.ts";

test("should analyze object literals with type annotations", () => {
  const sourceCode = `
    import { DivProps } from "@workleap/orbiter-ui";
    
    function MyComponent() {
      const config: DivProps = {
        className: "test",
        style: { color: "red" }
      };
      
      return <div {...config}></div>;
    }
  `;

  const runtime = getRuntime(sourceCode);
  const result = performObjectAnalysis(runtime, "@workleap/orbiter-ui", {
    includeIgnoredList: false,
    project: undefined,
    deep: false
  });

  // Should track DivProps object
  expect(result.DivProps).toBeDefined();
  expect(result.DivProps!.count.total).toBe(1);
  
  // Should track object properties
  expect(result.DivProps!.props.className).toBeDefined();
  expect(result.DivProps!.props.className!.usage).toBe(1);
  expect(result.DivProps!.props.className!.values["test"]).toBeDefined();
  expect(result.DivProps!.props.className!.values["test"]!.usage.total).toBe(1);
  
  expect(result.DivProps!.props.style).toBeDefined();
  expect(result.DivProps!.props.style!.usage).toBe(1);
});

test("should analyze multiple object instances", () => {
  const sourceCode = `
    import { ButtonProps } from "@workleap/orbiter-ui";
    
    function MyComponent() {
      const config1: ButtonProps = {
        variant: "primary",
        size: "sm"
      };
      
      const config2: ButtonProps = {
        variant: "secondary", 
        size: "lg"
      };
      
      return <div></div>;
    }
  `;

  const runtime = getRuntime(sourceCode);
  const result = performObjectAnalysis(runtime, "@workleap/orbiter-ui", {
    includeIgnoredList: false,
    project: undefined,
    deep: false
  });

  // Should track ButtonProps object with multiple instances
  expect(result.ButtonProps).toBeDefined();
  expect(result.ButtonProps!.count.total).toBe(2);
  
  // Should track property usage across instances
  expect(result.ButtonProps!.props.variant!.usage).toBe(2);
  expect(result.ButtonProps!.props.variant!.values["primary"]!.usage.total).toBe(1);
  expect(result.ButtonProps!.props.variant!.values["secondary"]!.usage.total).toBe(1);
  
  expect(result.ButtonProps!.props.size!.usage).toBe(2);
  expect(result.ButtonProps!.props.size!.values["sm"]!.usage.total).toBe(1);
  expect(result.ButtonProps!.props.size!.values["lg"]!.usage.total).toBe(1);
});

test("should handle renamed imports", () => {
  const sourceCode = `
    import { ButtonProps as BtnProps } from "@workleap/orbiter-ui";
    
    function MyComponent() {
      const config: BtnProps = {
        variant: "primary",
        disabled: true
      };
      
      return <div></div>;
    }
  `;

  const runtime = getRuntime(sourceCode);
  const result = performObjectAnalysis(runtime, "@workleap/orbiter-ui", {
    includeIgnoredList: false,
    project: undefined,
    deep: false
  });

  // Should track the original import name, not the alias
  expect(result.ButtonProps).toBeDefined();
  expect(result.ButtonProps!.count.total).toBe(1);
  expect(result.ButtonProps!.props.variant!.values["primary"]!.usage.total).toBe(1);
  expect(result.ButtonProps!.props.disabled!.values["true"]!.usage.total).toBe(1);
});

test("should track project-specific usage", () => {
  const sourceCode = `
    import { ModalProps } from "@workleap/orbiter-ui";
    
    function MyComponent() {
      const config: ModalProps = {
        open: true,
        size: "md"
      };
      
      return <div></div>;
    }
  `;

  const runtime = getRuntime(sourceCode);
  const result = performObjectAnalysis(runtime, "@workleap/orbiter-ui", {
    includeIgnoredList: false,
    project: "test-project",
    deep: false
  });

  // Should track project-specific usage
  expect(result.ModalProps).toBeDefined();
  expect(result.ModalProps!.count.total).toBe(1);
  expect(result.ModalProps!.count.projects).toBeDefined();
  expect(result.ModalProps!.count.projects!["test-project"]).toBe(1);
  
  // Should track project-specific property values
  expect(result.ModalProps!.props.open!.values["true"]!.usage.projects).toBeDefined();
  expect(result.ModalProps!.props.open!.values["true"]!.usage.projects!["test-project"]).toBe(1);
});

test("should ignore objects without type annotations", () => {
  const sourceCode = `
    import React from "react";
    
    function MyComponent() {
      const config = {
        className: "test",
        style: { color: "red" }
      };
      
      return <div {...config}></div>;
    }
  `;

  const runtime = getRuntime(sourceCode);
  const result = performObjectAnalysis(runtime, "@workleap/orbiter-ui", {
    includeIgnoredList: false,
    project: undefined,
    deep: false
  });

  // Should not track objects without type annotations from our source package
  expect(Object.keys(result)).toHaveLength(0);
});

test("should ignore objects from other packages", () => {
  const sourceCode = `
    import { DivProps } from "@other/package";
    import { ButtonProps } from "@workleap/orbiter-ui";
    
    function MyComponent() {
      const config1: DivProps = {
        className: "test"
      };
      
      const config2: ButtonProps = {
        variant: "primary"
      };
      
      return <div></div>;
    }
  `;

  const runtime = getRuntime(sourceCode);
  const result = performObjectAnalysis(runtime, "@workleap/orbiter-ui", {
    includeIgnoredList: false,
    project: undefined,
    deep: false
  });

  // Should only track objects from our source package
  expect(result.DivProps).toBeUndefined();
  expect(result.ButtonProps).toBeDefined();
  expect(result.ButtonProps!.count.total).toBe(1);
});
