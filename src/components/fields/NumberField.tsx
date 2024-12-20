"use client";
import { Bs123 } from "react-icons/bs";
import { ElementsType, FormElement, FormElementInstance } from "@/components/FormElements";
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import { useEffect } from "react";
import useDesigner from "@/hooks/useDesigner";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
import { Switch } from "../ui/switch";


const type: ElementsType = "NumberField";
const extraAttributes = {
  label: "Number field",
  helperText: "Helper text",
  required: false,
  placeHolder: "0",
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeHolder: z.string().max(50),
});


export const NumberFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: Bs123,
    label: "Number Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
};


type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
}

function DesignerComponent({
  elementInstance
}: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance
  const { label, required, placeHolder, helperText } = element.extraAttributes
  return (
    <div className="flex flex-col gap-2 w-full">
      <label>
        {label}
        {required && "*"}
      </label>
      <input
      type="number"
        className="w-full h-[40px] rounded-md px-4 py-2"
        placeholder={placeHolder}
      readOnly disabled/>
      {helperText && (<p className="text-muted-foreground text-[0.8rem]">{helperText}</p>)}
    </div>
  );
}

function FormComponent({
  elementInstance
}: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance
  const { label, required, placeHolder, helperText } = element.extraAttributes
  return (
    <div className="flex flex-col gap-2 w-full">
      <label>
        {label}
        {required && "*"}
      </label>
      <input
      type="number"
        className="w-full h-[40px] rounded-md px-4 py-2"
        placeholder={placeHolder}/>
      {helperText && (<p className="text-muted-foreground text-[0.8rem]">{helperText}</p>)}
    </div>
  );
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;
function PropertiesComponent({elementInstance,}:{elementInstance: FormElementInstance;}){
  const element = elementInstance as CustomInstance;
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onBlur',
    defaultValues: {
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      placeHolder: element.extraAttributes.placeHolder,

    }
  })
  const {updateElement} = useDesigner();
  useEffect(()=>{
    form.reset(element.extraAttributes);
  }, [element, form])

  function applyChanges(values: propertiesFormSchemaType){
    const {label, helperText, placeHolder, required} = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {label, helperText, placeHolder, required},
    })}
  return <div>
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
                    <Input
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.currentTarget.blur();
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The label of the field. <br /> It will be displayed above the field
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
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
              name="placeHolder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PlaceHolder</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.currentTarget.blur();
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The placeholder of the field.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
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
              name="helperText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Helper Text</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.currentTarget.blur();
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    The helper  text of the field. <br /> It will be displayed below the field
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
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
              name="required"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                  <FormLabel>Required</FormLabel>
                  <FormDescription>
                    The label of the field. <br /> It will be displayed above the field
                  </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        </div>
}

