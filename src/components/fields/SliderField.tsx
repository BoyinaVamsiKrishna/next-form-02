"use client";

import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
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
import { cn } from "@/lib/utils";

const type: ElementsType = "SliderField";

type SliderFieldAttributes = {
  label: string;
  helperText: string;
  required: boolean;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  styles: {
    sliderColor: string;
    thumbColor: string;
    textColor: string;
  };
};

const extraAttributes: SliderFieldAttributes = {
  label: "Slider",
  helperText: "Select a value",
  required: false,
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 50,
  styles: {
    sliderColor: "#000000",
    thumbColor: "#ffffff",
    textColor: "#000000",
  },
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  min: z.number().min(0),
  max: z.number().min(1),
  step: z.number().min(0.1),
  defaultValue: z.number(),
  styles: z.object({
    sliderColor: z.string(),
    thumbColor: z.string(),
    textColor: z.string(),
  }),
});

export const SliderFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: SlidersHorizontal,
    label: "Slider",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
};

type CustomInstance = FormElementInstance & {
  extraAttributes: SliderFieldAttributes;
};

function DesignerComponent({
  elementInstance
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { label, helperText, required, min, max, step, defaultValue, styles } = element.extraAttributes;

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label style={{ color: styles.textColor }}>
        {label}
        {required && "*"}
      </Label>
      <div className="flex items-center gap-4">
        <Slider
          defaultValue={[defaultValue]}
          max={max}
          min={min}
          step={step}
          className={cn("flex-grow", styles.sliderColor && `[&_[role=slider]]:bg-[${styles.sliderColor}]`)}
          style={{
            "--slider-thumb": styles.thumbColor,
          } as React.CSSProperties}
        />
        <span style={{ color: styles.textColor }}>{defaultValue}</span>
      </div>
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
  submitValue?: (key: string, value: number) => void;
  isInvalid?: boolean;
  defaultValue?: number;
}) {
  const element = elementInstance as CustomInstance;
  const { label, helperText, required, min, max, step, styles } = element.extraAttributes;

  const [value, setValue] = React.useState<number>(defaultValue || element.extraAttributes.defaultValue);

  React.useEffect(() => {
    if (submitValue) submitValue(element.id, value);
  }, [element.id, submitValue, value]);

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label style={{ color: styles.textColor }}>
        {label}
        {required && "*"}
      </Label>
      <div className="flex items-center gap-4">
        <Slider
          value={[value]}
          onValueChange={(newValue) => {
            setValue(newValue[0]);
          }}
          max={max}
          min={min}
          step={step}
          className={cn(
            "flex-grow",
            isInvalid && "border-red-500",
            "[&_[role=slider]]:bg-primary"
          )}
          style={{
            "--slider-thumb": styles.thumbColor,
            "--slider-track": styles.sliderColor,
          } as React.CSSProperties}
        />
        <span style={{ color: styles.textColor }}>{value}</span>
      </div>
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
    const { defaultValue, min, max } = values;
    const updatedValues = {
      ...values,
      defaultValue: Math.max(min, Math.min(max, defaultValue)),
    };
    updateElement(element.id, {
      ...element,
      extraAttributes: updatedValues,
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
          name="min"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Minimum Value</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="max"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Maximum Value</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="step"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Step</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="defaultValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Default Value</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="styles.sliderColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slider Color</FormLabel>
              <FormControl>
                <Input type="color" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="styles.thumbColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumb Color</FormLabel>
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