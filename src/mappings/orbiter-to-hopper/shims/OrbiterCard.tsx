import {
  ButtonContext,
  ButtonGroupContext,
  Card,
  ContentContext,
  Div,
  HeaderContext,
  HeadingContext,
  IllustrationContext,
  ImageContext,
  SlotProvider,
  useResponsiveValue,
  useSlot,
  type CardProps,
  type ResponsiveProp,
  type StyledSystemProps
} from "@hopper-ui/components";

const ClearContexts = [
  ImageContext,
  IllustrationContext,
  HeadingContext,
  HeaderContext,
  ContentContext,
  ButtonContext,
  ButtonGroupContext
];

export interface OrbiterCardProps extends CardProps {
  /**
   * Whether or not the card take up the width of its container.
   */
  fluid?: ResponsiveProp<boolean>;
  /**
   * The orientation of the card.
   */
  orientation?: ResponsiveProp<"horizontal" | "vertical">;
  /**
   * A card can vary in size.
   * @default "md";
   */
  size?: ResponsiveProp<"xs" | "sm" | "md" | "lg" | "xl">;
}

export const SizeToMaxWidth = {
  xs: "16rem",
  sm: "20rem",
  md: "30rem",
  lg: "35rem",
  xl: "40rem"
};

const baseAsideProps = (hasImage: boolean): StyledSystemProps => ({
  padding: "inset-lg",
  paddingTop: hasImage ? "inset-md" : "inset-lg"
});

const horizontalAsideProps: StyledSystemProps = {
  alignContent: "start"
};

const verticalAsideProps: StyledSystemProps = {
  display: "flex",
  flexDirection: "column",
  alignSelf: "stretch",
  gridColumnStart: 1,
  gridColumnEnd: 3
};

const baseImageAndIllustrationProps: StyledSystemProps = {
  gridArea: "image",
  overflow: "hidden"
};

const horizontalImageAndIllustrationProps: StyledSystemProps = {
  borderBottomLeftRadius: "inherit",
  borderTopLeftRadius: "inherit",
  UNSAFE_width: "8rem"
};

const verticalImageAndIllustrationProps: StyledSystemProps = {
  UNSAFE_height: "8rem",
  gridColumnStart: 1,
  gridColumnEnd: 3,
  width: "100%",
  borderTopRightRadius: "inherit",
  borderTopLeftRadius: "inherit"
};

const horizontalIllustrationProps: StyledSystemProps = {
  height: "auto",
  alignSelf: "stretch"
};

const horizontalCardProps: StyledSystemProps = {
  gridTemplateAreas: ["image aside"],
  alignItems: "start",
  UNSAFE_gridTemplateColumns: ["max-content auto"]
};

const verticalCardProps: StyledSystemProps = {
  gridTemplateAreas: ["image", "aside"],
  UNSAFE_gridTemplateColumns: "auto",
  UNSAFE_gridTemplateRows: "1fr"
};

export function OrbiterCard(props: OrbiterCardProps) {
  const {
    fluid: fluidProp,
    size: sizeProp,
    orientation: orientationProp,
    children,
    ...otherProps
  } = props;

  const [imageRef, hasImage] = useSlot();

  const fluid = useResponsiveValue(fluidProp);

  const size = useResponsiveValue(sizeProp) || "md";
  const maxWidth: string = SizeToMaxWidth[size];

  const orientation = useResponsiveValue(orientationProp) || "vertical";

  let cardProps: StyledSystemProps = {};
  let asideProps: StyledSystemProps = {};
  let imageAndIllustrationProps: StyledSystemProps = {};
  let illustrationProps: StyledSystemProps = {};

  if (orientation === "horizontal") {
    cardProps = horizontalCardProps;

    asideProps = {
      ...baseAsideProps(hasImage),
      ...horizontalAsideProps
    };

    imageAndIllustrationProps = {
      ...baseImageAndIllustrationProps,
      ...horizontalImageAndIllustrationProps
    };

    illustrationProps = horizontalIllustrationProps;
  } else {
    cardProps = verticalCardProps;

    asideProps = {
      ...baseAsideProps(hasImage),
      ...verticalAsideProps
    };

    imageAndIllustrationProps = {
      ...baseImageAndIllustrationProps,
      ...verticalImageAndIllustrationProps
    };
  }

  return (
    <Card
      display="grid"
      width="100%"
      UNSAFE_maxWidth={!fluid ? maxWidth : undefined}
      {...cardProps}
      {...otherProps}
    >
      {/* IMAGE */}
      <SlotProvider
        values={[
          [
            ImageContext,
            {
              ref: imageRef,
              clearContexts: ClearContexts,
              alignSelf: "stretch",
              objectFit: "cover",
              objectPosition: "center center",
              height: "100%",
              ...imageAndIllustrationProps
            }
          ],
          [
            IllustrationContext,
            {
              ref: imageRef,
              clearContexts: ClearContexts,
              orientation:
                orientation === "horizontal" ? "vertical" : "horizontal",
              ...imageAndIllustrationProps,
              ...illustrationProps
            }
          ],
          [HeadingContext, { isHidden: true }],
          [HeaderContext, { isHidden: true }],
          [ContentContext, { isHidden: true }],
          [ButtonContext, { isHidden: true }],
          [ButtonGroupContext, { isHidden: true }]
        ]}
      >
        {children}
      </SlotProvider>

      {/* ASIDE */}
      <Div gridArea="aside" {...asideProps}>
        {/* Top header: heading, header */}
        <Div
          display="flex"
          flexWrap="wrap"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="stack-md"
          columnGap="inline-md"
        >
          <SlotProvider
            values={[
              [ImageContext, { isHidden: true }],
              [IllustrationContext, { isHidden: true }],
              [
                HeadingContext,
                {
                  clearContexts: ClearContexts,
                  marginBottom: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "inline-sm"
                }
              ],
              [
                HeaderContext,
                {
                  clearContexts: ClearContexts,
                  display: "flex",
                  alignItems: "center",
                  justifySelf: "end",
                  flexShrink: 0,
                  UNSAFE_maxWidth: "200px",
                  width: "max-content"
                }
              ],
              [ContentContext, { isHidden: true }],
              [ButtonContext, { isHidden: true }],
              [ButtonGroupContext, { isHidden: true }]
            ]}
          >
            {children}
          </SlotProvider>
        </Div>

        {/* Content */}
        <Div>
          <SlotProvider
            values={[
              [ImageContext, { isHidden: true }],
              [IllustrationContext, { isHidden: true }],
              [HeadingContext, { isHidden: true }],
              [HeaderContext, { isHidden: true }],
              [ContentContext, { clearContexts: ClearContexts }],
              [ButtonContext, { isHidden: true }],
              [ButtonGroupContext, { isHidden: true }]
            ]}
          >
            {children}
          </SlotProvider>
        </Div>

        {/* Footer: button or buttonGroup */}
        <Div display="flex" marginTop="auto">
          <SlotProvider
            values={[
              [ImageContext, { isHidden: true }],
              [IllustrationContext, { isHidden: true }],
              [HeadingContext, { isHidden: true }],
              [HeaderContext, { isHidden: true }],
              [ContentContext, { isHidden: true }],
              [
                ButtonContext,
                {
                  marginTop: "stack-md",
                  clearContexts: ClearContexts
                }
              ],
              [
                ButtonGroupContext,
                {
                  marginTop: "stack-md",
                  clearContexts: ClearContexts
                }
              ]
            ]}
          >
            {children}
          </SlotProvider>
        </Div>
      </Div>
    </Card>
  );
}
