import { Button, Counter, Div, Dot } from "@workleap/orbiter-ui";

export function TestComponent() {
  return (
    <div>
      <Counter variant="divider">10</Counter>
      <Dot />
      <Button onClick={() => console.log("click")}>Click me</Button>
      <Div width="100px">Content</Div>
    </div>
  );
}
