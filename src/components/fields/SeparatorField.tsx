"use client";
import { ElementsType, FormElement, FormElementInstance } from "@/components/FormElements";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import { useEffect } from "react";
import useDesigner from "@/hooks/useDesigner";
import { Separator } from "../ui/separator";
import { RiSeparator } from "react-icons/ri"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
import { Textarea } from "../ui/textarea";


const type: ElementsType = "SeparatorField";

export const SeparatorFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
  }),
  designerBtnElement: {
    icon: RiSeparator,
    label: "Separator Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
};

function DesignerComponent({
  elementInstance
}: { elementInstance: FormElementInstance }) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-muted-foreground">
        Separator Field
      </label>
      <Separator />
    </div>
  );
}

function FormComponent({
  elementInstance
}: { elementInstance: FormElementInstance }) {
  return (
    <Separator />
  );
}

function PropertiesComponent({elementInstance,}:{elementInstance: FormElementInstance;}){
  
  return <p>No properties for this element</p>
}

