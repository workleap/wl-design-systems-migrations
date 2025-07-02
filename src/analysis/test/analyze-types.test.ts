import { expect, test } from "vitest";
import { getRuntime } from "../../utils/test.ts";
import { performTypeAnalysis } from "../utils/type-analyzer.ts";

test("should analyze type annotations in variable declarations", () => {
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
  const result = performTypeAnalysis(runtime, "@workleap/orbiter-ui", {
    includeIgnoredList: false,
    project: undefined,
    deep: false
  });

  // Should track DivProps type usage
  expect(result.DivProps).toBeDefined();
  expect(result.DivProps!.count.total).toBe(1);
});

test("should analyze type annotations in function parameters", () => {
  const sourceCode = `
    import { ButtonProps } from "@workleap/orbiter-ui";
    
    function MyButton(props: ButtonProps) {
      return <button {...props}></button>;
    }
    
    function AnotherButton(config: ButtonProps) {
      return <button {...config}></button>;
    }
  `;

  const runtime = getRuntime(sourceCode);
  const result = performTypeAnalysis(runtime, "@workleap/orbiter-ui", {
    includeIgnoredList: false,
    project: undefined,
    deep: false
  });

  // Should track ButtonProps type usage - 2 function parameters
  expect(result.ButtonProps).toBeDefined();
  expect(result.ButtonProps!.count.total).toBe(2);
});

test("should analyze type assertions", () => {
  const sourceCode = `
    import { DivProps } from "@workleap/orbiter-ui";
    
    function MyComponent() {
      const config = getConfig() as DivProps;
      const other = getSomeProps() as DivProps;
      
      return <div {...config}></div>;
    }
  `;

  const runtime = getRuntime(sourceCode);
  const result = performTypeAnalysis(runtime, "@workleap/orbiter-ui", {
    includeIgnoredList: false,
    project: undefined,
    deep: false
  });

  // Should track DivProps type usage - 2 type assertions  
  expect(result.DivProps).toBeDefined();
  expect(result.DivProps!.count.total).toBe(2);
});

test("should handle renamed imports", () => {
  const sourceCode = `
    import { ButtonProps as BtnProps } from "@workleap/orbiter-ui";
    
    function MyComponent() {
      const config: BtnProps = {
        variant: "primary",
        disabled: true
      };
      
      function MyButton(props: BtnProps) {
        return <button {...props}></button>;
      }
      
      return <div></div>;
    }
  `;

  const runtime = getRuntime(sourceCode);
  const result = performTypeAnalysis(runtime, "@workleap/orbiter-ui", {
    includeIgnoredList: false,
    project: undefined,
    deep: false
  });

  // Should track the original name (ButtonProps) not the local alias
  expect(result.ButtonProps).toBeDefined();
  expect(result.ButtonProps!.count.total).toBe(2);
});

test("should analyze function return types", () => {
  const sourceCode = `
    import { ButtonProps } from "@workleap/orbiter-ui";
    
    function getButtonProps(): ButtonProps {
      return {};
    }
  `;

  const runtime = getRuntime(sourceCode);
  const result = performTypeAnalysis(runtime, "@workleap/orbiter-ui", {
    includeIgnoredList: false,
    project: undefined,
    deep: false
  });

  // Should track ButtonProps type usage - 1 return type annotation
  expect(result.ButtonProps).toBeDefined();
  expect(result.ButtonProps!.count.total).toBe(1);
});

test("should analyze generic type parameters", () => {
  const sourceCode = `
    import { ButtonProps } from "@workleap/orbiter-ui";
    
    function MyComponent() {
      const configs: Array<ButtonProps> = [];
      const promise: Promise<ButtonProps> = Promise.resolve({ variant: "primary" });
      
      return <div></div>;
    }
  `;

  const runtime = getRuntime(sourceCode);
  const result = performTypeAnalysis(runtime, "@workleap/orbiter-ui", {
    includeIgnoredList: false,
    project: undefined,
    deep: false
  });

  // Should track ButtonProps type usage - 2 generic type parameters
  expect(result.ButtonProps).toBeDefined();
  expect(result.ButtonProps!.count.total).toBe(2);
});

test("should track project-specific usage", () => {
  const sourceCode = `
    import { ModalProps } from "@workleap/orbiter-ui";
    
    function MyComponent() {
      const config: ModalProps = {
        open: true,
        size: "md"
      };
      
      function MyModal(props: ModalProps) {
        return <div></div>;
      }
    }
  `;

  const runtime = getRuntime(sourceCode);
  const result = performTypeAnalysis(runtime, "@workleap/orbiter-ui", {
    includeIgnoredList: false,
    project: "test-project",
    deep: false
  });

  // Should track project-specific usage
  expect(result.ModalProps).toBeDefined();
  expect(result.ModalProps!.count.total).toBe(2);
  expect(result.ModalProps!.count.projects).toBeDefined();
  expect(result.ModalProps!.count.projects!["test-project"]).toBe(2);
});

test("should ignore types from other packages", () => {
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
  const result = performTypeAnalysis(runtime, "@workleap/orbiter-ui", {
    includeIgnoredList: false,
    project: undefined,
    deep: false
  });

  // Should only track ButtonProps from our source package
  expect(result.ButtonProps).toBeDefined();
  expect(result.ButtonProps!.count.total).toBe(1);
  expect(result.DivProps).toBeUndefined();
});

test("should analyze interface extensions", () => {
  const sourceCode = `
    import { ButtonProps } from "@workleap/orbiter-ui";
    
    interface MyButtonProps extends ButtonProps {
      customProp: string;
    }
    
    function MyComponent() {
      return <div></div>;
    }
  `;

  const runtime = getRuntime(sourceCode);
  const result = performTypeAnalysis(runtime, "@workleap/orbiter-ui", {
    includeIgnoredList: false,
    project: undefined,
    deep: false
  });

  // Should track ButtonProps type usage in interface extension
  expect(result.ButtonProps).toBeDefined();
  expect(result.ButtonProps!.count.total).toBe(1);
});
