import type {
  MapMetaData,
  PropsMapping
} from "../utils/types.ts";
import { buttonComponentsMappings } from "./button-components-mappings.ts";
import { layoutComponentsMappings } from "./layout-components-mappings.ts";
import { styledSystemPropsMappings } from "./styled-system/mappings.ts";

const defaultPropsMappings = {
  ...styledSystemPropsMappings,
  disabled: "isDisabled",
  readOnly: "isReadOnly",
  "min-width": originalValue => ({
    to: "min-width",
    value: originalValue,
    todoComments: "It seems it is an invalid property. Remove it if not needed"
  }),
  active: () => ({
    todoComments: "`active` is not supported anymore. Find an alternative solution"
  }),
  focus: () => ({
    todoComments: "`focus` is not supported anymore. Find an alternative solution"
  }),
  hover: () => ({
    todoComments: "`hover` is not supported anymore. Find an alternative solution"
  })
} satisfies PropsMapping;

export const mappings = {
  sourcePackage: "@workleap/orbiter-ui",
  targetPackage: "@hopper-ui/components",
  propsDefaults: {
    mappings: defaultPropsMappings
  },
  components: {
    ...layoutComponentsMappings,
    ...buttonComponentsMappings

    //TODO: move items from todo list here when they are implemented
  }
} satisfies MapMetaData;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const todo = {
  //form fields - total usage: 777
  TextInput: "TextField", //usage: 111
  TextInputProps: "TextFieldProps",
  TextArea: "TextArea", //usage: 14
  TextAreaProps: "TextAreaProps",
  PasswordInput: "PasswordField", //usage: 7
  PasswordInputProps: "PasswordFieldProps",
  SearchInput: "SearchField", //usage: 24
  SearchInputProps: "SearchFieldProps",
  NumberInput: "NumberField", //usage: 8
  NumberInputProps: "NumberFieldProps",
  Checkbox: "Checkbox", //usage: 27
  CheckboxProps: "CheckboxProps",
  CheckboxGroup: "CheckboxGroup", //usage: 9
  CheckboxGroupProps: "CheckboxGroupProps",
  Radio: "Radio", //usage: 29
  RadioProps: "RadioProps",
  RadioGroup: "RadioGroup", //usage: 14
  RadioGroupProps: "RadioGroupProps",
  Switch: "Switch", //usage: 31
  SwitchProps: "SwitchProps",
  Select: "Select", //usage: 40
  SelectProps: "SelectProps",
  Autocomplete: "ComboBox", //usage: 11
  AutocompleteProps: "ComboBoxProps",
  Label: "Label", //usage: 159
  LabelProps: "LabelProps",
  Form: "Form", //usage: 46
  FormProps: "FormProps",
  InputGroup: "InputGroup", //usage: 1
  InputGroupProps: "InputGroupProps",
  //TODO: Not direct map. Find appropriate component/type
  //HiddenSelect: "HiddenSelect",
  //HiddenSelectProps: "HiddenSelectProps",
  //HiddenAutocomplete: "HiddenAutocomplete",
  //HiddenAutocompleteProps: "HiddenAutocompleteProps",
  //DateInput: "DateInput", //usage: 4
  //DateInputProps: "DateInputProps",
  //DateRangeInput: "DateRangeInput",
  //DateRangeInputProps: "DateRangeInputProps",
  //Field: "Field", //usage: 172
  //FieldProps: "FieldProps",
  //GroupField: "GroupField", //usage: 2
  //GroupFieldProps: "GroupFieldProps",
  //HelpMessage: "HelperMessage", //usage: 9
  //HelpMessageProps: "HelperMessageProps",
  //ErrorMessage: "ErrorMessage", //usage: 71
  //ErrorMessageProps: "ErrorMessageProps",
  //ValidMessage: "HelperMessage", //usage: 4
  //ValidMessageProps: "HelperMessageProps",
  //Fieldset: "Fieldset", //usage: 3
  //FieldsetProps: "FieldsetProps",
  //TextAddon: "TextAddon",
  //TextAddonProps: "TextAddonProps",

  //navigation & links - total usage: 115
  Link: "Link", //usage: 13
  LinkProps: "LinkProps",
  TextLink: "Link", //usage: 63
  TextLinkProps: "LinkProps",
  //TODO: Not direct map. Find appropriate component/type
  // IconLink: "Link", //usage: 3
  // IconLinkProps: "LinkProps",
  // TextLinkAsButton: "LinkButton", //usage: 36
  // TextLinkAsButtonProps: "LinkButtonProps",
  // IconLinkAsButton: "LinkButton",
  // IconLinkAsButtonProps: "LinkButtonProps",

  //overlays & modals - total usage: 543
  Modal: "Modal", //usage: 95
  ModalProps: "ModalProps",
  ModalTrigger: "ModalTrigger", //usage: 48
  ModalTriggerProps: "ModalTriggerProps",
  Popover: "Popover", //usage: 11
  PopoverProps: "PopoverProps",
  PopoverTrigger: "PopoverTrigger", //usage: 12
  PopoverTriggerProps: "PopoverTriggerProps",
  Tooltip: "Tooltip", //usage: 142
  TooltipProps: "TooltipProps",
  TooltipTrigger: "TooltipTrigger", //usage: 161
  TooltipTriggerProps: "TooltipTriggerProps",
  //TODO: Not direct map. Find appropriate component/type
  // Dialog: "Modal",
  // DialogProps: "ModalProps",
  // DialogTrigger: "ModalTrigger",
  // DialogTriggerProps: "ModalTriggerProps",
  // Overlay: "Overlay", //usage: 74
  // OverlayProps: "OverlayProps",
  // OverlayArrow: "OverlayArrow",
  // OverlayArrowProps: "OverlayArrowProps",
  // Underlay: "Underlay", //usage: 1
  // UnderlayProps: "UnderlayProps",

  //menus & lists - total usage: 74
  Menu: "Menu", //usage: 31
  MenuProps: "MenuProps",
  MenuItem: "MenuItem", //usage: 0 (Item: 326)
  MenuItemProps: "MenuItemProps",
  MenuSection: "MenuSection", //usage: 0 (Section: 9)
  MenuSectionProps: "MenuSectionProps",
  MenuTrigger: "MenuTrigger", //usage: 32
  MenuTriggerProps: "MenuTriggerProps",
  //TODO: Not direct map. Find appropriate component/type
  // Listbox: "ListBox", //usage: 11
  // ListboxProps: "ListBoxProps",
  // ListboxSection: "ListBoxSection",
  // ListboxSectionProps: "ListBoxSectionProps",
  // ListboxOption: "ListBoxItem",
  // ListboxOptionProps: "ListBoxItemProps",

  //disclosure & accordion - total usage: 28
  Disclosure: "Disclosure", //usage: 7
  DisclosureProps: "DisclosureProps",
  Accordion: "Accordion", //usage: 3
  AccordionProps: "AccordionProps",
  //TODO: Not direct map. Find appropriate component/type
  // DisclosureArrow: "ToggleArrow", //usage: 18
  // DisclosureArrowProps: "ToggleArrowProps",
  // AccordionHeader: "DisclosureHeader",
  // AccordionHeaderProps: "DisclosureHeaderProps",
  // AccordionPanel: "DisclosurePanel",
  // AccordionPanelProps: "DisclosurePanelProps",

  //tabs - total usage: 18
  Tabs: "Tabs", //usage: 18
  TabsProps: "TabsProps",
  Tab: "Tab", //usage: 0
  TabProps: "TabProps",
  TabList: "TabList", //usage: 0
  TabListProps: "TabListProps",
  TabPanel: "TabPanel", //usage: 0
  TabPanelProps: "TabPanelProps",

  //layout & containers - total usage: 64
  Card: "Card", //usage: 16
  CardProps: "CardProps",
  Divider: "Divider", //usage: 40
  DividerProps: "DividerProps",
  //TODO: Not direct map. Find appropriate component/type
  // Box: "Box", //usage: 7
  // BoxProps: "BoxProps",
  // Group: "Group", //usage: 1
  // GroupProps: "GroupProps",

  //visual elements - total usage: 223
  Avatar: "Avatar", //usage: 67
  AvatarProps: "AvatarProps",
  AvatarGroup: "AvatarGroup", //usage: 8
  AvatarGroupProps: "AvatarGroupProps",
  DeletedAvatar: "DeletedAvatar", //usage: 13
  DeletedAvatarProps: "DeletedAvatarProps",
  AnonymousAvatar: "AnonymousAvatar", //usage: 2
  AnonymousAvatarProps: "AnonymousAvatarProps",
  Badge: "Badge", //usage: 0
  BadgeProps: "BadgeProps",
  Spinner: "Spinner", //usage: 43
  SpinnerProps: "SpinnerProps",

  //TODO: Not direct map. Find appropriate component/type
  // AvatarText: "AvatarText", //usage: 2
  // Counter: "Badge", //usage: 4
  // CounterProps: "BadgeProps",
  // Dot: "Dot", //usage: 1
  // DotProps: "DotProps",
  // Loader: "Spinner",
  // LoaderProps: "SpinnerProps",
  // Lozenge: "Badge", //usage: 90
  // LozengeProps: "BadgeProps",

  //media & illustration - total usage: 197
  Image: "Image", //usage: 15
  ImageProps: "ImageProps",
  SvgImage: "SvgImage", //usage: 133
  SvgImageProps: "SvgImageProps",
  IllustratedMessage: "IllustratedMessage", //usage: 29
  IllustratedMessageProps: "IllustratedMessageProps",
  IconList: "IconList", //usage: 0
  IconListProps: "IconListProps",
  //TODO: Not direct map. Find appropriate component/type
  // AsyncImage: "Image",
  // AsyncImageProps: "ImageProps",
  // Illustration: "Illustration", //usage: 49
  // IllustrationProps: "IllustrationProps",

  //messaging & feedback - total usage: 19
  Alert: "Alert", //usage: 9
  AlertProps: "AlertProps",
  AlertTrigger: "AlertTrigger", //usage: 10
  AlertTriggerProps: "AlertTriggerProps",

  //tags & tiles - total usage: 74
  Tag: "Tag", //usage: 64
  TagProps: "TagProps",
  TagList: "TagGroup", //usage: 6
  TagListProps: "TagGroupProps",
  //TODO: Not direct map. Find appropriate component/type
  // TileLink: "TileLink", //usage: 4
  // TileLinkProps: "TileLinkProps",

  //toolbar & utilities - total usage: 33
  ThemeProvider: "HopperProvider", //usage: 30
  ThemeProviderProps: "HopperProviderProps"
  //TODO: Not direct map. Find appropriate component/type
  // Toolbar: "Toolbar",
  // ToolbarProps: "ToolbarProps",
  // VisuallyHidden: "VisuallyHidden", //usage: 1
  // VisuallyHiddenProps: "VisuallyHiddenProps",
  // Transition: "Transition", //usage: 2
  // TransitionProps: "TransitionProps",

  //collection components - total usage: 335
  //TODO: Not direct map. Find appropriate component/type
  // Item: "Item", //usage: 326
  // ItemProps: "ItemProps",
  // Section: "Section", //usage: 9
  // SectionProps: "SectionProps",
};

//Notes:
/*
- Divider is probably not 1:1, depending on what property is used.
- Box will be a case by case basis. It's usually used to render a polymorphic component using the as props. We don't support that in hopper. It might be a case of manual migration for that one
- Label: probably we don't use Label component as field have their own label prop in Hopper
*/
