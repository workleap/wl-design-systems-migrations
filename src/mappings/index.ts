import { MapMetaData } from "../utils/types.ts";
import { layoutComponentsMappings } from "./layout-components-mappings.ts";
import { styledSystemPropsMappings } from "./styled-system/mappings.ts";

//it is a list of known props that are ignored in the migration
//but we keep them in the mappings so we can ignore reporting them as missing
const knownIgnoredProps = {
  "data-testid": "data-testid",
  "aria-label": "aria-label",
  "aria-labelledby": "aria-labelledby",
  "aria-describedby": "aria-describedby",
  "aria-disabled": "aria-disabled",
  "aria-busy": "aria-busy",
  "data-public": "data-public",
  "data-private": "data-private",
  className: "className",
  style: "style",
  key: "key",
  ref: "ref",
  slot: "slot",
};

const defaultPropsMappings = {
  ...knownIgnoredProps,
  ...styledSystemPropsMappings,
  disabled: "isDisabled",
  readOnly: "isReadOnly",
};

export const mappings = {
  sourcePackage: "@workleap/orbiter-ui",
  targetPackage: "@hopper-ui/components",
  propsDefaults: {
    mappings: defaultPropsMappings,
  },
  components: {
    ...layoutComponentsMappings,

    //TODO: move items from todo list here when they are implemented
  },
} satisfies MapMetaData;

const todo = {
  //form fields
  TextInput: "TextField",
  TextInputProps: "TextFieldProps",
  TextArea: "TextArea",
  TextAreaProps: "TextAreaProps",
  PasswordInput: "PasswordField",
  PasswordInputProps: "PasswordFieldProps",
  SearchInput: "SearchField",
  SearchInputProps: "SearchFieldProps",
  NumberInput: "NumberField",
  NumberInputProps: "NumberFieldProps",
  Checkbox: "Checkbox",
  CheckboxProps: "CheckboxProps",
  CheckboxGroup: "CheckboxGroup",
  CheckboxGroupProps: "CheckboxGroupProps",
  Radio: "Radio",
  RadioProps: "RadioProps",
  RadioGroup: "RadioGroup",
  RadioGroupProps: "RadioGroupProps",
  Switch: "Switch",
  SwitchProps: "SwitchProps",
  Select: "Select",
  SelectProps: "SelectProps",
  Autocomplete: "ComboBox",
  AutocompleteProps: "ComboBoxProps",
  Label: "Label",
  LabelProps: "LabelProps",
  Form: "Form",
  FormProps: "FormProps",
  InputGroup: "InputGroup",
  InputGroupProps: "InputGroupProps",
  //TODO: Not direct map. Find appropriate component/type
  //HiddenSelect: "HiddenSelect",
  //HiddenSelectProps: "HiddenSelectProps",
  //HiddenAutocomplete: "HiddenAutocomplete",
  //HiddenAutocompleteProps: "HiddenAutocompleteProps",
  //DateInput: "DateInput",
  //DateInputProps: "DateInputProps",
  //DateRangeInput: "DateRangeInput",
  //DateRangeInputProps: "DateRangeInputProps",
  //Field: "Field",
  //FieldProps: "FieldProps",
  //GroupField: "GroupField",
  //GroupFieldProps: "GroupFieldProps",
  //HelpMessage: "HelperMessage",
  //HelpMessageProps: "HelperMessageProps",
  //ErrorMessage: "ErrorMessage",
  //ErrorMessageProps: "ErrorMessageProps",
  //ValidMessage: "HelperMessage",
  //ValidMessageProps: "HelperMessageProps",
  //Fieldset: "Fieldset",
  //FieldsetProps: "FieldsetProps",
  //TextAddon: "TextAddon",
  //TextAddonProps: "TextAddonProps",

  //buttons
  Button: "Button",
  ButtonProps: "ButtonProps",
  ButtonGroup: "ButtonGroup",
  ButtonGroupProps: "ButtonGroupProps",
  //TODO: Not direct map. Find appropriate component/type
  // ButtonAsLink: "LinkButton",
  // ButtonAsLinkProps: "LinkButtonProps",
  // IconButton: "Button",
  // IconButtonProps: "ButtonProps",
  // IconButtonAsLink: "LinkButton",
  // IconButtonAsLinkProps: "LinkButtonProps",
  // ToggleButton: "Button",
  // ToggleButtonProps: "ButtonProps",
  // ToggleIconButton: "Button",
  // ToggleIconButtonProps: "ButtonProps",
  // CrossButton: "CloseButton",
  // CrossButtonProps: "CloseButtonProps",

  //navigation & links
  Link: "Link",
  LinkProps: "LinkProps",
  TextLink: "Link",
  TextLinkProps: "LinkProps",
  //TODO: Not direct map. Find appropriate component/type
  // TextLinkAsButton: "LinkButton",
  // TextLinkAsButtonProps: "LinkButtonProps",
  // IconLink: "Link",
  // IconLinkProps: "LinkProps",
  // IconLinkAsButton: "LinkButton",
  // IconLinkAsButtonProps: "LinkButtonProps",

  //overlays & modals
  Modal: "Modal",
  ModalProps: "ModalProps",
  ModalTrigger: "ModalTrigger",
  ModalTriggerProps: "ModalTriggerProps",
  Popover: "Popover",
  PopoverProps: "PopoverProps",
  PopoverTrigger: "PopoverTrigger",
  PopoverTriggerProps: "PopoverTriggerProps",
  Tooltip: "Tooltip",
  TooltipProps: "TooltipProps",
  TooltipTrigger: "TooltipTrigger",
  TooltipTriggerProps: "TooltipTriggerProps",
  //TODO: Not direct map. Find appropriate component/type
  // Dialog: "Modal",
  // DialogProps: "ModalProps",
  // DialogTrigger: "ModalTrigger",
  // DialogTriggerProps: "ModalTriggerProps",
  // Overlay: "Overlay",
  // OverlayProps: "OverlayProps",
  // OverlayArrow: "OverlayArrow",
  // OverlayArrowProps: "OverlayArrowProps",
  // Underlay: "Underlay",
  // UnderlayProps: "UnderlayProps",

  //menus & lists
  Menu: "Menu",
  MenuProps: "MenuProps",
  MenuItem: "MenuItem",
  MenuItemProps: "MenuItemProps",
  MenuSection: "MenuSection",
  MenuSectionProps: "MenuSectionProps",
  MenuTrigger: "MenuTrigger",
  MenuTriggerProps: "MenuTriggerProps",
  //TODO: Not direct map. Find appropriate component/type
  // Listbox: "ListBox",
  // ListboxProps: "ListBoxProps",
  // ListboxSection: "ListBoxSection",
  // ListboxSectionProps: "ListBoxSectionProps",
  // ListboxOption: "ListBoxItem",
  // ListboxOptionProps: "ListBoxItemProps",

  //disclosure & accordion
  Disclosure: "Disclosure",
  DisclosureProps: "DisclosureProps",
  Accordion: "Accordion",
  AccordionProps: "AccordionProps",
  //TODO: Not direct map. Find appropriate component/type
  // DisclosureArrow: "ToggleArrow",
  // DisclosureArrowProps: "ToggleArrowProps",
  // AccordionHeader: "DisclosureHeader",
  // AccordionHeaderProps: "DisclosureHeaderProps",
  // AccordionPanel: "DisclosurePanel",
  // AccordionPanelProps: "DisclosurePanelProps",

  //tabs
  Tabs: "Tabs",
  TabsProps: "TabsProps",
  Tab: "Tab",
  TabProps: "TabProps",
  TabList: "TabList",
  TabListProps: "TabListProps",
  TabPanel: "TabPanel",
  TabPanelProps: "TabPanelProps",

  //layout & containers
  Card: "Card",
  CardProps: "CardProps",
  Divider: "Divider",
  DividerProps: "DividerProps",
  //TODO: Not direct map. Find appropriate component/type
  // Box: "Box",
  // BoxProps: "BoxProps",
  // Group: "Group",
  // GroupProps: "GroupProps",

  //visual elements
  Avatar: "Avatar",
  AvatarProps: "AvatarProps",
  AvatarGroup: "AvatarGroup",
  AvatarGroupProps: "AvatarGroupProps",
  DeletedAvatar: "DeletedAvatar",
  DeletedAvatarProps: "DeletedAvatarProps",
  AnonymousAvatar: "AnonymousAvatar",
  AnonymousAvatarProps: "AnonymousAvatarProps",
  Badge: "Badge",
  BadgeProps: "BadgeProps",
  Spinner: "Spinner",
  SpinnerProps: "SpinnerProps",

  //TODO: Not direct map. Find appropriate component/type
  // AvatarText: "AvatarText",
  // Counter: "Badge",
  // CounterProps: "BadgeProps",
  // Dot: "Dot",
  // DotProps: "DotProps",
  // Loader: "Spinner",
  // LoaderProps: "SpinnerProps",
  // Lozenge: "Badge",
  // LozengeProps: "BadgeProps",

  //media & illustration
  Image: "Image",
  ImageProps: "ImageProps",
  SvgImage: "SvgImage",
  SvgImageProps: "SvgImageProps",
  IllustratedMessage: "IllustratedMessage",
  IllustratedMessageProps: "IllustratedMessageProps",
  IconList: "IconList",
  IconListProps: "IconListProps",
  //TODO: Not direct map. Find appropriate component/type
  // AsyncImage: "Image",
  // AsyncImageProps: "ImageProps",
  // Illustration: "Illustration",
  // IllustrationProps: "IllustrationProps",

  //messaging & feedback
  Alert: "Alert",
  AlertProps: "AlertProps",
  AlertTrigger: "AlertTrigger",
  AlertTriggerProps: "AlertTriggerProps",

  //tags & tiles
  Tag: "Tag",
  TagProps: "TagProps",
  TagList: "TagGroup",
  TagListProps: "TagGroupProps",
  Tile: "Tile",
  TileProps: "TileProps",
  TileGroup: "TileGroup",
  TileGroupProps: "TileGroupProps",
  //TODO: Not direct map. Find appropriate component/type
  // TileLink: "TileLink",
  // TileLinkProps: "TileLinkProps",

  //toolbar & utilities
  ThemeProvider: "HopperProvider",
  ThemeProviderProps: "HopperProviderProps",
  //TODO: Not direct map. Find appropriate component/type
  // Toolbar: "Toolbar",
  // ToolbarProps: "ToolbarProps",
  // VisuallyHidden: "VisuallyHidden",
  // VisuallyHiddenProps: "VisuallyHiddenProps",
  // Transition: "Transition",
  // TransitionProps: "TransitionProps",

  //collection components
  //TODO: Not direct map. Find appropriate component/type
  // Item: "Item",
  // ItemProps: "ItemProps",
  // Section: "Section",
  // SectionProps: "SectionProps",
};

//Notes:
/*
- Divider is probably not 1:1, depending on what property is used.
- Box will be a case by case basis. It's usually used to render a polymorphic component using the as props. We don't support that in hopper. It might be a case of manual migration for that one

*/
