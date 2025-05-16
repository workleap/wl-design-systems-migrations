
This codemod migrates [Orbiter](https://github.com/workleap/wl-orbiter) components to [Hopper](https://github.com/workleap/wl-hopper) design system components.

### Before

```tsx
import { Div } from "@workleap/orbiter-ui";

export function App() {
  return <Div width="100px"/>;
}
```

### After

```tsx
import { Div } from "@hopper-ui/components";

export function App() {
  return <Div UNSAFE_width="100px"/>;
}
```

### Migrate all components

```bash
npx codemod workleap/orbiter-to-hopper
```

or

```bash
npx codemod workleap/orbiter-to-hopper -c all
```

### Migrate only one component

```bash
npx codemod workleap/orbiter-to-hopper -c Div
```

### Migrate only in one subfolder

```bash
npx codemod workleap/orbiter-to-hopper -t /app/users
```
