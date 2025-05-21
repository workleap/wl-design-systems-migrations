This codemod migrates components from [Orbiter](https://github.com/workleap/wl-orbiter) to the [Hopper](https://github.com/workleap/wl-hopper) design system.

## How to Use?

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

### Analyze Orbiter Components Usages

To find out the Orbiter's components and their properties usage, run the following command. This command writes the usages in `orbiter-usage.json` file.

⚠️ It is important to pass `-n 1` to use only one thread and get reliable output.

```bash
npx codemod workleap/orbiter-to-hopper -a result.json -n 1
```

The sample output is an ordered JSON that prioritizes the most frequently used components. Within each component, the commonly used properties are also organized in order of frequency:

```json
{
  "Div": {
    "usage": 5,
    "props": {
      "backgroundColor": 2,
      "width": 2,
      "height": 1
    }
  },
  "Text": {
    "usage": 4,
    "props": {
      "color": 3,
      "backgroundColor": 1
    }
  },
}
```

### Run Migrations

#### All Components

```bash
npx codemod workleap/orbiter-to-hopper
```

or

```bash
npx codemod workleap/orbiter-to-hopper -c all
```

#### One Component

```bash
npx codemod workleap/orbiter-to-hopper -c Div
```

#### In a Path

```bash
npx codemod workleap/orbiter-to-hopper -t /app/users
```

#### Other Options

Read the [Codemod CLI options](https://docs.codemod.com/deploying-codemods/cli#options) doc for more options.

## How to Contribute?

First, [install the codemod CLI globally](https://docs.codemod.com/deploying-codemods/cli#installation).

Then, do the modifications and publish a new version by running:

```bash
pnpm publish
```

But if you want to test them locally before publishing, you can run this command in your target project:

```bash
codemod --source THIS_PROJECT_LOCAL_PATH
```

> [!TIP]
> To run the latest modifications, the `cdmd_dist` folder should not exist. If you use the `pnpm deploy:codemod`, this folder is getting deleted after each deployment automatically.

### Simple Modifications

Modify the [mappings.ts](/src/mappings/mappings.ts) for simple mappings. Just add the components and props to map.

```ts
{
  sourcePackage: "@workleap/orbiter-ui",
  targetPackage: "@hopper-ui/components",
  components: {
    Div: {
      targetName: "Div",
      props: {
        width: "UNSAFE_width",
        height: "UNSAFE_height",
        maxWidth: (oldValue) => {
            return {
                value: oldValue,
                propName: "UNSAFE_maxWidth"
            }

        }
      },
    },
    Text: {
      targetName: "Text",
    },
  },
};
```
