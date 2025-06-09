// prettier-ignore
import {
  Div as HopperDiv
} from "@hopper-ui/components";
import { SparklesIcon } from "@hopper-ui/icons";
import {
  A,
  Address,
  Article,
  Aside,
  Button,
  ButtonAsLink,
  ButtonGroup,
  Content,
  Counter,
  CrossButton,
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
  IconButton,
  IconButtonAsLink,
  Img,
  Inline,
  LI,
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
  ToggleButton,
  ToggleIconButton,
  TR,
  UL,
  useAccordionContext,
  type ContentProps,
} from "@workleap/orbiter-ui";

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
      <Stack gap={0} rowGap={0} columnGap={"0"}>
        text
      </Stack>
      <Inline gap={"0"} rowGap="0" columnGap={"0"}>
        text
      </Inline>
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
      <Flex padding={variable}>text</Flex>
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
      <Div padding={{ base: "0", md: "inset-sm", xl: "20rem" }} />
      <Div padding={{ base: "0", md: "inset-sm", xl: "inset-squish-sm" }} />
      <Div
        padding={{ base: "0", md: "inset-sm", xl: expandedKeys ? "s" : "f" }}
      />
      <Div padding={{}} />
      <Div justifyContent={{ base: "space-between", md: "initial" }} />
      <Div justifyContent={{ base: "space-between", md: "invalid" }} />
      <Div display={{ base: "none", md: "block" }} />
      <Flex
        {...rest}
        borderRadius={{ base: 0, xs: 2 }}
        width={{ base: "100%", xs: "488px" }}
      />
      {/* ------------------------------------------------------------------------------------------ */}
      {/* Components ------------------------------------------------------------------------------- */}
      {/* ------------------------------------------------------------------------------------------ */}
      <Flex
        padding={400}
        flexGrow={1}
        flexShrink={2}
        fluid={1 == 1 ? true : true}
        flexFlow="row"
        basis={"invalid"}
      >
        text
      </Flex>
      <Flex fluid width="120%">
        text
      </Flex>
      <Flex fluid={true}>text</Flex>
      <Flex fluid={false}>text</Flex>

      <Flex reverse>text</Flex>

      <Grid padding={400}>text</Grid>
      <Grid autoRows="repeat(3, 1fr)">text</Grid>
      <Grid autoRows="min-content">text</Grid>
      <Grid autoColumns="repeat(3, 1fr)">text</Grid>
      <Grid autoColumns="auto">text</Grid>
      <Grid templateRows="repeat(3, 1fr)">text</Grid>
      <Grid templateRows="subgrid">text</Grid>
      <Grid templateColumns="repeat(3, 1fr)">text</Grid>
      <Grid templateColumns="subgrid">text</Grid>

      <Inline>text</Inline>
      <Inline gap={400}>text</Inline>
      <Inline gap={"invalid"}>text</Inline>
      <Inline fluid={true}>text</Inline>
      <Inline fluid={false}>text</Inline>
      <Stack padding={400}>text</Stack>

      <Heading>text</Heading>
      <Heading size="xs">text</Heading>
      <Heading margin={0}>text</Heading>
      <Heading marginBottom={"inline-md"}>text</Heading>
      <Heading size="3xl" marginBottom={"inline-md"}>
        text
      </Heading>
      <H1 size="lg">text</H1>
      <H2>text</H2>
      <H3>text</H3>
      <H4>text</H4>
      <H5>text</H5>
      <H6>text</H6>
      <HtmlH1 padding={400}>text</HtmlH1>
      <HtmlH2 padding={400}>text</HtmlH2>
      <HtmlH3 padding={400}>text</HtmlH3>
      <HtmlH4 padding={400}>text</HtmlH4>
      <HtmlH5 padding={400}>text</HtmlH5>
      <HtmlH6 padding={400}>text</HtmlH6>
      <Text size="xs" slot="ff">
        text
      </Text>
      <Content padding={400} slot="sample">
        text
      </Content>
      <Footer padding={400} slot="sample">
        text
      </Footer>
      <Header padding={400} slot="sample">
        text
      </Header>
      <A padding={400}>text</A>
      <Address padding={400}>text</Address>
      <Article padding={400}>text</Article>
      <Aside color="neutral-weak">text</Aside>
      <HtmlButton border="rock-900" padding="1" type="button">
        text
      </HtmlButton>
      <Div padding={400}>text</Div>
      <HtmlFooter padding={400}>text</HtmlFooter>
      <HtmlHeader padding={400}>text</HtmlHeader>
      <Img border="rock-400" src="Planet" />
      <HtmlInput type="email">text</HtmlInput>
      <HtmlForm
        aria-label="test"
        data-testId="test"
        min-width="100vdh"
      ></HtmlForm>

      <Nav flexWrap={"revert-layer"}>
        <UL color="neutral-weak" marginLeft={"revert"}>
          <LI color="sapphire-600">Colonize</LI>
        </UL>
        <OL color="neutral-weak">
          <LI color="sapphire-600" backgroundColor={"amanita-400"}>
            Colonize
          </LI>
        </OL>
      </Nav>
      <Main padding={400}>text</Main>
      <Nav padding={400}>text</Nav>
      <HtmlSection padding={400}>text</HtmlSection>
      <Span padding={400}>text</Span>

      <Table cellPadding={5} color="neutral-weak" padding={400}>
        <THead fontWeight={680} padding={400}>
          <TR padding={400}>
            <TH textAlign="left" padding={400}>
              Company
            </TH>
          </TR>
        </THead>
        <TBody padding={400}>
          <TR padding={400}>
            <TD padding={400}>Space</TD>
          </TR>
        </TBody>
        <TFoot padding={400}></TFoot>
      </Table>

      <Button
        fluid={variable ? true : false}
        loading={false}
        onClick={() => alert("Button clicked!")}
        inherit
        size="md"
        disabled
        active
        focus
        hover
      >
        text
        <Counter variant="divider">60</Counter>
      </Button>
      <Button variant="tertiary">text</Button>
      <Button variant="negative">text</Button>

      <ButtonAsLink
        fluid={variable ? true : false}
        loading={false}
        onClick={() => alert("Button clicked!")}
        inherit
        size="md"
        disabled
        href="https://example.com"
        rel="noopener noreferrer"
        download
        referrerPolicy="origin-when-cross-origin"
      >
        text
      </ButtonAsLink>
      <ButtonAsLink variant="tertiary">text</ButtonAsLink>
      <ButtonAsLink variant="negative">text</ButtonAsLink>

      <ButtonGroup inline reverse size={{ base: "sm", xl: "md" }} wrap={false}>
        <Button>text</Button>
      </ButtonGroup>

      <Tile
        value="x"
        checked
        defaultChecked
        defaultValue="y"
        orientation="horizontal"
        onClick={() => {
          alert(1);
        }}
        type="reset"
        cursorHover="nw-resize"
      >
        text
      </Tile>

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
        cursorHover="nw-resize"
      >
        text
      </TileLink>

      <TileGroup
        align="start"
        selectionMode="none"
        onChange={() => {}}
        reverse
        value={["10"]}
        inline
        autoFocus
        defaultChecked
        defaultValue={["12"]}
        rowSize={3}
      >
        items
      </TileGroup>

      <IconButton
        fluid={variable ? true : false}
        loading={false}
        onClick={() => alert("Button clicked!")}
        inherit
        size="2xs"
        disabled
        aria-label="Icon Button"
      >
        <SparklesIcon />
      </IconButton>
      <IconButton variant="tertiary" aria-label="Icon Button" size="xs">
        <SparklesIcon />
      </IconButton>
      <IconButton variant="negative" aria-label="Icon Button" size="sm">
        <SparklesIcon />
      </IconButton>

      <IconButtonAsLink
        fluid={variable ? true : false}
        loading={false}
        onClick={() => alert("Button clicked!")}
        inherit
        size="md"
        disabled
        href="https://example.com"
        rel="noopener noreferrer"
        download
        referrerPolicy="origin-when-cross-origin"
      >
        <SparklesIcon />
      </IconButtonAsLink>
      <IconButtonAsLink variant="tertiary" size="xs">
        <SparklesIcon />
      </IconButtonAsLink>
      <IconButtonAsLink variant="negative" size="2xs">
        <SparklesIcon />
      </IconButtonAsLink>

      <CrossButton
        aria-label="Close"
        size="2xs"
        inherit
        autoFocus
        onClick={() => {}}
      />

      <ToggleButton
        fluid={variable ? true : false}
        loading={false}
        onClick={() => alert("Button clicked!")}
        onChange={() => {}}
        inherit
        size="md"
        disabled
        checked={false}
        defaultChecked={true}
        value="test"
      >
        text
      </ToggleButton>
      <ToggleButton variant="tertiary">text</ToggleButton>
      <ToggleButton variant="upsell">text</ToggleButton>
      <ToggleButton variant="primary">text</ToggleButton>
      <ToggleButton variant="secondary">text</ToggleButton>

      <ToggleIconButton
        fluid={variable ? true : false}
        loading={false}
        onClick={() => alert("Button clicked!")}
        inherit
        size="2xs"
        disabled
        aria-label="Icon Button"
      >
        <SparklesIcon />
      </ToggleIconButton>
      <ToggleIconButton variant="tertiary" aria-label="Icon Button" size="xs">
        <SparklesIcon />
      </ToggleIconButton>
      <ToggleIconButton variant="secondary" aria-label="Icon Button" size="sm">
        <SparklesIcon />
      </ToggleIconButton>      
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
