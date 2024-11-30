"use client";

import * as React from "react";
import { BsTextareaResize } from "react-icons/bs";
import { ElementsType, FormElement, FormElementInstance } from "@/components/FormElements";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useDesigner from "@/hooks/useDesigner";
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ArrowDown,
  ArrowUp,
  ChevronDown
} from "lucide-react";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Switch } from "../ui/switch";
import { Textarea } from "../ui/textarea";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

const type: ElementsType = "TextareaField";

type TextAlign = "left" | "center" | "right" | "justify";
type VerticalAlign = "top" | "middle" | "bottom";

const extraAttributes = {
  label: "Textarea field",
  helperText: "Helper text",
  required: false,
  placeHolder: "Value here...",
  rows: 3,
  fontFamily: "Arial",
  fontSize: 14,
  fontStyles: {
    bold: false,
    italic: false,
    underline: false,
    strikethrough: false,
  },
  textAlign: "left" as TextAlign,
  verticalAlign: "top" as VerticalAlign,
  writingDirection: "ltr" as "ltr" | "rtl",
  textColor: "#000000",
  backgroundColor: "transparent",
  borderColor: "#000000",
  wordWrap: true,
  opacity: {
    whole: 100,
    text: 100,
  },
  spacing: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    global: 0,
  },
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeHolder: z.string().max(50),
  rows: z.number().min(1).max(10),
  fontFamily: z.string(),
  fontSize: z.number().min(8).max(72),
  fontStyles: z.object({
    bold: z.boolean(),
    italic: z.boolean(),
    underline: z.boolean(),
    strikethrough: z.boolean(),
  }),
  textAlign: z.enum(["left", "center", "right", "justify"]),
  verticalAlign: z.enum(["top", "middle", "bottom"]),
  writingDirection: z.enum(["ltr", "rtl"]),
  textColor: z.string(),
  backgroundColor: z.string(),
  borderColor: z.string(),
  wordWrap: z.boolean(),
  opacity: z.object({
    whole: z.number().min(0).max(100),
    text: z.number().min(0).max(100),
  }),
  spacing: z.object({
    top: z.number(),
    right: z.number(),
    bottom: z.number(),
    left: z.number(),
    global: z.number(),
  }),
});

export const TextareaFieldFormField: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: BsTextareaResize,
    label: "Textarea Field",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

type TextareaStyles = React.CSSProperties & {
  verticalAlign?: VerticalAlign;
};

function DesignerComponent({
  elementInstance
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { 
    label, 
    required, 
    placeHolder, 
    helperText, 
    rows,
    fontFamily,
    fontSize,
    fontStyles,
    textAlign,
    verticalAlign,
    textColor,
    backgroundColor,
    borderColor,
    opacity,
    spacing,
    wordWrap
  } = element.extraAttributes;

  const textareaStyles: TextareaStyles = {
    fontFamily,
    fontSize: `${fontSize}px`,
    fontWeight: fontStyles.bold ? 'bold' : 'normal',
    fontStyle: fontStyles.italic ? 'italic' : 'normal',
    textDecoration: `${fontStyles.underline ? 'underline' : ''} ${fontStyles.strikethrough ? 'line-through' : ''}`.trim() || undefined,
    textAlign,
    verticalAlign,
    color: textColor,
    backgroundColor,
    borderColor,
    opacity: opacity.whole / 100,
    padding: `${spacing.top}px ${spacing.right}px ${spacing.bottom}px ${spacing.left}px`,
    margin: `${spacing.global}px`,
    minHeight: `${rows * 24}px`,
    whiteSpace: wordWrap ? 'normal' : 'nowrap',
  };

  return (
    <div className="flex flex-col gap-2 pt-4 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Textarea
        rows={rows}
        className="w-full rounded-md"
        placeholder={placeHolder}
        style={textareaStyles}
        readOnly
        disabled
      />
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
    </div>
  );
}

function FormComponent({
  elementInstance
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { 
    label, 
    required, 
    placeHolder, 
    helperText, 
    rows,
    fontFamily,
    fontSize,
    fontStyles,
    textAlign,
    verticalAlign,
    textColor,
    backgroundColor,
    borderColor,
    opacity,
    spacing,
    wordWrap
  } = element.extraAttributes;

  const textareaStyles: TextareaStyles = {
    fontFamily,
    fontSize: `${fontSize}px`,
    fontWeight: fontStyles.bold ? 'bold' : 'normal',
    fontStyle: fontStyles.italic ? 'italic' : 'normal',
    textDecoration: `${fontStyles.underline ? 'underline' : ''} ${fontStyles.strikethrough ? 'line-through' : ''}`.trim() || undefined,
    textAlign,
    verticalAlign,
    color: textColor,
    backgroundColor,
    borderColor,
    opacity: opacity.whole / 100,
    padding: `${spacing.top}px ${spacing.right}px ${spacing.bottom}px ${spacing.left}px`,
    margin: `${spacing.global}px`,
    minHeight: `${rows * 24}px`,
    whiteSpace: wordWrap ? 'normal' : 'nowrap',
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label>
        {label}
        {required && "*"}
      </Label>
      <Textarea
        rows={rows}
        className="w-full rounded-md"
        placeholder={placeHolder}
        style={textareaStyles}
      />
      {helperText && (
        <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
      )}
    </div>
  );
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { updateElement } = useDesigner();
  
  const form = useForm<propertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      ...element.extraAttributes,
      textAlign: element.extraAttributes.textAlign as TextAlign,
      verticalAlign: element.extraAttributes.verticalAlign as VerticalAlign,
    },
  });

  React.useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: propertiesFormSchemaType) {
    const { textAlign, verticalAlign, ...rest } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        ...rest,
        textAlign: textAlign as TextAlign,
        verticalAlign: verticalAlign as VerticalAlign,
      },
    });
  }

  const fontFamilyOptions = [
    "Arial",
    "Times New Roman",
    "Verdana",
    "Georgia",
    "Courier New",
  ];

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-3"
      >
        {/* Basic Fields Section */}
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="font-medium">Basic Fields</h3>
          
          <FormField
            control={form.control}
            name="label"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Label</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
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
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rows"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rows {field.value}</FormLabel>
                <FormControl>
                  <Slider
                    defaultValue={[field.value]}
                    min={1}
                    max={10}
                    step={1}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Font Section */}
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="font-medium">Font Settings</h3>
          
          <FormField
            control={form.control}
            name="fontFamily"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Font Family</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select font family" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {fontFamilyOptions.map((font) => (
                      <SelectItem key={font} value={font}>
                        {font}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fontSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Font Size {field.value}px</FormLabel>
                <FormControl>
                  <Slider
                    defaultValue={[field.value]}
                    min={8}
                    max={72}
                    step={1}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <FormLabel>Font Styles</FormLabel>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant={form.watch("fontStyles.bold") ? "default" : "outline"}
                onClick={() => {
                  const current = form.getValues("fontStyles.bold");
                  form.setValue("fontStyles.bold", !current);
                  form.handleSubmit(applyChanges)();
                }}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant={form.watch("fontStyles.italic") ? "default" : "outline"}
                onClick={() => {
                  const current = form.getValues("fontStyles.italic");
                  form.setValue("fontStyles.italic", !current);
                  form.handleSubmit(applyChanges)();
                }}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant={form.watch("fontStyles.underline") ? "default" : "outline"}
                onClick={() => {
                  const current = form.getValues("fontStyles.underline");
                  form.setValue("fontStyles.underline", !current);
                  form.handleSubmit(applyChanges)();
                }}
              >
                <Underline className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant={form.watch("fontStyles.strikethrough") ? "default" : "outline"}
                onClick={() => {
                  const current = form.getValues("fontStyles.strikethrough");
                  form.setValue("fontStyles.strikethrough", !current);
                  form.handleSubmit(applyChanges)();
                }}
              >
                <Strikethrough className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Alignment Section */}
        <div className="space-y-4 rounded-lg border p-4">
          <FormField
            control={form.control}
            name="textAlign"
            render={({ field }) => (
              <FormItem>
                <FormLabel><h3 className="font-medium">Text Alignment</h3></FormLabel>
                <FormControl>
                  <ToggleGroup
                    type="single"
                    value={field.value}
                    onValueChange={(value) => {
                      if (value) field.onChange(value);
                    }}
                  >
                    <ToggleGroupItem value="left" aria-label="Left align">
                      <AlignLeft className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="center" aria-label="Center align">
                      <AlignCenter className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="right" aria-label="Right align">
                      <AlignRight className="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="justify" aria-label="Justify">
                      <AlignJustify className="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Colors Section */}
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="font-medium">Colors</h3>
          
          <FormField
            control={form.control}
            name="textColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text Color</FormLabel>
                <FormControl>
                  <Input
                    type="color"
                    className="h-10 w-full"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="backgroundColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Background Color</FormLabel>
                <FormControl>
                  <Input
                    type="color"
                    className="h-10 w-full"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="borderColor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Border Color</FormLabel>
                <FormControl>
                  <Input
                    type="color"
                    className="h-10 w-full"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Spacing Section */}
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="font-medium">Spacing</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="spacing.top"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Top {field.value}px</FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="spacing.right"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Right {field.value}px</FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="spacing.bottom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bottom {field.value}px</FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="spacing.left"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Left {field.value}px</FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => field.onChange(value[0])}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Other Options Section */}
        <div className="space-y-4 rounded-lg border p-4">
          <h3 className="font-medium">Other Options</h3>
          
          <FormField
            control={form.control}
            name="opacity.whole"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Element Opacity {field.value}%</FormLabel>
                <FormControl>
                  <Slider
                    defaultValue={[field.value]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="opacity.text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Text Opacity {field.value}%</FormLabel>
                <FormControl>
                  <Slider
                    defaultValue={[field.value]}
                    min={0}
                    max={100}
                    step={1}
                    onValueChange={(value) => field.onChange(value[0])}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="wordWrap"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel>Word Wrap</FormLabel>
                  <FormDescription>
                    Automatically wrap text to the next line
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
        </div>
      </form>
    </Form>
  );
}