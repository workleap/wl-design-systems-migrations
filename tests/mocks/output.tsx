// prettier-ignore
import {
  A,
  Address,
  Article,
  Aside,
  Button,
  ButtonGroup,
  CloseButton,
  Content,
  type ContentProps,
  Counter,
  Div,
  Flex,
  Footer,
  Grid,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Header,
  Heading,
  Div as HopperDiv,
  HtmlButton,
  HtmlFooter,
  HtmlForm,
  HtmlH1,
  HtmlH1Props,
  HtmlH2,
  HtmlH3,
  HtmlH4,
  HtmlH5,
  HtmlH6,
  HtmlHeader,
  HtmlInput,
  HtmlSection,
  Img,
  Inline,
  LI,
  LinkButton,
  Main,
  Nav,
  OL,
  Paragraph,
  Span,
  Stack,
  Table,
  TBody,
  TD,
  Text,
  TFoot,
  TH,
  THead,
  Tile,
  TileGroup,
  TileLink,
  TR,
  UL,
} from "@hopper-ui/components";
import { SparklesIcon } from "@hopper-ui/icons";
import { useAccordionContext } from "@workleap/orbiter-ui";

export function App() {
  const { expandedKeys } = useAccordionContext();
  const rest: any = {};
  const variable = {};

  return (
    <div>
      <h1>Page 2</h1>
      <p>Welcome {expandedKeys}</p>
      {/* ------------------------------------------------------------------------------------------ */}
      {/* Styled System Props ---------------------------------------------------------------------- */}
      {/* ------------------------------------------------------------------------------------------ */}
      <Div backgroundColor="warning" width="core_320" UNSAFE_minHeight={"120px"} />
      <Div backgroundColor="warning" width="35%" />
      <Div backgroundColor="warning" UNSAFE_width="45rem" />
      <Div backgroundColor="warning" width={"-35%"} />
      <Div backgroundColor="warning" width="fit-content" />
      <Div backgroundColor="warning" height="core_0" />
      <Div backgroundColor="warning" height="0.5%" />
      <Div backgroundColor="warning" UNSAFE_height="800px" />
      <Div backgroundColor="warning" height={"-35%"} />
      <Div backgroundColor="warning" height="-moz-initial" />
      <Text color="neutral">Hello World!</Text>
      <Paragraph size={"2xl"}>Hello World!</Paragraph>
      <Flex direction="row" gap="core_960" rowGap="core_0" columnGap="core_0">
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
      <Flex direction="row" UNSAFE_gap={"20px"} UNSAFE_rowGap="20px" UNSAFE_columnGap={"20px"}>
        text 3
      </Flex>
      <Flex direction="row" UNSAFE_gap="35%" UNSAFE_rowGap="35%" UNSAFE_columnGap="35%">
        text 4
      </Flex>
      <Stack gap="core_0" rowGap="core_0" columnGap="core_0">
        text
      </Stack>
      <Inline gap="core_0" rowGap="core_0" columnGap="core_0">
        text
      </Inline>
      {/* ------------------------------------------------------------------------------------------ */}
      <Div UNSAFE_marginTop={"10px"}></Div>
      <Div marginBottom="inline-sm"></Div>
      <Div UNSAFE_marginLeft="25%"></Div>
      <Div UNSAFE_marginRight="auto"></Div>
      <Div marginX="core_0"></Div>
      <Div marginLeft="core_1280"></Div>
      <Div marginY="core_0"></Div>
      <Div marginLeft="revert-layer"></Div>
      <Div margin="inline-lg"></Div>
      <Div UNSAFE_margin="auto"></Div>
      <Div UNSAFE_margin="inline-lg inline-md"></Div>
      {/* ------------------------------------------------------------------------------------------ */}
      <Flex padding={variable}>text</Flex>
      <Span UNSAFE_paddingTop={"10px"}></Span>
      <Span UNSAFE_paddingBottom="inline-sm"></Span>
      <Span UNSAFE_paddingLeft="25%"></Span>
      <Span UNSAFE_paddingRight="auto"></Span>
      <Span paddingX="core_0"></Span>
      <Span padding="core_1280"></Span>
      <Span paddingY="core_0"></Span>
      <Span paddingLeft="revert-layer"></Span>
      <Span UNSAFE_padding="inline-lg"></Span>
      <Span UNSAFE_padding="auto"></Span>
      <Span padding="inset-squish-lg"></Span>
      {/* ------------------------------------------------------------------------------------------ */}
      <Div alignContent="initial" />
      <Div alignContent="baseline" />
      <Div alignContent="space-between" />
      <Div REVIEWME_alignContent="random value" />
      <Div alignContent={expandedKeys ? "initial" : "space-around"} />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div alignItems="initial" />
      <Div alignItems="baseline" />
      <Div alignItems="flex-start" />
      <Div REVIEWME_alignItems="space-between" />
      <Div alignItems={expandedKeys ? "initial" : "space-around"} />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div alignSelf="initial" />
      <Div alignSelf="auto" />
      <Div alignSelf="flex-start" />
      <Div REVIEWME_alignSelf="space-between" />
      <Div alignSelf={expandedKeys ? "initial" : "space-around"} />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div UNSAFE_border="3px" />
      <Div border="upsell" />
      <Div border="core_rock-200" />
      <Div border="core_coastal-200" />
      <Div border="currentcolor" />
      <Div UNSAFE_border="0" />
      <Div border={0} />
      <Div UNSAFE_border={"solid"} />
      <Div border={expandedKeys ? "initial" : "space-around"} />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div UNSAFE_borderRadius="3px" />
      <Div borderRadius="rounded-md" />
      <Div borderRadius="pill" />
      <Div borderRadius="core_9999" />
      <Div borderRadius="core_0" />
      <Div borderRadius={0} />
      <Div UNSAFE_borderRadius="invalid value" />
      <Div borderRadius={expandedKeys ? "initial" : "space-around"} />
      <Div borderRadius="circle" />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div color="initial" />
      <Div color="currentcolor" />
      <Div UNSAFE_color="invalid value" />
      <Div color="core_amanita-400" />
      <Div color="neutral-weak-selected" />
      <Div UNSAFE_color="dotColor" />
      <Div UNSAFE_color="" />
      <Div backgroundColor="initial" />
      <Div backgroundColor="currentcolor" />
      <Div UNSAFE_backgroundColor="invalid value" />
      <Div backgroundColor="core_orchid-bloom-50" />
      <Div backgroundColor="neutral-weak-selected" />
      <Div backgroundColor="primary" />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div gridAutoColumns="min-content" />
      <Div gridAutoColumns="initial" />
      <Div gridAutoColumns="95%" />
      <Div gridAutoColumns="95.5fr" />
      <Div gridAutoColumns="core_0" />
      <Div gridAutoColumns="core_0" />
      <Div gridAutoColumns="core_480" />
      <Div UNSAFE_gridAutoColumns="2/3" />
      <Div UNSAFE_gridAutoColumns="invalid value" />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div gridAutoRows="min-content" />
      <Div gridAutoRows="initial" />
      <Div gridAutoRows="95%" />
      <Div gridAutoRows="95.5fr" />
      <Div gridAutoRows="core_0" />
      <Div gridAutoRows="core_0" />
      <Div gridAutoRows="core_480" />
      <Div UNSAFE_gridAutoRows="2/3" />
      <Div UNSAFE_gridAutoRows="invalid value" />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div gridTemplateColumns="subgrid" />
      <Div gridTemplateColumns="min-content" />
      <Div gridTemplateColumns="core_0" />
      <Div gridTemplateColumns="core_960" />
      <Div UNSAFE_gridTemplateColumns="invalid" />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div gridTemplateRows="none" />
      <Div gridTemplateRows="auto" />
      <Div gridTemplateRows="core_0" />
      <Div gridTemplateRows="core_960" />
      <Div UNSAFE_gridTemplateRows="invalid" />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div justifyContent="space-between" />
      <Div justifyContent="left" />
      <Div REVIEWME_justifyContent="invalid" />
      <Div justifyItems="normal" />
      <Div justifyItems="legacy" />
      <Div REVIEWME_justifyItems="invalid" />
      <Div justifySelf="auto" />
      <Div justifySelf="baseline" />
      <Div REVIEWME_justifySelf="invalid" />
      {/* ------------------------------------------------------------------------------------------ */}
      <Text UNSAFE_fontFamily="cursive" />
      <Text fontFamily="revert" />
      <Text fontFamily="heading-md" />
      <Text fontFamily="core_tertiary" />
      <Text fontFamily="overline" />
      <Text UNSAFE_fontFamily="Arial, sans-serif" />
      <Text UNSAFE_fontSize="lighter" />
      <Text UNSAFE_fontSize="bold" />
      <Text fontSize="body-lg-bold" />
      <Text fontSize="core_120" />
      <Text UNSAFE_fontSize="1234.5px" />
      <Text UNSAFE_fontSize="1.2em" />
      <Text UNSAFE_fontSize="invalid-size" />
      <Text fontStyle="initial" />
      <Text fontStyle="oblique" />
      <Text REVIEWME_fontStyle="invalid-style" />
      <Text fontWeight="body-lg-semibold" />
      <Text fontWeight="initial" />
      <Text fontWeight="revert" />
      <Text fontWeight="core_680" />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div lineHeight="core_1-4285" />
      <Div lineHeight="body-xs" />
      <Div UNSAFE_lineHeight="normal" />
      <Div UNSAFE_lineHeight="invalid" />
      <Div UNSAFE_lineHeight="124rem" />
      <Div UNSAFE_lineHeight={425} />
      <Div UNSAFE_lineHeight={0} />
      <Div UNSAFE_lineHeight={"0"} />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div boxShadow="none" />
      <Div boxShadow="core_sm" />
      <Div UNSAFE_boxShadow="0 4px 6px rgba(0, 0, 0, 0.1)" />
      <Div UNSAFE_boxShadow="invalid-shadow" />
      <Div UNSAFE_boxShadow={"0"} />
      <Div boxShadowActive="floating" />
      <Div boxShadowFocus="lifted" />
      <Div boxShadowHover="raised" />
      <Div boxShadow={expandedKeys ? "sm" : "lg"} />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div fill="initial" />
      <Div fill="child" />
      <Div fill="core_coastal-700" />
      <Div fill="core_abyss" />
      <Div fill="primary-active" />
      <Div UNSAFE_fill="invalid value" />
      <Div fill="initial" />
      <Div fillFocus="-moz-initial" />
      <Div fillFocus="core_amanita-75" />
      <Div fillFocus="warning" />
      <Div fillFocus="none" />
      <Div UNSAFE_fillFocus="invalid value" />
      <Div fillFocus="-moz-initial" />
      <Div fillHover="core_moss-400" />
      <Div fillHover="danger" />
      <Div fillHover="context-stroke" />
      <Div UNSAFE_fillHover="invalid value" />
      {/* ------------------------------------------------------------------------------------------ */}
      <Span stroke="currentcolor" />
      <Span stroke="child" />
      <Span stroke="core_moss-600" />
      <Span stroke="transparent" />
      <Span UNSAFE_stroke="red" />
      <Span UNSAFE_stroke="aliceblue" />
      <Span UNSAFE_stroke="CaptionText" />
      <Span UNSAFE_stroke="invalid value" />
      {/* ------------------------------------------------------------------------------------------ */}
      <Div UNSAFE_padding={{
        base: "core_0",
        md: "inset-sm",
        xl: "20rem"
      }} />
      <Div padding={{
        base: "core_0",
        md: "inset-sm",
        xl: "inset-squish-sm"
      }} />
      <Div
        padding={{
          base: "core_0",
          md: "inset-sm",
          xl: expandedKeys ? "s" : "f"
        }}
      />
      <Div padding={{}} />
      <Div justifyContent={{
        base: "space-between",
        md: "initial"
      }} />
      <Div REVIEWME_justifyContent={{
        base: "space-between",
        md: "invalid"
      }} />
      <Div display={{ base: "none", md: "block" }} />
      <Flex
        {...rest}
        borderRadius={{
          base: 0,
          xs: "core_2"
        }}
        UNSAFE_width={{
          base: "100%",
          xs: "488px"
        }}
      />
      {/* ------------------------------------------------------------------------------------------ */}
      {/* Components ------------------------------------------------------------------------------- */}
      {/* ------------------------------------------------------------------------------------------ */}
      <Flex
        padding="core_400"
        grow={1}
        shrink={2}
        fluid={1 == 1 ? true : true}
        direction="row"
        basis={"invalid"}
      >
        text
      </Flex>
      <Flex fluid width="120%">
        text
      </Flex>
      <Flex width="100%">text</Flex>
      <Flex fluid={false}>text</Flex>
      <Flex reverse/* Migration TODO: Remove the `reverse` property, read this: https://hopper.workleap.design/components/Flex#migration-notes */>text</Flex>
      <Grid padding="core_400">text</Grid>
      <Grid UNSAFE_autoRows="repeat(3, 1fr)">text</Grid>
      <Grid autoRows="min-content">text</Grid>
      <Grid UNSAFE_autoColumns="repeat(3, 1fr)">text</Grid>
      <Grid autoColumns="auto">text</Grid>
      <Grid UNSAFE_templateRows="repeat(3, 1fr)">text</Grid>
      <Grid templateRows="subgrid">text</Grid>
      <Grid UNSAFE_templateColumns="repeat(3, 1fr)">text</Grid>
      <Grid templateColumns="subgrid">text</Grid>
      <Inline UNSAFE_gap="1.25rem">text</Inline>
      <Inline gap="core_400">text</Inline>
      <Inline UNSAFE_gap={"invalid"}>text</Inline>
      <Inline width="100%" UNSAFE_gap="1.25rem">text</Inline>
      <Inline fluid={false} UNSAFE_gap="1.25rem">text</Inline>
      <Stack padding="core_400">text</Stack>
      <Heading UNSAFE_marginBottom="calc(1.75rem * .5)">text</Heading>
      <Heading size="xs" UNSAFE_marginBottom="calc(1.125rem * .5)">text</Heading>
      <Heading margin="core_0">text</Heading>
      <Heading marginBottom={"inline-md"}>text</Heading>
      <Heading size="3xl" marginBottom={"inline-md"}>
        text
      </Heading>
      <H1 size="lg" UNSAFE_marginBottom="calc(2rem * .5)">text</H1>
      <H2 UNSAFE_marginBottom="calc(1.75rem * .5)">text</H2>
      <H3 UNSAFE_marginBottom="calc(1.75rem * .5)">text</H3>
      <H4 UNSAFE_marginBottom="calc(1.75rem * .5)">text</H4>
      <H5 UNSAFE_marginBottom="calc(1.75rem * .5)">text</H5>
      <H6 UNSAFE_marginBottom="calc(1.75rem * .5)">text</H6>
      <HtmlH1 padding="core_400">text</HtmlH1>
      <HtmlH2 padding="core_400">text</HtmlH2>
      <HtmlH3 padding="core_400">text</HtmlH3>
      <HtmlH4 padding="core_400">text</HtmlH4>
      <HtmlH5 padding="core_400">text</HtmlH5>
      <HtmlH6 padding="core_400">text</HtmlH6>
      <Text size="xs" slot="ff">
        text
      </Text>
      <Content padding="core_400" slot="sample">
        text
      </Content>
      <Footer padding="core_400" slot="sample">
        text
      </Footer>
      <Header padding="core_400" slot="sample">
        text
      </Header>
      <A padding="core_400">text</A>
      <Address padding="core_400">text</Address>
      <Article padding="core_400">text</Article>
      <Aside color="neutral-weak">text</Aside>
      <HtmlButton border="core_rock-900" UNSAFE_padding="1" type="button">
        text
      </HtmlButton>
      <Div padding="core_400">text</Div>
      <HtmlFooter padding="core_400">text</HtmlFooter>
      <HtmlHeader padding="core_400">text</HtmlHeader>
      <Img border="core_rock-400" src="Planet" />
      <HtmlInput type="email">text</HtmlInput>
      <HtmlForm
        aria-label="test"
        data-testId="test"
        min-width="100vdh"/* Migration TODO: It seems it is an invalid property. Remove it if not needed */
      ></HtmlForm>
      <Nav flexWrap={"revert-layer"}>
        <UL color="neutral-weak" marginLeft={"revert"}>
          <LI color="core_sapphire-600">Colonize</LI>
        </UL>
        <OL color="neutral-weak">
          <LI color="core_sapphire-600" backgroundColor="core_amanita-400">
            Colonize
          </LI>
        </OL>
      </Nav>
      <Main padding="core_400">text</Main>
      <Nav padding="core_400">text</Nav>
      <HtmlSection padding="core_400">text</HtmlSection>
      <Span padding="core_400">text</Span>
      <Table cellPadding={5} color="neutral-weak" padding="core_400">
        <THead fontWeight="core_680" padding="core_400">
          <TR padding="core_400">
            <TH textAlign="left" padding="core_400">
              Company
            </TH>
          </TR>
        </THead>
        <TBody padding="core_400">
          <TR padding="core_400">
            <TD padding="core_400">Space</TD>
          </TR>
        </TBody>
        <TFoot padding="core_400"></TFoot>
      </Table>
      <Button
        isFluid={variable ? true : false}
        isLoading={false}
        onPress={() => alert("Button clicked!")}
        inherit/* Migration TODO: `inherit` is not supported anymore. Remove it. */
        size="md"
        isDisabled
      >
        text
        /* Migration TODO: `Counter` is not supported anymore. You need to find an alternative. */
        <Counter variant="divider">60</Counter>
      </Button>
      <Button variant="ghost-secondary"/* Migration TODO: `tertiary` is not supported anymore. `ghost-secondary` is the closest one, but you can also consider `ghost-primary` or `ghost-danger`. */>text</Button>
      <Button variant="danger">text</Button>
      /* Migration TODO: If the link is external, you need to set `isExternal` property accordingly. It opens the url in a new tab. But if you need a full page reload instead of client-side routing, follow this: https://workleap.atlassian.net/wiki/spaces/~62b0cfb467dff38e0986a1c1/pages/5413634146/29+May+2025+Hopper+migration+feedback */
      <LinkButton
        isFluid={variable ? true : false}
        loading={false}/* Migration TODO: `loading` is not supported anymore. Remove it. */
        onPress={() => alert("Button clicked!")}
        inherit/* Migration TODO: `inherit` is not supported anymore. Remove it. */
        size="md"
        isDisabled
        href="https://example.com"
        rel="noopener noreferrer"
        download
        referrerPolicy="origin-when-cross-origin">
        text
      </LinkButton>
      /* Migration TODO: If the link is external, you need to set `isExternal` property accordingly. It opens the url in a new tab. But if you need a full page reload instead of client-side routing, follow this: https://workleap.atlassian.net/wiki/spaces/~62b0cfb467dff38e0986a1c1/pages/5413634146/29+May+2025+Hopper+migration+feedback */
      <LinkButton
        variant="ghost-secondary"/* Migration TODO: `tertiary` is not supported anymore. `ghost-secondary` is the closest one, but you can also consider `ghost-primary` or `ghost-danger`. */>text</LinkButton>
      /* Migration TODO: If the link is external, you need to set `isExternal` property accordingly. It opens the url in a new tab. But if you need a full page reload instead of client-side routing, follow this: https://workleap.atlassian.net/wiki/spaces/~62b0cfb467dff38e0986a1c1/pages/5413634146/29+May+2025+Hopper+migration+feedback */
      <LinkButton variant="danger">text</LinkButton>
      <ButtonGroup inline/* Migration TODO: `inline` is not supported anymore. Remove it. */ reverse/* Migration TODO: `reverse` is not supported anymore. Remove it. */ size={{ base: "sm", xl: "md" }} wrap={false}>
        <Button>text</Button>
      </ButtonGroup>
      <Tile
        id="x"
        isSelected
        defaultSelected
        defaultValue="y"/* Migration TODO: Remove the `defaultValue` property, read this: https://hopper.workleap.design/components/Tile#migration-notes */
        orientation="horizontal"/* Migration TODO: Remove the `orientation` property, read this: https://hopper.workleap.design/components/Tile#migration-notes */
        onPress={() => {
          alert(1);
        }}
        type="reset"
        cursorHover="nw-resize"
      >
        text
      </Tile>
      /* Migration TODO: `TileLink` is not supported yet. You can follow this to implement one: https://dev.azure.com/sharegate/ShareGate.One/_git/ShareGate.One?path=/src/frontend/client/src/components/TileLink/TileLink.tsx&version=GBmain&_a=contents  */
      <TileLink
        href="https://example.com"
        external
        target="ample"
        defaultChecked
        defaultValue="y"
        orientation="horizontal"
        onClick={() => {
          alert(1);
        }}
        type="reset"
        cursorHover="nw-resize">
        text
      </TileLink>
      <TileGroup
        alignItems="start"
        selectionMode={undefined}
        onSelectionChange={() => {}}
        reverse/* Migration TODO: Remove the `reverse` property, read this: https://hopper.workleap.design/components/TileGroup#migration-notes */
        value={["10"]}/* Migration TODO: Remove the `value` property, read this: https://hopper.workleap.design/components/TileGroup#migration-notes */
        inline/* Migration TODO: Remove the `inline` property, read this: https://hopper.workleap.design/components/TileGroup#migration-notes */
        autoFocus/* Migration TODO: Remove the `autoFocus` property, read this: https://hopper.workleap.design/components/TileGroup#migration-notes */
        defaultChecked/* Migration TODO: Remove the `defaultChecked` property, read this: https://hopper.workleap.design/components/TileGroup#migration-notes */
        defaultValue={["12"]}/* Migration TODO: Remove the `defaultValue` property, read this: https://hopper.workleap.design/components/TileGroup#migration-notes */
        rowSize={3}/* Migration TODO: Remove the `rowSize` property, read this: https://hopper.workleap.design/components/TileGroup#migration-notes */
      >
        items
      </TileGroup>
      <Button
        isFluid={variable ? true : false}
        isLoading={false}
        onPress={() => alert("Button clicked!")}
        inherit/* Migration TODO: `inherit` is not supported anymore. Remove it. */
        size="2xs"/* Migration TODO: `xs` and `2xs` are not supported anymore. `sm` is the closest one. */
        isDisabled
        aria-label="Icon Button"
        active
      >
        <SparklesIcon />
      </Button>
      <Button variant="ghost-secondary"/* Migration TODO: `tertiary` is not supported anymore. `ghost-secondary` is the closest one, but you can also consider `ghost-primary` or `ghost-danger`. */ aria-label="Icon Button" size="xs"/* Migration TODO: `xs` and `2xs` are not supported anymore. `sm` is the closest one. */>
        <SparklesIcon />
      </Button>
      <Button variant="danger" aria-label="Icon Button" size="sm">
        <SparklesIcon />
      </Button>
      /* Migration TODO: If the link is external, you need to set `isExternal` property accordingly. It opens the url in a new tab. But if you need a full page reload instead of client-side routing, follow this: https://workleap.atlassian.net/wiki/spaces/~62b0cfb467dff38e0986a1c1/pages/5413634146/29+May+2025+Hopper+migration+feedback */
      <LinkButton
        isFluid={variable ? true : false}
        loading={false}/* Migration TODO: `loading` is not supported anymore. Remove it. */
        onPress={() => alert("Button clicked!")}
        inherit/* Migration TODO: `inherit` is not supported anymore. Remove it. */
        size="md"
        isDisabled
        href="https://example.com"
        rel="noopener noreferrer"
        download
        referrerPolicy="origin-when-cross-origin">
        <SparklesIcon />
      </LinkButton>
      /* Migration TODO: If the link is external, you need to set `isExternal` property accordingly. It opens the url in a new tab. But if you need a full page reload instead of client-side routing, follow this: https://workleap.atlassian.net/wiki/spaces/~62b0cfb467dff38e0986a1c1/pages/5413634146/29+May+2025+Hopper+migration+feedback */
      <LinkButton
        variant="ghost-secondary"/* Migration TODO: `tertiary` is not supported anymore. `ghost-secondary` is the closest one, but you can also consider `ghost-primary` or `ghost-danger`. */
        size="xs"/* Migration TODO: `xs` and `2xs` are not supported anymore. `sm` is the closest one. */>
        <SparklesIcon />
      </LinkButton>
      /* Migration TODO: If the link is external, you need to set `isExternal` property accordingly. It opens the url in a new tab. But if you need a full page reload instead of client-side routing, follow this: https://workleap.atlassian.net/wiki/spaces/~62b0cfb467dff38e0986a1c1/pages/5413634146/29+May+2025+Hopper+migration+feedback */
      <LinkButton
        variant="danger"
        size="2xs"/* Migration TODO: `xs` and `2xs` are not supported anymore. `sm` is the closest one. */>
        <SparklesIcon />
      </LinkButton>
      <CloseButton
        aria-label="Close"
        size="2xs"/* Migration TODO: `xs` and `2xs` are not supported anymore. `sm` is the closest one, but if you're using this icon for implementing `Callout` or `ContextualHelp`, Hopper has built-in support for these cases: https://hopper.workleap.design/components/Callout */
        inherit/* Migration TODO: `inherit` is not supported anymore. Remove it. */
        autoFocus
        onPress={() => {}}
      />
      {/* ------------------------------------------------------------------------------------------ */}
      <HopperDiv padding={"core_400"}>text</HopperDiv>
    </div>
  );
}

const ConditionalContent = ({ children, ...rest }: ContentProps) => {
  if (!children) {
    return null;
  }

  return <Content {...rest}>{children}</Content>;
};

interface PageProps extends HtmlH1Props {
  footerZIndex?: number;
}
