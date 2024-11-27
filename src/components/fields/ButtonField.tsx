"use client";

import { ElementsType, FormElement, FormElementInstance } from "@/components/FormElements";
import { MdSmartButton } from "react-icons/md";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import useDesigner from "@/hooks/useDesigner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const type: ElementsType = "ButtonField";

type ButtonPosition = "left" | "right" | "center" | "corners";
type ButtonVariant = "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";

const extraAttributes = {
  submitLabel: "Submit",
  showCancel: false,
  cancelLabel: "Cancel",
  submitVariant: "default" as ButtonVariant,
  cancelVariant: "outline" as ButtonVariant,
  buttonPosition: "right" as ButtonPosition,
  submitFirst: true,
};

const propertiesSchema = z.object({
  submitLabel: z.string().min(1, "Required").max(20),
  showCancel: z.boolean().default(false),
  cancelLabel: z.string().max(20),
  submitVariant: z.enum(["default", "outline", "secondary", "ghost", "link", "destructive"]),
  cancelVariant: z.enum(["default", "outline", "secondary", "ghost", "link", "destructive"]),
  buttonPosition: z.enum(["left", "right", "center", "corners"]),
  submitFirst: z.boolean().default(true),
});

export const ButtonFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: MdSmartButton,
    label: "Button Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { submitLabel, showCancel, cancelLabel, submitVariant, cancelVariant, buttonPosition, submitFirst } = element.extraAttributes;

  return (
    <div className="flex w-full gap-2">
      <div className={`flex w-full gap-2 ${getButtonContainerClass(buttonPosition)}`}>
        {getButtonLayout(submitLabel, cancelLabel, showCancel, submitVariant, cancelVariant, buttonPosition, submitFirst)}
      </div>
    </div>
  );
}

function FormComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { submitLabel, showCancel, cancelLabel, submitVariant, cancelVariant, buttonPosition, submitFirst } = element.extraAttributes;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Form validation will be handled by the parent form
  };

  return (
    <div className={`flex w-full gap-2 ${getButtonContainerClass(buttonPosition)}`}>
      {getButtonLayout(submitLabel, cancelLabel, showCancel, submitVariant, cancelVariant, buttonPosition, submitFirst)}
    </div>
  );
}

function getButtonContainerClass(position: ButtonPosition): string {
  switch (position) {
    case "left": return "justify-start";
    case "right": return "justify-end";
    case "center": return "justify-center";
    case "corners": return "justify-between";
    default: return "justify-end";
  }
}

function getButtonLayout(
  submitLabel: string,
  cancelLabel: string,
  showCancel: boolean,
  submitVariant: ButtonVariant,
  cancelVariant: ButtonVariant,
  position: ButtonPosition,
  submitFirst: boolean
) {
  const submitButton = (
    <Button 
      variant={submitVariant}
      className={position === "center" && !showCancel ? "w-full" : ""}
      type="submit"
    >
      {submitLabel}
    </Button>
  );

  const cancelButton = showCancel && (
    <Button 
      variant={cancelVariant}
      type="button"
    >
      {cancelLabel}
    </Button>
  );

  if (!showCancel) return submitButton;

  return submitFirst ? (
    <>
      {submitButton}
      {cancelButton}
    </>
  ) : (
    <>
      {cancelButton}
      {submitButton}
    </>
  );
}

type PropertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  
  const form = useForm<PropertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      submitLabel: element.extraAttributes.submitLabel,
      showCancel: element.extraAttributes.showCancel,
      cancelLabel: element.extraAttributes.cancelLabel,
      submitVariant: element.extraAttributes.submitVariant,
      cancelVariant: element.extraAttributes.cancelVariant,
      buttonPosition: element.extraAttributes.buttonPosition,
      submitFirst: element.extraAttributes.submitFirst,
    },
  });

  useEffect(() => {
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
        onSubmit={(e) => e.preventDefault()}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="submitLabel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Submit Button Label</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="showCancel"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Show Cancel Button</FormLabel>
                <FormDescription>
                  Show a cancel button alongside submit
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

        {form.watch("showCancel") && (
          <FormField
            control={form.control}
            name="cancelLabel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cancel Button Label</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") e.currentTarget.blur();
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="submitVariant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Submit Button Variant</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select button variant" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="destructive">Destructive</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {form.watch("showCancel") && (
          <FormField
            control={form.control}
            name="cancelVariant"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cancel Button Variant</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select button variant" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="destructive">Destructive</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="ghost">Ghost</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="buttonPosition"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Button Position</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select button position" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                  <SelectItem value="center">Center</SelectItem>
                  {form.watch("showCancel") && (
                    <SelectItem value="corners">Corners</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        {form.watch("showCancel") && form.watch("buttonPosition") !== "corners" && (
          <FormField
            control={form.control}
            name="submitFirst"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Submit Button First</FormLabel>
                  <FormDescription>
                    Show submit button before cancel button
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
        )}
      </form>
    </Form>
  );
}