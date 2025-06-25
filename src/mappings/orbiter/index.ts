import {
  getMappingKeys,
  type MapMetaData,
  type PropsMapping
} from "../../utils/types.ts";
import { buttonComponentsMappings } from "./button-components-mappings.ts";
import { itemMapping } from "./components/item.ts";
import { sectionMapping } from "./components/section.ts";
import { disclosureComponentsMappings } from "./disclosure-components-mappings.ts";
import { layoutComponentsMappings } from "./layout-components-mappings.ts";
import { menuComponentsMappings } from "./menu-components-mappings.ts";
import { overlayComponentsMappings } from "./overlay-components-mappings.ts";
import { styledSystemPropsMappings } from "./styled-system/mappings.ts";
import { tagComponentsMappings } from "./tags-components-mappings.ts";
import { visualComponentsMappings } from "./visual-components-mappings.ts";

const defaultPropsMappings = {
  ...styledSystemPropsMappings,
  disabled: "isDisabled",
  readOnly: "isReadOnly",
  "min-width": originalValue => ({
    to: "min-width",
    value: originalValue,
    todoComments: "It seems it is an invalid property. Remove it if it is not needed"
  }),
  active: () => ({
    todoComments: "`active` is not supported anymore. Find an alternative solution. If the use case is to implement the toggle status, you can use the ToggleButton. More details: https://hopper.workleap.design/components/ToggleButton"
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
  categories: {
    layout: getMappingKeys(layoutComponentsMappings),
    buttons: getMappingKeys(buttonComponentsMappings),
    visual: getMappingKeys(visualComponentsMappings),
    menu: getMappingKeys(menuComponentsMappings),
    overlay: getMappingKeys(overlayComponentsMappings),
    tags: getMappingKeys(tagComponentsMappings),
    disclosure: getMappingKeys(disclosureComponentsMappings)
  },
  components: {
    ...layoutComponentsMappings,
    ...buttonComponentsMappings,
    ...visualComponentsMappings,
    ...overlayComponentsMappings,
    ...menuComponentsMappings,
    ...sectionMapping,
    ...tagComponentsMappings,
    ...disclosureComponentsMappings,
    ...itemMapping//Note: it should be the last item to have all parents migrated first
  }
} satisfies MapMetaData;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const todo = {
  

  //layout & containers - total usage: 64
  Card: "Card", //usage: 16
  CardProps: "CardProps",
  // TODO: Not a direct mapping. Find the appropriate component/type.
  // Box: "Box", //usage: 7
  // BoxProps: "BoxProps",
  // Group: "Group", //usage: 1
  // GroupProps: "GroupProps",


  //messaging & feedback - total usage: 19
  Alert: "Alert", //usage: 9
  AlertProps: "AlertProps",
  AlertTrigger: "AlertTrigger", //usage: 10
  AlertTriggerProps: "AlertTriggerProps",


  //toolbar & utilities - total usage: 33
  ThemeProvider: "HopperProvider", //usage: 30
  ThemeProviderProps: "HopperProviderProps",
  // TODO: Not a direct mapping. Find the appropriate component/type.
  // Toolbar: "Toolbar",
  // ToolbarProps: "ToolbarProps",
  // Transition: "Transition", //usage: 2
  // TransitionProps: "TransitionProps",


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
  InputGroupProps: "InputGroupProps"
  // TODO: Not a direct mapping. Find the appropriate component/type.
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
};
