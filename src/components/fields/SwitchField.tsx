"use client";

import * as React from "react";
import { ToggleLeft } from "lucide-react";
import { ElementsType, FormElement, FormElementInstance } from "@/components/FormElements";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useDesigner from "@/hooks/useDesigner";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from "../ui/switch";

const type: ElementsType = "SwitchField";

type SwitchFieldAttributes = {
  label: string;
  helperText: string;
  required: boolean;
  defaultChecked: boolean;
  styles: {
    labelColor: string;
    switchColor: string;
    thumbColor: string;
  };
};

const extraAttributes: SwitchFieldAttributes = {
  label: "Switch",
  helperText: "Toggle this switch",
  required: false,
  defaultChecked: false,
  styles: {
    labelColor: "#000000",
    switchColor: "#000000",
    thumbColor: "#ffffff",
  },
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  defaultChecked: z.boolean().default(false),
  styles: z.object({
    labelColor: z.string(),
    switchColor: z.string(),
    thumbColor: z.string(),
  }),
});

export const SwitchFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: ToggleLeft,
    label: "Switch",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
};

type CustomInstance = FormElementInstance & {
  extraAttributes: SwitchFieldAttributes;
};

function DesignerComponent({
  elementInstance
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { label, helperText, required, defaultChecked, styles } = element.extraAttributes;

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={`switch-${element.id}`}
        checked={defaultChecked}
        style={{
          backgroundColor: defaultChecked ? styles.switchColor : undefined,
          '--thumb-color': styles.thumbColor,
        } as React.CSSProperties}
      />
      <Label htmlFor={`switch-${element.id}`} style={{ color: styles.labelColor }}>
        {label}
        {required && "*"}
      </Label>
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]" style={{ color: styles.labelColor }}>
          {helperText}
        </p>
      )}
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
  submitValue?: (key: string, value: boolean) => void;
  isInvalid?: boolean;
  defaultValue?: boolean;
}) {
  const element = elementInstance as CustomInstance;
  const { label, helperText, required, styles } = element.extraAttributes;

  const [checked, setChecked] = React.useState<boolean>(defaultValue ?? element.extraAttributes.defaultChecked);

  React.useEffect(() => {
    if (submitValue) submitValue(element.id, checked);
  }, [element.id, submitValue, checked]);

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={`switch-${element.id}`}
        checked={checked}
        onCheckedChange={(value) => {
          setChecked(value);
        }}
        style={{
          backgroundColor: checked ? styles.switchColor : undefined,
          '--thumb-color': styles.thumbColor,
        } as React.CSSProperties}
        className={isInvalid ? "border-red-500" : ""}
      />
      <Label htmlFor={`switch-${element.id}`} style={{ color: styles.labelColor }}>
        {label}
        {required && "*"}
      </Label>
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]" style={{ color: styles.labelColor }}>
          {helperText}
        </p>
      )}
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
    updateElement(element.id, {
      ...element,
      extraAttributes: values,
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
          name="defaultChecked"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Default Checked</FormLabel>
                <FormDescription>
                  Should this switch be checked by default?
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
          name="styles.labelColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Label Color</FormLabel>
              <FormControl>
                <Input type="color" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="styles.switchColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Switch Color</FormLabel>
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
      </form>
    </Form>
  );
}