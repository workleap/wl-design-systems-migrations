import type {
  MapMetaData
} from "../../utils/types.ts";


export const mappings = {
  sourcePackage: "@hopper-ui/components",
  targetPackage: "@hopper-ui/components",
  components: {
    // Layout
    Flex: "Flex",
    Grid: "Grid",
    Inline: "Inline",
    Stack: "Stack",
    
    // Buttons
    Button: "Button",
    ButtonGroup: "ButtonGroup",
    LinkButton: "LinkButton",
    SegmentedControl: "SegmentedControl",
    Tile: "Tile",
    TileGroup: "TileGroup",
    ToggleButton: "ToggleButton",
    
    // Collections
    ListBox: "ListBox",
    Menu: "Menu",
    TagGroup: "TagGroup",
    Tag: "Tag",
    
    // Date and time
    Calendar: "Calendar",
    RangeCalendar: "RangeCalendar",
    
    // Forms
    Checkbox: "Checkbox",
    CheckboxGroup: "CheckboxGroup",
    Form: "Form",
    NumberField: "NumberField",
    PasswordField: "PasswordField",
    RadioGroup: "RadioGroup",
    SearchField: "SearchField",
    Switch: "Switch",
    TextArea: "TextArea",
    TextField: "TextField",
    
    // Icons
    Icon: "Icon",
    IconList: "IconList",
    RichIcon: "RichIcon",
    
    // Navigation
    Accordion: "Accordion",
    Disclosure: "Disclosure",
    Link: "Link",
    Tabs: "Tabs",
    
    // Overlays
    Alert: "Alert",
    ContextualHelp: "ContextualHelp",
    Modal: "Modal",
    Popover: "Popover",
    Tooltip: "Tooltip",
    
    // Pickers
    ComboBox: "ComboBox",
    Select: "Select",
    
    // Status
    Badge: "Badge",
    Callout: "Callout",
    CompactCallout: "CompactCallout",
    FloatingBadge: "FloatingBadge",
    Spinner: "Spinner",
    
    // Content
    Avatar: "Avatar",
    Card: "Card",
    Divider: "Divider",
    Heading: "Heading",
    IllustratedMessage: "IllustratedMessage",
    Illustration: "Illustration",
    Image: "Image",
    Label: "Label",
    Paragraph: "Paragraph",
    Text: "Text",
    
    // Placeholders
    Content: "Content",
    Footer: "Footer",
    Header: "Header",
    
    // Building blocks
    Box: "Box",
    ErrorMessage: "ErrorMessage",
    HelperMessage: "HelperMessage",
    PopoverBase: "PopoverBase",
    
    // HTML elements
    A: "A",
    Address: "Address",
    Article: "Article",
    Aside: "Aside",
    Div: "Div",
    HtmlButton: "HtmlButton",
    HtmlFooter: "HtmlFooter",
    HtmlHeader: "HtmlHeader",
    HtmlInput: "HtmlInput",
    HtmlSection: "HtmlSection",
    Img: "Img",
    Main: "Main",
    Nav: "Nav",
    Span: "Span",
    Table: "Table",
    UL: "UL"
  }
} satisfies MapMetaData;

