import {
  Div,
  Flex,
  Paragraph,
  Span,
  Text,
  TextInput,
  useAccordionContext,
} from "@workleap/orbiter-ui";

export function App() {
  const { expandedKeys } = useAccordionContext();

  return (
    <div>
      <h1>Page 2</h1>
      <p>This is a page component.{expandedKeys}</p>
      <Div backgroundColor="warning" width={320} minHeight={"120px"} />
      <Div backgroundColor="warning" width="35%" />
      <Div backgroundColor="warning" width="45rem" />
      <Div backgroundColor="warning" width={"-35%"} />
      <Div backgroundColor="warning" width="fit-content" />

      <Div backgroundColor="warning" height={0} />
      <Div backgroundColor="warning" height="0.5%" />
      <Div backgroundColor="warning" height="800px" />
      <Div backgroundColor="warning" height={"-35%"} />
      <Div backgroundColor="warning" height="-moz-initial" />

      <Text color="neutral">Hello World!</Text>
      <TextInput disabled />
      <Paragraph size={"2xl"}>Hello World!</Paragraph>
      <Flex direction="row" gap={960} rowGap={0} columnGap={0}>
        text
      </Flex>
      <Flex
        direction="row"
        gap="inline-md"
        rowGap={"inline-md"}
        columnGap={"inline-md"}
      >
        text
      </Flex>
      <Flex direction="row" gap={"20px"} rowGap="20px" columnGap={"20px"}>
        text
      </Flex>
      <Flex direction="row" gap="35%" rowGap="35%" columnGap="35%">
        text
      </Flex>
      {/* ------------------------------------------------------------------------------------------ */}
      <Div marginTop={"10px"}></Div>
      <Div marginBottom="inline-sm"></Div>
      <Div marginLeft="25%"></Div>
      <Div marginRight="auto"></Div>
      <Div marginX={0}></Div>
      <Div marginLeft={1280}></Div>
      <Div marginY={"0"}></Div>
      <Div marginLeft="revert-layer"></Div>
      <Div margin="inline-lg"></Div>
      <Div margin="auto"></Div>
      <Div margin="inline-lg inline-md"></Div>
      {/* ------------------------------------------------------------------------------------------ */}
      <Span paddingTop={"10px"}></Span>
      <Span paddingBottom="inline-sm"></Span>
      <Span paddingLeft="25%"></Span>
      <Span paddingRight="auto"></Span>
      <Span paddingX={0}></Span>
      <Span padding={1280}></Span>
      <Span paddingY={"0"}></Span>
      <Span paddingLeft="revert-layer"></Span>
      <Span padding="inline-lg"></Span>
      <Span padding="auto"></Span>
      <Span padding="inset-squish-lg"></Span>
      {/* ------------------------------------------------------------------------------------------ */}
      <Div alignContent="initial" />
      <Div alignContent="baseline" />
      <Div alignContent="space-between" />
      <Div alignContent="random value" />
      <Div alignContent={expandedKeys ? "initial" : "space-around"} />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div alignItems="initial" />
      <Div alignItems="baseline" />
      <Div alignItems="flex-start" />
      <Div alignItems="space-between" />
      <Div alignItems={expandedKeys ? "initial" : "space-around"} />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div alignSelf="initial" />
      <Div alignSelf="auto" />
      <Div alignSelf="flex-start" />
      <Div alignSelf="space-between" />
      <Div alignSelf={expandedKeys ? "initial" : "space-around"} />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div border="3px" />
      <Div border="upsell" />
      <Div border="rock-200" />
      <Div border="coastal-200" />
      <Div border="currentcolor" />
      <Div border="0" />
      <Div border={0} />
      <Div border={"solid"} />
      <Div border={expandedKeys ? "initial" : "space-around"} />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div borderRadius="3px" />
      <Div borderRadius="rounded-md" />
      <Div borderRadius="pill" />
      <Div borderRadius={9999} />
      <Div borderRadius="0" />
      <Div borderRadius={0} />
      <Div borderRadius="invalid value" />
      <Div borderRadius={expandedKeys ? "initial" : "space-around"} />
      <Div borderRadius="circle" />
    </div>
  );
}
