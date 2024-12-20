"use client";
import { ElementsType, FormElement, FormElementInstance } from "@/components/FormElements";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import { useEffect } from "react";
import useDesigner from "@/hooks/useDesigner";
import { LuSeparatorHorizontal } from "react-icons/lu"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
import { Textarea } from "../ui/textarea";
import { Slider } from "../ui/slider";


const type: ElementsType = "SpacerField";
const extraAttributes = {
  height: 20,
};

const propertiesSchema = z.object({
  height: z.number().min(5).max(200),
});


export const SpacerFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: LuSeparatorHorizontal,
    label: "Spacer Field",
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
  const { height } = element.extraAttributes
  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <label className="text-muted-foreground">
      Spacer Field: {height}px
      </label>
      <LuSeparatorHorizontal className="h-8 w-8" />
    </div>
  );
}

function FormComponent({
  elementInstance
}: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance
  const { height } = element.extraAttributes
  return (
        <div style={{height, width: "100%"}}></div>
  );
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;
function PropertiesComponent({elementInstance,}:{elementInstance: FormElementInstance;}){
  const element = elementInstance as CustomInstance;
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onBlur',
    defaultValues: {
      height: element.extraAttributes.height,
    }
  })
  const {updateElement} = useDesigner();
  useEffect(()=>{
    form.reset(element.extraAttributes);
  }, [element, form])

  function applyChanges(values: propertiesFormSchemaType){
    const {height} = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {height},
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
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (px): {form.watch("height")}</FormLabel>
                  <FormControl className="pt-2">
                    <Slider 
                    defaultValue={[field.value]}
                    min={5}
                    max={200}
                    step={1}
                    onValueChange={(value)=>{
                      field.onChange(value[0]);
                    }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        </div>
}

