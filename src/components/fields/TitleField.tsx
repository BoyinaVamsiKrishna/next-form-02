// "use client";
// import { MdTextFields } from "react-icons/md";
// import { ElementsType, FormElement, FormElementInstance } from "@/components/FormElements";
// import {Label} from "@/components/ui/label"
// import {Input} from "@/components/ui/input"
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {useForm} from "react-hook-form";
// import { useEffect } from "react";
// import useDesigner from "@/hooks/useDesigner";
// import { LuHeading1 } from "react-icons/lu"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from '@/components/ui/form'
// import { Switch } from "../ui/switch";


// const type: ElementsType = "TitleField";
// const extraAttributes = {
//   title: "Title field",
// };

// const propertiesSchema = z.object({
//   title: z.string().min(2).max(50),
// });


// export const TitleFieldFormElement: FormElement = {
//   type,
//   construct: (id: string) => ({
//     id,
//     type,
//     extraAttributes,
//   }),
//   designerBtnElement: {
//     icon: LuHeading1,
//     label: "Title Field",
//   },
//   designerComponent: DesignerComponent,
//   formComponent: FormComponent,
//   propertiesComponent: PropertiesComponent,
// };


// type CustomInstance = FormElementInstance & {
//   extraAttributes: typeof extraAttributes;
// }

// function DesignerComponent({
//   elementInstance
// }: { elementInstance: FormElementInstance }) {
//   const element = elementInstance as CustomInstance
//   const { title } = element.extraAttributes
//   return (
//     <div className="flex flex-col gap-2 w-full">
//       <label className="text-muted-foreground">
//         Title Field
//       </label>
//       <p className="text-xl">{title}</p>
//     </div>
//   );
// }

// function FormComponent({
//   elementInstance
// }: { elementInstance: FormElementInstance }) {
//   const element = elementInstance as CustomInstance
//   const { title } = element.extraAttributes
//   return (
//         <p className="text-xl">{title}</p>
//   );
// }

// type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;
// function PropertiesComponent({elementInstance,}:{elementInstance: FormElementInstance;}){
//   const element = elementInstance as CustomInstance;
//   const form = useForm<propertiesFormSchemaType>({
//     resolver: zodResolver(propertiesSchema),
//     mode: 'onBlur',
//     defaultValues: {
//       title: element.extraAttributes.title,
//     }
//   })
//   const {updateElement} = useDesigner();
//   useEffect(()=>{
//     form.reset(element.extraAttributes);
//   }, [element, form])

//   function applyChanges(values: propertiesFormSchemaType){
//     const {title} = values;
//     updateElement(element.id, {
//       ...element,
//       extraAttributes: {title},
//     })}
//   return <div>
//         <Form {...form}>
//           <form
//             onBlur={form.handleSubmit(applyChanges)}
//             onSubmit={(e) => {
//               e.preventDefault();
//             }}
//             className="space-y-3"
//           >
//             <FormField
//               control={form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Title</FormLabel>
//                   <FormControl>
//                     <Input
//                       {...field}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") e.currentTarget.blur();
//                       }}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </form>
//         </Form>

//         </div>
// }

"use client";
import { MdTextFields } from "react-icons/md";
import { ElementsType, FormElement, FormElementInstance } from "@/components/FormElements";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import useDesigner from "@/hooks/useDesigner";
import { LuHeading1 } from "react-icons/lu"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const type: ElementsType = "TitleField";
const extraAttributes = {
  title: "Title field",
  alignment: "left" as "left" | "center" | "right",
};

const propertiesSchema = z.object({
  title: z.string().min(2).max(50),
  alignment: z.enum(["left", "center", "right"]),
});

export const TitleFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: LuHeading1,
    label: "Title Field",
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
  const { title, alignment } = element.extraAttributes
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-muted-foreground">
        Title Field
      </label>
      <p className={`text-xl text-${alignment}`}>{title}</p>
    </div>
  );
}

function FormComponent({
  elementInstance
}: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance
  const { title, alignment } = element.extraAttributes
  return (
    <p className={`text-xl text-${alignment}`}>{title}</p>
  );
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;
function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: 'onBlur',
    defaultValues: {
      title: element.extraAttributes.title,
      alignment: element.extraAttributes.alignment,
    }
  })
  const { updateElement } = useDesigner();
  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form])

  function applyChanges(values: propertiesFormSchemaType) {
    const { title, alignment } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: { title, alignment },
    })
  }
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
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
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  </div>
}