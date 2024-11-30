"use client";

import * as React from "react";
import { Radio } from "lucide-react";
import { ElementsType, FormElement, FormElementInstance } from "@/components/FormElements";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useDesigner from "@/hooks/useDesigner";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Button } from "../ui/button";

const type: ElementsType = "RadioButtonField";

type RadioOption = {
  label: string;
  value: string;
};

type RadioButtonFieldAttributes = {
  label: string;
  helperText: string;
  required: boolean;
  options: RadioOption[];
  direction: "row" | "column";
  styles: {
    borderColor: string;
    backgroundColor: string;
    textColor: string;
  };
};

const extraAttributes: RadioButtonFieldAttributes = {
  label: "Radio Button Group",
  helperText: "Select an option",
  required: false,
  options: [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
  ],
  direction: "column",
  styles: {
    borderColor: "#000000",
    backgroundColor: "#ffffff",
    textColor: "#000000",
  },
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  options: z.array(
    z.object({
      label: z.string().min(1).max(50),
      value: z.string().min(1).max(50),
    })
  ).min(1),
  direction: z.enum(["row", "column"]),
  styles: z.object({
    borderColor: z.string(),
    backgroundColor: z.string(),
    textColor: z.string(),
  }),
});

export const RadioButtonFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: Radio,
    label: "Radio Button",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
};

type CustomInstance = FormElementInstance & {
  extraAttributes: RadioButtonFieldAttributes;
};

function DesignerComponent({
  elementInstance
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { label, helperText, required, options, direction, styles } = element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label style={{ color: styles.textColor }}>
        {label}
        {required && "*"}
      </Label>
      <RadioGroup className={`flex gap-2 ${direction === "column" ? "flex-col" : "flex-row"}`}>
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={`radio-${element.id}-${index}`}
              style={{
                borderColor: styles.borderColor,
                backgroundColor: styles.backgroundColor,
              }}
            />
            <Label htmlFor={`radio-${element.id}-${index}`} style={{ color: styles.textColor }}>
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {helperText && <p className="text-muted-foreground text-[0.8rem]" style={{ color: styles.textColor }}>{helperText}</p>}
    </div>
  );
}

function FormComponent({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue,
}: {
  elementInstance: FormElementInstance;
  submitValue?: (key: string, value: string) => void;
  isInvalid?: boolean;
  defaultValue?: string;
}) {
  const element = elementInstance as CustomInstance;
  const { label, helperText, required, options, direction, styles } = element.extraAttributes;

  const [value, setValue] = React.useState(defaultValue || "");

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label style={{ color: styles.textColor }}>
        {label}
        {required && "*"}
      </Label>
      <RadioGroup
        className={`flex gap-2 ${direction === "column" ? "flex-col" : "flex-row"}`}
        value={value}
        onValueChange={(newValue) => {
          setValue(newValue);
          if (submitValue) submitValue(element.id, newValue);
        }}
      >
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-2">
            <RadioGroupItem
              value={option.value}
              id={`radio-${element.id}-${index}`}
              style={{
                borderColor: styles.borderColor,
                backgroundColor: styles.backgroundColor,
              }}
              className={isInvalid ? "border-red-500" : ""}
            />
            <Label htmlFor={`radio-${element.id}-${index}`} style={{ color: styles.textColor }}>
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {helperText && <p className="text-muted-foreground text-[0.8rem]" style={{ color: styles.textColor }}>{helperText}</p>}
    </div>
  );
}

type PropertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  
  const form = useForm<PropertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      ...element.extraAttributes,
    },
  });

  React.useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: PropertiesFormSchemaType) {
    const { options, ...rest } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        ...rest,
        options: options.filter(option => option.label && option.value),
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Helper Text</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Required</FormLabel>
                <FormDescription>
                  Is this field required?
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="options"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Options</FormLabel>
              <div className="flex flex-col gap-2">
                {field.value.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Label"
                      value={option.label}
                      onChange={(e) => {
                        const newOptions = [...field.value];
                        newOptions[index].label = e.target.value;
                        field.onChange(newOptions);
                      }}
                    />
                    <Input
                      placeholder="Value"
                      value={option.value}
                      onChange={(e) => {
                        const newOptions = [...field.value];
                        newOptions[index].value = e.target.value;
                        field.onChange(newOptions);
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => {
                        const newOptions = field.value.filter((_, i) => i !== index);
                        field.onChange(newOptions);
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={() => {
                    field.onChange([...field.value, { label: "", value: "" }]);
                  }}
                  className="mt-2"
                >
                  Add Option
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="direction"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Direction</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="row" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Row
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="column" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Column
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="styles.borderColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Border Color</FormLabel>
              <FormControl>
                <Input type="color" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="styles.backgroundColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background Color</FormLabel>
              <FormControl>
                <Input type="color" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="styles.textColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text Color</FormLabel>
              <FormControl>
                <Input type="color" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}