"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";

const type: ElementsType = "SelectField";

type Option = {
  label: string;
  value: string;
};

type SelectFieldAttributes = {
  label: string;
  helperText: string;
  required: boolean;
  placeHolder: string;
  options: Option[];
  styles: {
    fontSize: number;
    borderColor: string;
    backgroundColor: string;
    textColor: string;
    textOpacity: number;
    elementOpacity: number;
  };
  width: "full" | "fit";
  alignment: "left" | "center" | "right";
};

const extraAttributes: SelectFieldAttributes = {
  label: "Select field",
  helperText: "Select an option",
  required: false,
  placeHolder: "Select an option",
  options: [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
  ],
  styles: {
    fontSize: 16,
    borderColor: "#000000",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    textOpacity: 100,
    elementOpacity: 100,
  },
  width: "full",
  alignment: "left",
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeHolder: z.string().max(50),
  options: z.array(
    z.object({
      label: z.string().min(1).max(50),
      value: z.string().min(1).max(50),
    })
  ).min(1),
  styles: z.object({
    fontSize: z.number().min(8).max(32),
    borderColor: z.string(),
    backgroundColor: z.string(),
    textColor: z.string(),
    textOpacity: z.number().min(0).max(100),
    elementOpacity: z.number().min(0).max(100),
  }),
  width: z.enum(["full", "fit"]),
  alignment: z.enum(["left", "center", "right"]),
});

export const SelectFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: ChevronDown,
    label: "Select",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
};

type CustomInstance = FormElementInstance & {
  extraAttributes: SelectFieldAttributes;
};

function DesignerComponent({
  elementInstance
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { label, required, placeHolder, helperText, styles, width, alignment } = element.extraAttributes;

  const styleProps = {
    fontSize: `${styles.fontSize}px`,
    borderColor: styles.borderColor,
    backgroundColor: styles.backgroundColor,
    color: styles.textColor,
    opacity: styles.elementOpacity / 100,
  };

  const textStyle = {
    color: styles.textColor,
    opacity: styles.textOpacity / 100,
  };

  return (
    <div className={`flex flex-col gap-2 ${width === "full" ? "w-full" : "w-fit"}`} style={{ alignSelf: alignment }}>
      <Label style={textStyle}>
        {label}
        {required && "*"}
      </Label>
      <Select disabled>
        <SelectTrigger className={width === "full" ? "w-full" : "w-fit"} style={styleProps}>
          <SelectValue placeholder={placeHolder} style={textStyle} />
        </SelectTrigger>
      </Select>
      {helperText && <p className="text-muted-foreground text-[0.8rem]" style={textStyle}>{helperText}</p>}
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
  const { label, required, placeHolder, helperText, options, styles, width, alignment } = element.extraAttributes;

  const [value, setValue] = React.useState(defaultValue || "");

  const styleProps = {
    fontSize: `${styles.fontSize}px`,
    borderColor: styles.borderColor,
    backgroundColor: styles.backgroundColor,
    color: styles.textColor,
    opacity: styles.elementOpacity / 100,
  };

  const textStyle = {
    color: styles.textColor,
    opacity: styles.textOpacity / 100,
  };

  return (
    <div className={`flex flex-col gap-2 ${width === "full" ? "w-full" : "w-fit"}`} style={{ alignSelf: alignment }}>
      <Label style={textStyle}>
        {label}
        {required && "*"}
      </Label>
      <Select
        value={value}
        onValueChange={(value) => {
          setValue(value);
          if (submitValue) submitValue(element.id, value);
        }}
      >
        <SelectTrigger 
          className={`${width === "full" ? "w-full" : "w-fit"} ${isInvalid ? "border-red-500" : ""}`} 
          style={styleProps}
        >
          <SelectValue placeholder={placeHolder} style={textStyle} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value} style={textStyle}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {helperText && <p className="text-muted-foreground text-[0.8rem]" style={textStyle}>{helperText}</p>}
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
          name="placeHolder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
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
          name="styles.fontSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font Size {field.value}px</FormLabel>
              <FormControl>
                <Slider
                  min={8}
                  max={32}
                  step={1}
                  defaultValue={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
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
        <FormField
          control={form.control}
          name="styles.textOpacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text Opacity {field.value}%</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  defaultValue={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="styles.elementOpacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Element Opacity {field.value}%</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  defaultValue={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="width"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Width</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select width" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="full">Full</SelectItem>
                  <SelectItem value="fit">Fit Content</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="alignment"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alignment</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select alignment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}