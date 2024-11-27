import { TextFieldFormElement } from "@/components/fields/TextField";
import { TitleFieldFormElement } from "@/components/fields/TitleField";
import {SubTitleFieldFormElement} from "@/components/fields/SubTitleField"
import {ParagraphFieldFormElement} from "@/components/fields/ParagraphField";
import {SeparatorFieldFormElement} from "@/components/fields/SeparatorField";
import {SpacerFieldFormElement} from "@/components/fields/SpacerField";
import {NumberFieldFormElement} from "@/components/fields/NumberField";
import {TextareaFieldFormField} from "@/components/fields/TextareaField";
import {TimePickerFormElement} from "@/components/fields/TimePickerField";
import {BackgroundElementFormElement} from "@/components/fields/BackgroundElementField";
import {ButtonFieldFormElement} from "@/components/fields/ButtonField";
import {DateFieldFormElement} from "@/components/fields/DatePickerField"
import {SelectFieldFormElement} from "@/components/fields/SelectField"
import {RadioButtonFieldFormElement} from "@/components/fields/RadioButtonField";
import {CheckboxFieldFormElement} from "@/components/fields/CheckboxElement";
import {SliderFieldFormElement} from "@/components/fields/SliderField";
import { SwitchFieldFormElement } from "@/components/fields/SwitchField";
import {FormBGElementFormElement} from "@/components/fields/FormBGField";
export type ElementsType = "TextField" | "TitleField" | "SubTitleField" | "ParagraphField" | "SeparatorField" | "SpacerField" | "NumberField" | "TextareaField" | "BackgroundElement" | "FormBG" | "ButtonField" | "DateField" | "TimeField" | "SelectField" | "RadioButtonField" | "CheckboxField" | "SliderField" | "SwitchField";

export type FormElement = {
    type: ElementsType;

    construct: (id: string) => FormElementInstance;

    designerBtnElement: {
        icon: React.ElementType;
        label: string | null;
    };

    designerComponent: React.FC<{
        elementInstance: FormElementInstance
    }>;
    formComponent: React.FC<{
        elementInstance: FormElementInstance
    }>;
    propertiesComponent: React.FC<{
        elementInstance: FormElementInstance
    }>;
};

export type FormElementInstance = {
    id: string;
    type: ElementsType;
    extraAttributes?: Record<string, any>;
};

type FormElementsType = {
    [key in ElementsType]: FormElement;
};

export const FormElements: FormElementsType = {
    TextField: TextFieldFormElement,
    TitleField: TitleFieldFormElement,
    SubTitleField: SubTitleFieldFormElement,
    ParagraphField: ParagraphFieldFormElement,
    SeparatorField: SeparatorFieldFormElement,
    SpacerField: SpacerFieldFormElement,
    NumberField: NumberFieldFormElement,
    TextareaField: TextareaFieldFormField,
    BackgroundElement: BackgroundElementFormElement,
    ButtonField: ButtonFieldFormElement,
    DateField: DateFieldFormElement,
    TimeField: TimePickerFormElement,
    SelectField: SelectFieldFormElement,
    RadioButtonField: RadioButtonFieldFormElement,
    CheckboxField: CheckboxFieldFormElement,
    SliderField: SliderFieldFormElement,
    SwitchField: SwitchFieldFormElement,
    FormBG: FormBGElementFormElement,
};