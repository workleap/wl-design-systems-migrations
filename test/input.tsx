import { Div as DivHopper } from "@hopper-ui/components";
import {
  A,
  Address,
  Article,
  Aside,
  Content,
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
  Main,
  Nav,
  OL,
  Paragraph,
  Span,
  Stack,
  Table,
  Text,
  TextInput,
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
      <Flex padding={variable}>text</Flex>
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
      <Flex padding={400} flexGrow={1} flexShrink={2} fluid flexFlow="row">
        text
      </Flex>

      <Grid padding={400}>text</Grid>
      <Grid autoRows="repeat(3, 1fr)">text</Grid>
      <Grid autoRows="min-content">text</Grid>
      <Grid autoColumns="repeat(3, 1fr)">text</Grid>
      <Grid autoColumns="auto">text</Grid>
      <Grid templateRows="repeat(3, 1fr)">text</Grid>
      <Grid templateRows="subgrid">text</Grid>
      <Grid templateColumns="repeat(3, 1fr)">text</Grid>
      <Grid templateColumns="subgrid">text</Grid>

      <Inline padding={400}>text</Inline>
      <Stack padding={400}>text</Stack>
      <Heading padding={400}>text</Heading>
      <H1 padding={400}>text</H1>
      <H2 padding={400}>text</H2>
      <H3 padding={400}>text</H3>
      <H4 padding={400}>text</H4>
      <H5 padding={400}>text</H5>
      <H6 padding={400}>text</H6>
      <HtmlH1 padding={400}>text</HtmlH1>
      <HtmlH2 padding={400}>text</HtmlH2>
      <HtmlH3 padding={400}>text</HtmlH3>
      <HtmlH4 padding={400}>text</HtmlH4>
      <HtmlH5 padding={400}>text</HtmlH5>
      <HtmlH6 padding={400}>text</HtmlH6>
      <Text padding={400}>text</Text>
      <Content padding={400}>text</Content>
      <Footer padding={400}>text</Footer>
      <Header padding={400}>text</Header>
      <A padding={400}>text</A>
      <Address padding={400}>text</Address>
      <Article padding={400}>text</Article>
      <Aside padding={400}>text</Aside>
      <HtmlButton padding={400}>text</HtmlButton>
      <Div padding={400}>text</Div>
      <HtmlFooter padding={400}>text</HtmlFooter>
      <HtmlHeader padding={400}>text</HtmlHeader>
      <Img padding={400}>text</Img>
      <HtmlInput padding={400}>text</HtmlInput>
      <UL padding={400}>text</UL>
      <OL padding={400}>text</OL>
      <LI padding={400}>text</LI>
      <Main padding={400}>text</Main>
      <Nav padding={400}>text</Nav>
      <HtmlSection padding={400}>text</HtmlSection>
      <Span padding={400}>text</Span>
      <Table padding={400}>text</Table>
      {/* ------------------------------------------------------------------------------------------ */}
      <DivHopper padding={"core_400"}>text</DivHopper>
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
