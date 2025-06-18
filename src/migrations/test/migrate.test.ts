import assert from "node:assert";
import { describe, test } from "vitest";
import { getRuntime, removeSpacesAndNewlines } from "../../utils/test.ts";
import { migrate } from "../migrate.ts";

describe("migrations", () => {
  test("when an Orbiter import got an alter name, keep it with Hopper", async () => {
    const INPUT = "import { Div as Div2, Text } from \"@workleap/orbiter-ui\";";
    const OUTPUT = "import { Div as Div2, Text } from \"@hopper-ui/components\";";

    const actualOutput = migrate(
      getRuntime(INPUT, {
        components: {
          Div: "Div",
          Text: "Text"
        }
      })
    );

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when migrating multiple imports of same component with different aliases and existing target import, merge all imports correctly", async () => {
    const INPUT = `
          import { Div, Div as DivOrbiter } from "@workleap/orbiter-ui";
          import { Div as DivHopper } from "@hopper-ui/components";
          function App() {
            return (
              <>
                <Div />
                <DivOrbiter />
                <DivHopper />
              </>
            );
          }`;
    const OUTPUT = `
          import { Div, Div as DivHopper, Div as DivOrbiter } from "@hopper-ui/components";
          function App() {
            return (
              <>
                <Div />
                <DivOrbiter />
                <DivHopper />
              </>
            );
          }`;

    const actualOutput = migrate(
      getRuntime(INPUT, {
        components: {
          Div: "Div"
        }
      })
    );

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when migrating multiple imports of same component, migrate all of the instances", async () => {
    const INPUT = `
          import { Div, Div as DivOrbiter } from "@workleap/orbiter-ui";
          import { Div as DivHopper } from "@hopper-ui/components";
          function App() {
            return (
              <>
                <Div width="100px" />
                <DivOrbiter width="100px" />
                <DivHopper width="100px" />
              </>
            );
          }`;
    const OUTPUT = `
          import { Div, Div as DivHopper, Div as DivOrbiter } from "@hopper-ui/components";
          function App() {
            return (
              <>
                <Div UNSAFE_width="100px" />
                <DivOrbiter UNSAFE_width="100px" />
                <DivHopper width="100px" />
              </>
            );
          }`;

    const actualOutput = migrate(
      getRuntime(INPUT, {
        components: {
          Div: {
            props: {
              mappings: {
                width: "UNSAFE_width"
              }
            }
          }
        }
      })
    );

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when imports have separate type declaration, migrate them correctly", async () => {
    const INPUT = `
          import { Div } from "@workleap/orbiter-ui";
          import type { ContentProps } from "@workleap/orbiter-ui";
          `;
    const OUTPUT = `
          import { Div } from "@hopper-ui/components";
          import type { ContentProps } from "@hopper-ui/components";
          `;

    const actualOutput = migrate(
      getRuntime(INPUT, {
        components: {
          Div: "Div",
          ContentProps: "ContentProps"
        }
      })
    );

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when the lines are too long, don't wrap the lines", async () => {
    const INPUT = `
          import { InfoIcon } from "@hopper-ui/icons";
          import { Skeleton } from "@sg-protect/components/skeleton";
          import { X, Button, Button as Content, Button as Flex, Button as Header, Button as Item, Button as LongLongLongLongLongClassName, Button as LongLongLongLongLongClassName2 } from "@workleap/orbiter-ui";
          import { LostIllustratedMessage } from "../assets/illustrations/index.tsx";
          import { TeamsIcon, TeamSitesIcon } from "../assets/index.ts";


          function App() {}
          `;

    //three is a bug in codemod or react that adds one empty line after the import statement. 
    const OUTPUT = `
          import {
                    Button,
                    Button as Content,
                    Button as Flex,
                    Button as Header,
                    Button as Item,
                    Button as LongLongLongLongLongClassName,
                    Button as LongLongLongLongLongClassName2,
          } from "@hopper-ui/components";

          import { InfoIcon } from "@hopper-ui/icons";
          import { Skeleton } from "@sg-protect/components/skeleton";
          import { X } from "@workleap/orbiter-ui";
          import { LostIllustratedMessage } from "../assets/illustrations/index.tsx";
          import { TeamsIcon, TeamSitesIcon } from "../assets/index.ts";


          function App() {}
          `;

    const actualOutput = migrate(
      getRuntime(INPUT)
    );
    
    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when imports have inline type specifiers, migrate them correctly", async () => {
    const INPUT = `
          import { Div, type ContentProps} from "@workleap/orbiter-ui";
          `;
    const OUTPUT = `
          import { type ContentProps, Div } from "@hopper-ui/components";
          `;

    const actualOutput = migrate(
      getRuntime(INPUT, {
        components: {
          Div: "Div",
          ContentProps: "ContentProps"
        }
      })
    );

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when all imports are from Orbiter, change them to Hopper", async () => {
    const INPUT = "import { Div } from \"@workleap/orbiter-ui\";";
    const OUTPUT = "import { Div } from \"@hopper-ui/components\";";

    const actualOutput = migrate(getRuntime(INPUT));

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when there is unknown import Orbiter, keep it as it", async () => {
    const INPUT = "import { XYZ } from \"@workleap/orbiter-ui\";";
    const OUTPUT = "import { XYZ } from \"@workleap/orbiter-ui\";";

    const actualOutput = migrate(getRuntime(INPUT));

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when two components map to same component, import them only once", async () => {
    const INPUT = "import { Text, Paragraph } from \"@workleap/orbiter-ui\";export function App() { return <><Paragraph><Text>Sample</Text></Paragraph></>; }";
    const OUTPUT = "import { Text } from \"@hopper-ui/components\";export function App() { return <><Text><Text>Sample</Text></Text></>; }";

    const actualOutput = migrate(
      getRuntime(INPUT, {
        components: {
          Text: {
            to: "Text"
          },
          Paragraph: {
            to: "Text"
          }
        }
      })
    );

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when there is already an import for Hopper, add the migrated one to it", async () => {
    const INPUT = "import { Div } from \"@workleap/orbiter-ui\";import { Span } from \"@hopper-ui/components\";";
    const OUTPUT = "import { Div, Span } from \"@hopper-ui/components\";";

    const actualOutput = migrate(getRuntime(INPUT));

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when a component has similar name, Don't touch it.", async () => {
    const INPUT = "import { Div as Div2 } from \"@workleap/orbiter-ui\"; import { Div } from \"external\"; export function App() { return <><Div width=\"120px\" height=\"auto\" /><Div/></>; }";
    const OUTPUT = "import { Div as Div2 } from \"@hopper-ui/components\"; import { Div } from \"external\"; export function App() { return <><Div width=\"120px\" height=\"auto\" /><Div/></>; }";

    const actualOutput = migrate(getRuntime(INPUT));

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when imports are merged, they should be sorted alphabetically", async () => {
    const INPUT = "import { Text, Div, Button } from \"@workleap/orbiter-ui\";";
    const OUTPUT = "import { Button, Div, Text } from \"@hopper-ui/components\";";

    const actualOutput = migrate(getRuntime(INPUT));

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when adding imports to existing import declaration, result should be sorted alphabetically", async () => {
    const INPUT = "import { Text, Div } from \"@workleap/orbiter-ui\";import { Span, Button } from \"@hopper-ui/components\";";
    const OUTPUT = "import { Button, Div, Span, Text } from \"@hopper-ui/components\";";

    const actualOutput = migrate(getRuntime(INPUT));

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when multiple components with aliases are merged, they should be sorted alphabetically by imported name", async () => {
    const INPUT = "import { Text as MyText, Div as MyDiv, Button as MyButton } from \"@workleap/orbiter-ui\";";
    const OUTPUT = "import { Button as MyButton, Div as MyDiv, Text as MyText } from \"@hopper-ui/components\";";

    const actualOutput = migrate(getRuntime(INPUT));

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when type imports are sorted, they should be alphabetical by imported name", async () => {
    const INPUT = "import type { TextProps, DivProps, ButtonProps } from \"@workleap/orbiter-ui\";";
    const OUTPUT = "import type { ButtonProps, DivProps, TextProps } from \"@hopper-ui/components\";";

    const actualOutput = migrate(
      getRuntime(INPUT, {
        components: {
          TextProps: "TextProps",
          DivProps: "DivProps",
          ButtonProps: "ButtonProps"
        }
      })
    );

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when an Orbiter component has attributes, use the map table to migrate them.", async () => {
    const INPUT = "import { Div } from \"@workleap/orbiter-ui\"; export function App() { return <Div width=\"120px\" height=\"auto\" />; }";
    const OUTPUT = "import { Div } from \"@hopper-ui/components\"; export function App() { return <Div UNSAFE_width=\"120px\" height=\"auto\" />; }";

    const actualOutput = migrate(getRuntime(INPUT));
    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when mapping has additional props for a mapping, add them to the result.", async () => {
    const INPUT = "import { Paragraph } from \"@workleap/orbiter-ui\"; export function App() { return <Paragraph />; }";
    const OUTPUT = "import { Text } from \"@hopper-ui/components\"; export function App() { return <Text display=\"block\" />; }";

    const actualOutput = migrate(
      getRuntime(INPUT, {
        components: {
          Paragraph: {
            to: "Text",
            props: {
              additions: {
                display: "block"
              }
            }
          }
        }
      })
    );
    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when the provided function for property map returns null, ignore the prop", async () => {
    const INPUT = "import { Div } from \"@workleap/orbiter-ui\"; export function App() { return <Div width=\"120px\" />; }";
    const OUTPUT = "import { Div } from \"@hopper-ui/components\"; export function App() { return <Div width=\"120px\" />; }";

    const actualOutput = migrate(
      getRuntime(INPUT, {
        components: {
          Div: {
            props: {
              mappings: {
                width: () => null
              }
            }
          }
        }
      })
    );

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when there are similar targets for two components, don't run migration twice for them", async () => {
    const INPUT = "import { Text, Paragraph } from \"@workleap/orbiter-ui\"; export function App() { return <div><Paragraph fontFamily=\"tertiary\"/><Text fontFamily=\"tertiary\"></Text></div>; }";
    const OUTPUT = "import { Text } from \"@hopper-ui/components\"; export function App() { return <div><Text fontFamily=\"core_tertiary\" elementType=\"p\" /><Text fontFamily=\"core_tertiary\"></Text></div>; }";

    const actualOutput = migrate(
      getRuntime(INPUT, {
        components: {
          Text: "Text",
          Paragraph: {
            to: "Text",
            props: {
              mappings: {
                fontFamily: (value: any) => {
                  value.value = `core_${value.value}`;

                  return {
                    to: "fontFamily",
                    value: value
                  };
                }
              },
              additions: {
                elementType: "p"
              }
            }
          }
        }
      })
    );

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when the provided function for property map returns a custom map, use it", async () => {
    const INPUT = "import { Div } from \"@workleap/orbiter-ui\"; export function App() { return <Div width=\"120px\" />; }";
    const OUTPUT = "import { Div } from \"@hopper-ui/components\"; export function App() { return <Div CUSTOM_width=\"120px_Custom\" />; }";

    const actualOutput = migrate(
      getRuntime(INPUT, {
        components: {
          Div: {
            to: "Div",
            props: {
              mappings: {
                width: value => {
                  if (value?.type == "Literal") {
                    value.value = `${value.value}_Custom`;
                  }

                  return {
                    to: "CUSTOM_width",
                    value: value
                  };
                }
              }
            }
          }
        }
      })
    );

    assert.deepEqual(actualOutput, OUTPUT);
  });

  test("when todoComments is provided for a component, include them in the output", async () => {
    const INPUT = "import { OldComp } from \"@workleap/orbiter-ui\"; export function App() { return <OldComp />; }";
    const OUTPUT = "import { OldComp } from \"@hopper-ui/components\"; export function App() { return ( /* Migration TODO: OldComp is deprecated */ <OldComp /> ); }";

    const actualOutput = migrate(
      getRuntime(INPUT, {
        components: {
          OldComp: {
            todoComments: "OldComp is deprecated"
          }
        }
      })
    )!;

    assert.deepEqual(removeSpacesAndNewlines(actualOutput), OUTPUT);
  });

  test("when the provided value is ResponsiveProp, convert them properly", async () => {
    const INPUT = "import { Div } from \"@workleap/orbiter-ui\"; export function App() { return <Div padding={{ base: 400, sm: 20 }} margin={20} />; }";
    const OUTPUT = "import { Div } from \"@hopper-ui/components\"; export function App() { return ( <Div padding={{ base: \"core_400\", sm: \"core_20\" }} margin=\"core_20\" /> ); }";

    const actualOutput = migrate(getRuntime(INPUT))!;

    assert.deepEqual(removeSpacesAndNewlines(actualOutput), OUTPUT);
  });

  test("when skipImport is true, the import should not be migrated but props should be transformed", async () => {
    const INPUT = "import { DeprecatedComponent } from \"@workleap/orbiter-ui\"; export function App() { return <DeprecatedComponent oldProp=\"value\" />; }";
    const OUTPUT = "import { DeprecatedComponent } from \"@workleap/orbiter-ui\"; export function App() { return ( /* Migration TODO: This component is deprecated */ <DeprecatedComponent newProp=\"value\" /> ); }";

    const actualOutput = migrate(
      getRuntime(INPUT, {
        components: {
          DeprecatedComponent: {
            skipImport: true,
            props: {
              mappings: {
                oldProp: "newProp"
              }
            },
            todoComments: "This component is deprecated"
          }
        }
      })
    )!;

    assert.deepEqual(removeSpacesAndNewlines(actualOutput), OUTPUT);
  });

  test("when skipImport is true, mixed imports should keep the skipped component in original package", async () => {
    const INPUT = "import { DeprecatedComponent, NormalComponent } from \"@workleap/orbiter-ui\"; export function App() { return <><DeprecatedComponent /><NormalComponent /></>; }";
    const OUTPUT = "import { NormalComponent } from \"@hopper-ui/components\"; import { DeprecatedComponent } from \"@workleap/orbiter-ui\"; export function App() { return ( <>/* Migration TODO: This component is deprecated */ <DeprecatedComponent /><NormalComponent /></> ); }";

    const actualOutput = migrate(
      getRuntime(INPUT, {
        components: {
          DeprecatedComponent: {
            skipImport: true,
            todoComments: "This component is deprecated"
          },
          NormalComponent: "NormalComponent"
        }
      })
    )!;

    assert.deepEqual(removeSpacesAndNewlines(actualOutput), OUTPUT);
  });

  test("when skipImport is true with alias, the import should not be migrated", async () => {
    const INPUT = "import { DeprecatedComponent as DC } from \"@workleap/orbiter-ui\"; export function App() { return <DC oldProp=\"value\" />; }";
    const OUTPUT = "import { DeprecatedComponent as DC } from \"@workleap/orbiter-ui\"; export function App() { return ( /* Migration TODO: This component is deprecated */ <DC newProp=\"value\" /> ); }";

    const actualOutput = migrate(
      getRuntime(INPUT, {
        components: {
          DeprecatedComponent: {
            skipImport: true,
            props: {
              mappings: {
                oldProp: "newProp"
              }
            },
            todoComments: "This component is deprecated"
          }
        }
      })
    )!;

    assert.deepEqual(removeSpacesAndNewlines(actualOutput), OUTPUT);
  });

  test("when skipImport is false (default), the import should be migrated normally", async () => {
    const INPUT = "import { NormalComponent } from \"@workleap/orbiter-ui\"; export function App() { return <NormalComponent oldProp=\"value\" />; }";
    const OUTPUT = "import { NormalComponent } from \"@hopper-ui/components\"; export function App() { return <NormalComponent newProp=\"value\" />; }";

    const actualOutput = migrate(
      getRuntime(INPUT, {
        components: {
          NormalComponent: {
            skipImport: false, // explicitly set to false to test
            props: {
              mappings: {
                oldProp: "newProp"
              }
            }
          }
        }
      })
    )!;

    assert.deepEqual(removeSpacesAndNewlines(actualOutput), OUTPUT);
  });
});
