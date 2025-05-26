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
        text 1
      </Flex>
      <Flex
        direction="row"
        gap="inline-md"
        rowGap={"inline-md"}
        columnGap={"inline-md"}
      >
        text 2
      </Flex>
      <Flex direction="row" gap={"20px"} rowGap="20px" columnGap={"20px"}>
        text 3
      </Flex>
      <Flex direction="row" gap="35%" rowGap="35%" columnGap="35%">
        text 4
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
      {/* ------------------------------------------------------------------------------------------ */}
      <Div color="initial" />
      <Div color="currentcolor" />
      <Div color="invalid value" />
      <Div color="amanita-400" />
      <Div color="neutral-weak-selected" />
      <Div color="dotColor" />
      <Div color="" />
      <Div backgroundColor="initial" />
      <Div backgroundColor="currentcolor" />
      <Div backgroundColor="invalid value" />
      <Div backgroundColor="orchid-bloom-50" />
      <Div backgroundColor="neutral-weak-selected" />
      <Div backgroundColor="primary" />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div gridAutoColumns="min-content" />
      <Div gridAutoColumns="initial" />
      <Div gridAutoColumns="95%" />
      <Div gridAutoColumns="95.5fr" />
      <Div gridAutoColumns={0} />
      <Div gridAutoColumns="0" />
      <Div gridAutoColumns={480} />
      <Div gridAutoColumns="2/3" />
      <Div gridAutoColumns="invalid value" />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div gridAutoRows="min-content" />
      <Div gridAutoRows="initial" />
      <Div gridAutoRows="95%" />
      <Div gridAutoRows="95.5fr" />
      <Div gridAutoRows={0} />
      <Div gridAutoRows="0" />
      <Div gridAutoRows={480} />
      <Div gridAutoRows="2/3" />
      <Div gridAutoRows="invalid value" />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div gridTemplateColumns="subgrid" />
      <Div gridTemplateColumns="min-content" />
      <Div gridTemplateColumns={0} />
      <Div gridTemplateColumns={960} />
      <Div gridTemplateColumns="invalid" />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div gridTemplateRows="none" />
      <Div gridTemplateRows="auto" />
      <Div gridTemplateRows={0} />
      <Div gridTemplateRows={960} />
      <Div gridTemplateRows="invalid" />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div justifyContent="space-between" />
      <Div justifyContent="left" />
      <Div justifyContent="invalid" />
      <Div justifyItems="normal" />
      <Div justifyItems="legacy" />
      <Div justifyItems="invalid" />
      <Div justifySelf="auto" />
      <Div justifySelf="baseline" />
      <Div justifySelf="invalid" />
      {/* ------------------------------------------------------------------------------------------ */}
      <Text fontFamily="cursive" />
      <Text fontFamily="revert" />
      <Text fontFamily="heading-md" />
      <Text fontFamily="tertiary" />
      <Text fontFamily="overline" />
      <Text fontFamily="Arial, sans-serif" />
      <Text fontSize="lighter" />
      <Text fontSize="bold" />
      <Text fontSize="body-lg-bold" />
      <Text fontSize={120} />
      <Text fontSize={1234.5} />
      <Text fontSize="1.2em" />
      <Text fontSize="invalid-size" />
      <Text fontStyle="initial" />
      <Text fontStyle="oblique" />
      <Text fontStyle="invalid-style" />
      <Text fontWeight="body-lg-semibold" />
      <Text fontWeight="initial" />
      <Text fontWeight="revert" />
      <Text fontWeight={680} />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div lineHeight="1-4285" />
      <Div lineHeight="body-xs" />
      <Div lineHeight="normal" />
      <Div lineHeight="invalid" />
      <Div lineHeight="124rem" />
      <Div lineHeight={425} />
      <Div lineHeight={0} />
      <Div lineHeight={"0"} />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div boxShadow="none" />
      <Div boxShadow="sm" />
      <Div boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)" />
      <Div boxShadow="invalid-shadow" />
      <Div boxShadow={"0"} />
      <Div boxShadowActive="floating" />
      <Div boxShadowFocus="lifted" />
      <Div boxShadowHover="raised" />
      <Div boxShadow={expandedKeys ? "sm" : "lg"} />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div fill="initial" />
      <Div fill="child" />
      <Div fill="coastal-700" />
      <Div fill="abyss" />
      <Div fill="primary-active" />
      <Div fill="invalid value" />
      <Div fill="initial" />
      <Div fillFocus="-moz-initial" />
      <Div fillFocus="amanita-75" />
      <Div fillFocus="warning" />
      <Div fillFocus="none" />
      <Div fillFocus="invalid value" />
      <Div fillFocus="-moz-initial" />
      <Div fillHover="moss-400" />
      <Div fillHover="danger" />
      <Div fillHover="context-stroke" />
      <Div fillHover="invalid value" />
      {/* ------------------------------------------------------------------------------------------ */}
      <Span stroke="currentcolor" />
      <Span stroke="child" />
      <Span stroke="moss-600" />
      <Span stroke="transparent" />
      <Span stroke="red" />
      <Span stroke="aliceblue" />
      <Span stroke="CaptionText" />
      <Span stroke="invalid value" />
      {/* ------------------------------------------------------------------------------------------ */}
    </div>
  );
}
