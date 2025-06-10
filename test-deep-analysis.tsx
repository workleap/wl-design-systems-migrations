import { Button, Div, Text } from "@workleap/orbiter-ui";

export function TestComponent() {
  return (
    <>
      <Button variant="primary" size="large">Primary Button</Button>
      <Button variant="secondary" size="large">Secondary Button</Button>
      <Text fontSize="14px">Some text</Text>
      <Div width="100px" height="200px">Some content</Div>
    </>
  );
}
