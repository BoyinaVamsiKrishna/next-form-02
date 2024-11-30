"use client";
import React from "react";
import { MdWallpaper } from "react-icons/md";
import { ElementsType, FormElement, FormElementInstance } from "@/components/FormElements";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import useDesigner from "@/hooks/useDesigner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { BackgroundProvider, useBackground } from "@/components/context/BackgroundContext";

const type: ElementsType = "BackgroundElement";

const extraAttributes = {
  backgroundType: "color" as "color" | "image",
  backgroundColor: "#ffffff",
  backgroundImage: "/overlapping-circles.svg",
  darkModeEnabled: false,
  darkBackgroundImage: "/dark/public/overlapping-circles.svg",
};


const propertiesSchema = z.object({
  backgroundType: z.enum(["color", "image"]),
  backgroundColor: z.string().min(1, "Color is required"),
  backgroundImage: z.string().min(1, "Image is required"),
  darkModeEnabled: z.boolean(),
  darkBackgroundImage: z.string().min(1, "Dark mode image is required"),
});


export const BackgroundElementFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: MdWallpaper,
    label: "Background",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
};


// function BackgroundElementFieldFormField({ elementInstance }: { elementInstance: FormElementInstance }) {
//   const element = elementInstance as CustomInstance;
//   const { backgroundType, backgroundColor, backgroundImage, darkModeEnabled, darkBackgroundImage } = element.extraAttributes;
//   const currentImage = darkModeEnabled ? darkBackgroundImage : backgroundImage;
//   return (
//     <div className="flex flex-col gap-2 w-full items-center justify-center h-[120px] bg-accent/40">
//       <MdWallpaper className="h-8 w-8" />
//       <p className="text-sm">Background: {backgroundType === "color" ? "Color" : "Image"}</p>
//       {backgroundType === "color" && (
//         <div className="w-6 h-6 rounded-full" style={{ backgroundColor }} />
//       )}
//       {backgroundType === "image" && (
//         <img src={backgroundImage} alt="Background preview" className="w-16 h-16 object-cover rounded" />
//       )}
//     </div>
//   );
// }


function FormComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  return null; // Background element doesn't render in the form view
}


type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

type CustomInstance = FormElementInstance & {
  extraAttributes: {
    backgroundType: "color" | "image";
    backgroundColor: string;
    backgroundImage: string;
    darkModeEnabled: boolean;
    darkBackgroundImage: string;
  };
};

const lightModeImages = [
  { value: '/circuit-board.svg', label: 'Circuit Board' },
  { value: '/jigsaw.svg', label: 'Jigsaw' },
  { value: '/overlapping-circles.svg', label: 'Overlapping Circles' },
  { value: '/paper.svg', label: 'Paper' },
  { value: '/temple.svg', label: 'Temple' }
];

const darkModeImages = [
  { value: '/dark/circuit-board-dark.svg', label: 'Circuit Board' },
  { value: '/dark/jigsaw-dark.svg', label: 'Jigsaw' },
  { value: '/dark/overlapping-circles-dark.svg', label: 'Overlapping Circles' },
  { value: '/dark/paper-dark.svg', label: 'Paper' },
  { value: '/dark/temple-dark.svg', label: 'Temple' }
];

export function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { backgroundType, backgroundColor, backgroundImage, darkModeEnabled, darkBackgroundImage } = element.extraAttributes;
  
  const currentImage = darkModeEnabled ? darkBackgroundImage : backgroundImage;
  
  return (
    <div className="flex flex-col gap-2 w-full items-center justify-center h-[120px] bg-accent/40">
      <MdWallpaper className="h-8 w-8" />
      <p className="text-sm">Background: {backgroundType === "color" ? "Color" : "Image"}</p>
      <div 
        className="w-10 h-10 rounded-full border border-gray-300 overflow-hidden"
        style={{
          backgroundColor: backgroundType === "color" ? backgroundColor : undefined,
          backgroundImage: backgroundType === "image" ? `url(${currentImage})` : undefined,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
    </div>
  );
}


export function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  const { backgroundState, updateBackground } = useBackground();
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      backgroundType: element.extraAttributes.backgroundType,
      backgroundColor: element.extraAttributes.backgroundColor,
      backgroundImage: element.extraAttributes.backgroundImage,
      darkModeEnabled: element.extraAttributes.darkModeEnabled,
      darkBackgroundImage: element.extraAttributes.darkBackgroundImage,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { id } = element;
    updateElement(id, {
      ...element,
      extraAttributes: values,
    });
    updateBackground({
      backgroundType: values.backgroundType,
      backgroundColor: values.backgroundColor,
      backgroundImage: values.backgroundImage,
      darkModeEnabled: values.darkModeEnabled,
      darkBackgroundImage: values.darkBackgroundImage,
    });
  }

  return (
    <BackgroundProvider>
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => e.preventDefault()}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="backgroundType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background Type</FormLabel>
              <Select 
                onValueChange={(value) => {
                  field.onChange(value);
                  form.handleSubmit(applyChanges)();
                }}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select background type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="color">Color</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch("backgroundType") === "color" && (
          <FormField
            control={form.control}
            name="backgroundColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Color</FormLabel>
                <FormControl>
                  <div className="flex gap-2">
                    <Input 
                      type="color" 
                      {...field} 
                      className="w-12 h-12 p-1"
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        form.handleSubmit(applyChanges)();
                      }}
                    />
                    <Input 
                      {...field} 
                      placeholder="#ffffff"
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        form.handleSubmit(applyChanges)();
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {form.watch("backgroundType") === "image" && (
          <>
            <FormField
              control={form.control}
              name="backgroundImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Image</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.handleSubmit(applyChanges)();
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select background image" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {lightModeImages.map((image) => (
                        <SelectItem key={image.value} value={image.value}>
                          {image.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="darkModeEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Dark Mode</FormLabel>
                    <FormDescription>
                      Enable dark mode background
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={(checked) => {
                        field.onChange(checked);
                        form.handleSubmit(applyChanges)();
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("darkModeEnabled") && (
              <FormField
                control={form.control}
                name="darkBackgroundImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dark Mode Background Image</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        form.handleSubmit(applyChanges)();
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select dark mode background image" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {darkModeImages.map((image) => (
                          <SelectItem key={image.value} value={image.value}>
                            {image.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </>
        )}
      </form>
    </Form>
    </BackgroundProvider>
  );
}

