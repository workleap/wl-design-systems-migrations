import { Button, Div, Text } from "@workleap/orbiter-ui";

export function TestComponent() {
  return (
    <div>
      <Div border="1px solid" padding="16px">
        <Text fontSize="14px" fontWeight="bold">Hello World</Text>
        <Button variant="primary" size="md">Click me</Button>
        <Button variant="secondary" size="md">Cancel</Button>
      </Div>
      <Div border="2px solid" padding="16px">
        <Text fontSize="12px">Smaller text</Text>
      </Div>
    </div>
  );
}
