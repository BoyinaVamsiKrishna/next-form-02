// "use client";

// import * as React from "react";
// import { ToggleLeft } from "lucide-react";
// import { ElementsType, FormElement, FormElementInstance } from "@/components/FormElements";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import useDesigner from "@/hooks/useDesigner";

// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { Switch } from "../ui/switch";

// const type: ElementsType = "SwitchField";

// type SwitchFieldAttributes = {
//   label: string;
//   helperText: string;
//   required: boolean;
//   defaultChecked: boolean;
//   styles: {
//     labelColor: string;
//     switchColor: string;
//     thumbColor: string;
//   };
// };

// const extraAttributes: SwitchFieldAttributes = {
//   label: "Switch",
//   helperText: "Toggle this switch",
//   required: false,
//   defaultChecked: false,
//   styles: {
//     labelColor: "#000000",
//     switchColor: "#000000",
//     thumbColor: "#ffffff",
//   },
// };

// const propertiesSchema = z.object({
//   label: z.string().min(2).max(50),
//   helperText: z.string().max(200),
//   required: z.boolean().default(false),
//   defaultChecked: z.boolean().default(false),
//   styles: z.object({
//     labelColor: z.string(),
//     switchColor: z.string(),
//     thumbColor: z.string(),
//   }),
// });

// export const SwitchFieldFormElement: FormElement = {
//   type,
//   construct: (id: string) => ({
//     id,
//     type,
//     extraAttributes,
//   }),
//   designerBtnElement: {
//     icon: ToggleLeft,
//     label: "Switch",
//   },
//   designerComponent: DesignerComponent,
//   formComponent: FormComponent,
//   propertiesComponent: PropertiesComponent,
// };

// type CustomInstance = FormElementInstance & {
//   extraAttributes: SwitchFieldAttributes;
// };

// function DesignerComponent({
//   elementInstance
// }: {
//   elementInstance: FormElementInstance;
// }) {
//   const element = elementInstance as CustomInstance;
//   const { label, helperText, required, defaultChecked, styles } = element.extraAttributes;

//   return (
//     <div className="flex items-center space-x-2">
//       <Switch
//         id={`switch-${element.id}`}
//         checked={defaultChecked}
//         style={{
//           backgroundColor: defaultChecked ? styles.switchColor : undefined,
//           '--thumb-color': styles.thumbColor,
//         } as React.CSSProperties}
//       />
//       <Label htmlFor={`switch-${element.id}`} style={{ color: styles.labelColor }}>
//         {label}
//         {required && "*"}
//       </Label>
//       {helperText && (
//         <p className="text-muted-foreground text-[0.8rem]" style={{ color: styles.labelColor }}>
//           {helperText}
//         </p>
//       )}
//     </div>
//   );
// }

// function FormComponent({
//   elementInstance,
//   submitValue,
//   isInvalid,
//   defaultValue,
// }: {
//   elementInstance: FormElementInstance;
//   submitValue?: (key: string, value: boolean) => void;
//   isInvalid?: boolean;
//   defaultValue?: boolean;
// }) {
//   const element = elementInstance as CustomInstance;
//   const { label, helperText, required, styles } = element.extraAttributes;

//   const [checked, setChecked] = React.useState<boolean>(defaultValue ?? element.extraAttributes.defaultChecked);

//   React.useEffect(() => {
//     if (submitValue) submitValue(element.id, checked);
//   }, [element.id, submitValue, checked]);

//   return (
//     <div className="flex items-center space-x-2">
//       <Switch
//         id={`switch-${element.id}`}
//         checked={checked}
//         onCheckedChange={(value) => {
//           setChecked(value);
//         }}
//         style={{
//           backgroundColor: checked ? styles.switchColor : undefined,
//           '--thumb-color': styles.thumbColor,
//         } as React.CSSProperties}
//         className={isInvalid ? "border-red-500" : ""}
//       />
//       <Label htmlFor={`switch-${element.id}`} style={{ color: styles.labelColor }}>
//         {label}
//         {required && "*"}
//       </Label>
//       {helperText && (
//         <p className="text-muted-foreground text-[0.8rem]" style={{ color: styles.labelColor }}>
//           {helperText}
//         </p>
//       )}
//     </div>
//   );
// }

// type PropertiesFormSchemaType = z.infer<typeof propertiesSchema>;

// function PropertiesComponent({
//   elementInstance,
// }: {
//   elementInstance: FormElementInstance;
// }) {
//   const element = elementInstance as CustomInstance;
//   const { updateElement } = useDesigner();
  
//   const form = useForm<PropertiesFormSchemaType>({
//     resolver: zodResolver(propertiesSchema),
//     mode: "onBlur",
//     defaultValues: {
//       ...element.extraAttributes,
//     },
//   });

//   React.useEffect(() => {
//     form.reset(element.extraAttributes);
//   }, [element, form]);

//   function applyChanges(values: PropertiesFormSchemaType) {
//     updateElement(element.id, {
//       ...element,
//       extraAttributes: values,
//     });
//   }

//   return (
//     <Form {...form}>
//       <form
//         onBlur={form.handleSubmit(applyChanges)}
//         onSubmit={(e) => {
//           e.preventDefault();
//         }}
//         className="space-y-3"
//       >
//         <FormField
//           control={form.control}
//           name="label"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Label</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="helperText"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Helper Text</FormLabel>
//               <FormControl>
//                 <Input {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="required"
//           render={({ field }) => (
//             <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
//               <div className="space-y-0.5">
//                 <FormLabel>Required</FormLabel>
//                 <FormDescription>
//                   Is this field required?
//                 </FormDescription>
//               </div>
//               <FormControl>
//                 <Switch
//                   checked={field.value}
//                   onCheckedChange={field.onChange}
//                 />
//               </FormControl>
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="defaultChecked"
//           render={({ field }) => (
//             <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
//               <div className="space-y-0.5">
//                 <FormLabel>Default Checked</FormLabel>
//                 <FormDescription>
//                   Should this switch be checked by default?
//                 </FormDescription>
//               </div>
//               <FormControl>
//                 <Switch
//                   checked={field.value}
//                   onCheckedChange={field.onChange}
//                 />
//               </FormControl>
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="styles.labelColor"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Label Color</FormLabel>
//               <FormControl>
//                 <Input type="color" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="styles.switchColor"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Switch Color</FormLabel>
//               <FormControl>
//                 <Input type="color" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="styles.thumbColor"
//           render={({ field }) => (
//             <FormItem>
//               <FormLabel>Thumb Color</FormLabel>
//               <FormControl>
//                 <Input type="color" {...field} />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />
//       </form>
//     </Form>
//   );
// }

"use client";

import * as React from "react";
import { ToggleLeft } from 'lucide-react';
import { BsCheck, BsCheckAll } from "react-icons/bs";
import { ElementsType, FormElement, FormElementInstance } from "@/components/FormElements";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useDesigner from "@/hooks/useDesigner";
import { cn } from "@/lib/utils";

import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const type: ElementsType = "SwitchField";

type SwitchVariant = "switch" | "tick";

type CommonAttributes = {
  required: boolean;
  variant: SwitchVariant;
};

type SwitchAttributes = CommonAttributes & {
  variant: "switch";
  defaultChecked: boolean;
  styles: {
    switchColor: string;
    thumbColor: string;
  };
};

type TickAttributes = CommonAttributes & {
  variant: "tick";
  isDoubleTick: boolean;
  styles: {
    tickColor: string;
    doubleTickColor: string;
    size: "small" | "medium" | "large";
  };
};

type SwitchFieldAttributes = SwitchAttributes | TickAttributes;

const defaultSwitchAttributes: SwitchAttributes = {
  required: false,
  variant: "switch",
  defaultChecked: false,
  styles: {
    switchColor: "#2563eb", // Default blue color
    thumbColor: "#ffffff",
  },
};

const propertiesSchema = z.discriminatedUnion("variant", [
  z.object({
    variant: z.literal("switch"),
    required: z.boolean().default(false),
    defaultChecked: z.boolean().default(false),
    styles: z.object({
      switchColor: z.string(),
      thumbColor: z.string(),
    }),
  }),
  z.object({
    variant: z.literal("tick"),
    required: z.boolean().default(false),
    isDoubleTick: z.boolean().default(false),
    styles: z.object({
      tickColor: z.string(),
      doubleTickColor: z.string(),
      size: z.enum(["small", "medium", "large"]),
    }),
  }),
]);

export const SwitchFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes: defaultSwitchAttributes,
  }),
  designerBtnElement: {
    icon: ToggleLeft,
    label: "Switch/Tick Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
};

type CustomInstance = FormElementInstance & {
  extraAttributes: SwitchFieldAttributes;
};

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { required, variant } = element.extraAttributes;

  return (
    <div className="flex items-center space-x-2">
      {variant === "switch" ? (
        <div 
          className={cn(
            "w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all",
            {
              "peer-checked:bg-blue-600": (element.extraAttributes as SwitchAttributes).styles.switchColor === "#2563eb",
            }
          )}
          style={{
            backgroundColor: (element.extraAttributes as SwitchAttributes).defaultChecked ? (element.extraAttributes as SwitchAttributes).styles.switchColor : undefined,
          }}
        >
          <div 
            className="absolute top-[2px] start-[2px] bg-white rounded-full h-5 w-5 transition-all"
            style={{
              backgroundColor: (element.extraAttributes as SwitchAttributes).styles.thumbColor,
              transform: (element.extraAttributes as SwitchAttributes).defaultChecked ? 'translateX(100%)' : 'translateX(0)',
            }}
          />
        </div>
      ) : (
        <div className="flex items-center justify-center">
          {(element.extraAttributes as TickAttributes).isDoubleTick ? (
            <BsCheckAll
              className={cn({
                "w-4 h-4": (element.extraAttributes as TickAttributes).styles.size === "small",
                "w-6 h-6": (element.extraAttributes as TickAttributes).styles.size === "medium",
                "w-8 h-8": (element.extraAttributes as TickAttributes).styles.size === "large",
              })}
              style={{ color: (element.extraAttributes as TickAttributes).styles.doubleTickColor }}
            />
          ) : (
            <BsCheck
              className={cn({
                "w-4 h-4": (element.extraAttributes as TickAttributes).styles.size === "small",
                "w-6 h-6": (element.extraAttributes as TickAttributes).styles.size === "medium",
                "w-8 h-8": (element.extraAttributes as TickAttributes).styles.size === "large",
              })}
              style={{ color: (element.extraAttributes as TickAttributes).styles.tickColor }}
            />
          )}
        </div>
      )}
      {required && <span className="text-red-500 ml-1">*</span>}
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
  const [checked, setChecked] = React.useState<boolean>(defaultValue ?? 
    element.extraAttributes.variant === "switch" 
      ? (element.extraAttributes as SwitchAttributes).defaultChecked 
      : (element.extraAttributes as TickAttributes).isDoubleTick
  );

  React.useEffect(() => {
    if (submitValue) submitValue(element.id, checked);
  }, [element.id, submitValue, checked]);

  return (
    <div className="flex items-center space-x-2">
      {element.extraAttributes.variant === "switch" ? (
        <div 
          className={cn(
            "relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 cursor-pointer",
            {
              "bg-blue-600": checked,
              "border-red-500": isInvalid,
            }
          )}
          onClick={() => setChecked(!checked)}
          style={{
            backgroundColor: checked ? (element.extraAttributes as SwitchAttributes).styles.switchColor : undefined,
          }}
        >
          <div 
            className={cn(
              "absolute top-[2px] left-[2px] bg-white rounded-full h-5 w-5 transition-transform",
              {
                "translate-x-full": checked,
              }
            )}
            style={{
              backgroundColor: (element.extraAttributes as SwitchAttributes).styles.thumbColor,
            }}
          />
        </div>
      ) : (
        <div
          className="cursor-pointer"
          onClick={() => setChecked(!checked)}
        >
          {checked ? (
            <BsCheckAll
              className={cn({
                "w-4 h-4": (element.extraAttributes as TickAttributes).styles.size === "small",
                "w-6 h-6": (element.extraAttributes as TickAttributes).styles.size === "medium",
                "w-8 h-8": (element.extraAttributes as TickAttributes).styles.size === "large",
              })}
              style={{ color: (element.extraAttributes as TickAttributes).styles.doubleTickColor }}
            />
          ) : (
            <BsCheck
              className={cn({
                "w-4 h-4": (element.extraAttributes as TickAttributes).styles.size === "small",
                "w-6 h-6": (element.extraAttributes as TickAttributes).styles.size === "medium",
                "w-8 h-8": (element.extraAttributes as TickAttributes).styles.size === "large",
              })}
              style={{ color: (element.extraAttributes as TickAttributes).styles.tickColor }}
            />
          )}
        </div>
      )}
      {element.extraAttributes.required && <span className="text-red-500 ml-1">*</span>}
    </div>
  );
}

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  
  const form = useForm<z.infer<typeof propertiesSchema>>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      ...element.extraAttributes,
    },
  });

  React.useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: z.infer<typeof propertiesSchema>) {
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
          name="variant"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Variant</FormLabel>
              <Select
                value={field.value}
                onValueChange={(value: "switch" | "tick") => {
                  field.onChange(value);
                  // Reset form with default values for the selected variant
                  if (value === "switch") {
                    form.reset(defaultSwitchAttributes);
                  } else {
                    form.reset({
                      required: false,
                      variant: "tick",
                      isDoubleTick: false,
                      styles: {
                        tickColor: "#000000",
                        doubleTickColor: "#2563eb",
                        size: "medium",
                      },
                    });
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select variant" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="switch">Switch</SelectItem>
                  <SelectItem value="tick">Tick</SelectItem>
                </SelectContent>
              </Select>
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

        {form.watch("variant") === "switch" ? (
          <>
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
              name="styles.switchColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Switch Color</FormLabel>
                  <FormControl>
                    <input type="color" {...field} className="h-10 w-full" />
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
                    <input type="color" {...field} className="h-10 w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : (
          <>
            <FormField
              control={form.control}
              name="isDoubleTick"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Double Tick</FormLabel>
                    <FormDescription>
                      Use double tick instead of single tick?
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
              name="styles.tickColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tick Color</FormLabel>
                  <FormControl>
                    <input type="color" {...field} className="h-10 w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="styles.doubleTickColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Double Tick Color</FormLabel>
                  <FormControl>
                    <input type="color" {...field} className="h-10 w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="styles.size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </form>
    </Form>
  );
}

