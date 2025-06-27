import {
  getMappingKeys,
  type MapMetaData
} from "../../utils/types.ts";
import { buttonComponentsMappings } from "./button-components-mappings.ts";
import { itemMapping } from "./components/item.ts";
import { sectionMapping } from "./components/section.ts";
import { defaultPropsMappings } from "./default-props-mappings.ts";
import { disclosureComponentsMappings } from "./disclosure-components-mappings.ts";
import { layoutComponentsMappings } from "./layout-components-mappings.ts";
import { menuComponentsMappings } from "./menu-components-mappings.ts";
import { overlayComponentsMappings } from "./overlay-components-mappings.ts";
import { tagComponentsMappings } from "./tags-components-mappings.ts";
import { visualComponentsMappings } from "./visual-components-mappings.ts";

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
  ThemeProvider: "HopperProvider", //usage: 30
  ThemeProviderProps: "HopperProviderProps",

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

  // Not a direct mapping. Find the appropriate component/type:
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
