"use client";

import * as React from "react";
import { CalendarIcon, Clock } from "lucide-react";
import { format as dateFormat, parse, isAfter, isBefore, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ElementsType, FormElement, FormElementInstance } from "@/components/FormElements";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import useDesigner from "@/hooks/useDesigner";

const type: ElementsType = "DateField";

const dateFormats = [
  { value: "MM/dd/yyyy", label: "MM/dd/yyyy: 12/31/2023" },
  { value: "yyyy/MM/dd", label: "yyyy/MM/dd: 2023/12/31" },
  { value: "yyyy-MM-dd", label: "yyyy-MM-dd: 2023-12-31" },
  { value: "dd-MM-yyyy", label: "dd-MM-yyyy: 31-12-2023" },
  { value: "MM-dd-yyyy", label: "MM-dd-yyyy: 12-31-2023" },
  { value: "dd MMM yyyy", label: "dd MMM yyyy: 31 Dec 2023" },
  { value: "MMM dd, yyyy", label: "MMM dd, yyyy: Dec 31, 2023" },
  { value: "MMMM d, yyyy", label: "MMMM d, yyyy: December 31, 2023" },
  { value: "yyyy-MM-dd'T'HH:mm:ssXXX", label: "ISO 8601 format: 2023-04-06T14:30:45Z" },
];

const timeFormats = [
  { value: "HH:mm", label: "HH:mm (e.g., 14:30)" },
  { value: "HH:mm:ss", label: "HH:mm:ss (e.g., 14:30:45)" },
  { value: "hh:mm a", label: "hh:mm AM/PM (e.g., 02:30 PM)" },
  { value: "hh:mm:ss a", label: "hh:mm:ss AM/PM (e.g., 02:30:45 PM)" },
];

const extraAttributes = {
  label: "Date",
  helperText: "Pick a date",
  required: false,
  placeHolder: "Select a date",
  useRangePicker: false,
  rangePickerLabels: ["Start Date", "End Date"],
  defaultDate: null,
  dateFormat: "MM/dd/yyyy",
  disabledDays: [],
  enableDateRestriction: false,
  minDate: null,
  maxDate: null,
  enableTimePicker: false,
  timeFormat: "HH:mm",
  timeFormatType: "24" as "12" | "24",
  styles: {
    fontSize: 16,
    borderColor: "#000000",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    textOpacity: 100,
    elementOpacity: 100,
  },
};

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeHolder: z.string().max(50),
  useRangePicker: z.boolean().default(false),
  rangePickerLabels: z.array(z.string()).length(2),
  defaultDate: z.string().nullable(),
  dateFormat: z.string(),
  disabledDays: z.array(z.date()),
  enableDateRestriction: z.boolean().default(false),
  minDate: z.string().nullable(),
  maxDate: z.string().nullable(),
  enableTimePicker: z.boolean().default(false),
  timeFormat: z.string(),
  timeFormatType: z.enum(["12", "24"]),
  styles: z.object({
    fontSize: z.number().min(8).max(32),
    borderColor: z.string(),
    backgroundColor: z.string(),
    textColor: z.string(),
    textOpacity: z.number().min(0).max(100),
    elementOpacity: z.number().min(0).max(100),
  }),
});

export const DateFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: CalendarIcon,
    label: "Date Field",
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
  const { label, helperText, required, placeHolder, useRangePicker, rangePickerLabels, styles, enableDateRestriction, minDate, maxDate, dateFormat: dateFormatString, enableTimePicker, timeFormat, timeFormatType } = element.extraAttributes;

  const styleProps = {
    fontSize: `${styles.fontSize}px`,
    borderColor: styles.borderColor,
    backgroundColor: styles.backgroundColor,
  };

  const elementStyle = {
    ...styleProps,
    opacity: styles.elementOpacity / 100,
  };

  const textStyle = {
    color: styles.textColor,
    opacity: styles.textOpacity / 100,
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground" style={textStyle}>
        {label}
        {required && "*"}
      </Label>
      <div className="flex gap-2">
        {useRangePicker ? (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !rangePickerLabels[0] && "text-muted-foreground")} style={elementStyle}>
                  <CalendarIcon className="mr-2 h-4 w-4" style={textStyle} />
                  <span style={textStyle}>{rangePickerLabels[0] || placeHolder}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar 
                  disabled={(date) => {
                    if (enableDateRestriction && minDate && maxDate) {
                      const minDateObj = parseISO(minDate);
                      const maxDateObj = parseISO(maxDate);
                      return isBefore(date, minDateObj) || isAfter(date, maxDateObj);
                    }
                    return false;
                  }}
                />
                {enableTimePicker && (
                  <div className="p-3 border-t">
                    <div className="flex gap-2 mb-2">
                      <Select defaultValue={timeFormatType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Time Format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12">12 Hours</SelectItem>
                          <SelectItem value="24">24 Hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue={timeFormat}>
                        <SelectTrigger>
                          <SelectValue placeholder="Display Format" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeFormats.map((format) => (
                            <SelectItem key={format.value} value={format.value}>
                              {format.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-center">
                      <Clock className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !rangePickerLabels[1] && "text-muted-foreground")} style={elementStyle}>
                  <CalendarIcon className="mr-2 h-4 w-4" style={textStyle} />
                  <span style={textStyle}>{rangePickerLabels[1] || placeHolder}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar 
                  disabled={(date) => {
                    if (enableDateRestriction && minDate && maxDate) {
                      const minDateObj = parseISO(minDate);
                      const maxDateObj = parseISO(maxDate);
                      return isBefore(date, minDateObj) || isAfter(date, maxDateObj);
                    }
                    return false;
                  }}
                />
                {enableTimePicker && (
                  <div className="p-3 border-t">
                    <div className="flex gap-2 mb-2">
                      <Select defaultValue={timeFormatType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Time Format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12">12 Hours</SelectItem>
                          <SelectItem value="24">24 Hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue={timeFormat}>
                        <SelectTrigger>
                          <SelectValue placeholder="Display Format" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeFormats.map((format) => (
                            <SelectItem key={format.value} value={format.value}>
                              {format.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-center">
                      <Clock className="h-4 w-4" />
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !placeHolder && "text-muted-foreground")} style={elementStyle}>
                <CalendarIcon className="mr-2 h-4 w-4" style={textStyle} />
                <span style={textStyle}>{placeHolder}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar 
                disabled={(date) => {
                  if (enableDateRestriction && minDate && maxDate) {
                    const minDateObj = parseISO(minDate);
                    const maxDateObj = parseISO(maxDate);
                    return isBefore(date, minDateObj) || isAfter(date, maxDateObj);
                  }
                  return false;
                }}
              />
              {enableTimePicker && (
                <div className="p-3 border-t">
                  <div className="flex gap-2 mb-2">
                    <Select defaultValue={timeFormatType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Time Format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12 Hours</SelectItem>
                        <SelectItem value="24">24 Hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue={timeFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Display Format" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeFormats.map((format) => (
                          <SelectItem key={format.value} value={format.value}>
                            {format.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-center">
                    <Clock className="h-4 w-4" />
                  </div>
                </div>
              )}
            </PopoverContent>
          </Popover>
        )}
      </div>
      {helperText && <p className="text-muted-foreground text-[0.8rem]" style={textStyle}>{helperText}</p>}
    </div>
  );
}

interface TimePickerInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  max?: number;
  min?: number;
}

function TimePickerInput({ value, onChange, label, max = 59, min = 0 }: TimePickerInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newVal = ((parseInt(value) + 1) > max ? min : parseInt(value) + 1).toString().padStart(2, '0');
      onChange(newVal);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newVal = ((parseInt(value) - 1) < min ? max : parseInt(value) - 1).toString().padStart(2, '0');
      onChange(newVal);
    }
  };

  return (
    <div className="grid gap-1 text-center">
      <Label className="text-xs">{label}</Label>
      <Input
        className="w-16 text-center"
        value={value}
        onChange={(e) => {
          const newVal = e.target.value.replace(/\D/g, '');
          if (newVal.length <= 2) {
            const formatted = newVal.padStart(2, '0');
            if (parseInt(formatted) <= max && parseInt(formatted) >= min) {
              onChange(formatted);
            }
          }
        }}
        onKeyDown={handleKeyDown}
        inputMode="numeric"
        maxLength={2}
      />
    </div>
  );
}

function TimePicker({ 
  date, 
  onChange, 
  use12Hours, 
  timeFormat
}: { 
  date: Date; 
  onChange: (date: Date) => void; 
  use12Hours: boolean;
  timeFormat: string;
}) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const period = hours >= 12 ? 'PM' : 'AM';

  const display12Hour = (hour: number) => {
    if (hour === 0) return 12;
    if (hour > 12) return hour - 12;
    return hour;
  };

  const setHours = (newHours: string) => {
    const h = parseInt(newHours);
    const newDate = new Date(date);
    if (use12Hours) {
      const actualHours = period === 'PM' ? (h === 12 ? 12 : h + 12) : (h === 12 ? 0 : h);
      newDate.setHours(actualHours);
    } else {
      newDate.setHours(h);
    }
    onChange(newDate);
  };

  const setPeriod = (newPeriod: string) => {
    const newDate = new Date(date);
    const currentHours = date.getHours();
    const is12Hour = currentHours === 12;
    const isPM = newPeriod === 'PM';

    if (isPM && currentHours < 12) {
      newDate.setHours(currentHours + 12);
    } else if (!isPM && currentHours >= 12) {
      newDate.setHours(currentHours - 12);
    }
    onChange(newDate);
  };

  const showSeconds = timeFormat.includes('ss');

  return (
    <div className="flex items-end gap-2">
      <TimePickerInput
        label="Hours"
        value={use12Hours ? display12Hour(hours).toString().padStart(2, '0') : hours.toString().padStart(2, '0')}
        onChange={setHours}
        max={use12Hours ? 12 : 23}
        min={use12Hours ? 1 : 0}
      />
      <TimePickerInput
        label="Minutes"
        value={minutes.toString().padStart(2, '0')}
        onChange={(newMinutes) => {
          const newDate = new Date(date);
          newDate.setMinutes(parseInt(newMinutes));
          onChange(newDate);
        }}
      />
      {showSeconds && (
        <TimePickerInput
          label="Seconds"
          value={seconds.toString().padStart(2, '0')}
          onChange={(newSeconds) => {
            const newDate = new Date(date);
            newDate.setSeconds(parseInt(newSeconds));
            onChange(newDate);
          }}
        />
      )}
      {use12Hours && (
        <div className="grid gap-1 text-center">
          <Label className="text-xs">Period</Label>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[70px]">
              <SelectValue>{period}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      <div className="flex h-10 items-center">
        <Clock className="ml-2 h-4 w-4" />
      </div>
    </div>
  );
}

function FormComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance;
  const { label, helperText, required, placeHolder, useRangePicker, rangePickerLabels, dateFormat: dateFormatString, styles, enableDateRestriction, minDate, maxDate, enableTimePicker, timeFormat: initialTimeFormat, timeFormatType: initialTimeFormatType } = element.extraAttributes;

  const [date, setDate] = React.useState<Date | null>(null);
  const [dateRange, setDateRange] = React.useState<[Date | null, Date | null, boolean]>([null, null, false]);
  const [timeFormatType, setTimeFormatType] = React.useState<"12" | "24">(initialTimeFormatType);
  const [timeFormat, setTimeFormat] = React.useState(initialTimeFormat);

  const styleProps = {
    fontSize: `${styles.fontSize}px`,
    borderColor: styles.borderColor,
    backgroundColor: styles.backgroundColor,
  };

  const elementStyle = {
    ...styleProps,
    opacity: styles.elementOpacity / 100,
  };

  const textStyle = {
    color: styles.textColor,
    opacity: styles.textOpacity / 100,
  };

  const formatTime = (date: Date) => {
    return dateFormat(date, timeFormat);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label style={textStyle}>
        {label}
        {required && "*"}
      </Label>
      <div className="flex gap-2">
        {useRangePicker ? (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !dateRange[0] && "text-muted-foreground")} style={elementStyle}>
                  <CalendarIcon className="mr-2 h-4 w-4" style={textStyle} />
                  <span style={textStyle}>
                    {dateRange[0] 
                      ? `${dateFormat(dateRange[0], dateFormatString)}${enableTimePicker ? ` ${formatTime(dateRange[0])}` : ''}`
                      : rangePickerLabels[0] || placeHolder}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange[0] || undefined}
                  onSelect={(newDate) => {
                    if (newDate) {
                      const date = dateRange[0] || newDate;
                      setDateRange([date, dateRange[1], true]);
                    }
                  }}
                  disabled={(date) => enableDateRestriction && minDate && maxDate
                    ? isBefore(date, parseISO(minDate)) || isAfter(date, parseISO(maxDate))
                    : false
                  }
                />
                {enableTimePicker && dateRange[0] && (
                  <div className="p-3 border-t">
                    <div className="mb-4 flex gap-2">
                      <Select value={timeFormatType} onValueChange={(value: "12" | "24") => setTimeFormatType(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Time Format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12">12 Hours</SelectItem>
                          <SelectItem value="24">24 Hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={timeFormat} onValueChange={setTimeFormat}>
                        <SelectTrigger>
                          <SelectValue placeholder="Display Format" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeFormats.map((format) => (
                            <SelectItem key={format.value} value={format.value}>
                              {format.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <TimePicker
                      date={dateRange[0]}
                      onChange={(newDate) => setDateRange([newDate, dateRange[1], true])}
                      use12Hours={timeFormatType === "12"}
                      timeFormat={timeFormat}
                    />
                  </div>
                )}
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", (!dateRange[1] || !dateRange[2]) && "text-muted-foreground")} style={elementStyle} disabled={!dateRange[2]}>
                  <CalendarIcon className="mr-2 h-4 w-4" style={textStyle} />
                  <span style={textStyle}>
                    {dateRange[1] && dateRange[2]
                      ? `${dateFormat(dateRange[1], dateFormatString)}${enableTimePicker ? ` ${formatTime(dateRange[1])}` : ''}`
                      : rangePickerLabels[1] || placeHolder}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dateRange[1] || undefined}
                  onSelect={(newDate) => {
                    if (newDate) {
                      setDateRange([dateRange[0], newDate, dateRange[2]]);
                    }
                  }}
                  disabled={(date) => {
                    if (!dateRange[2]) return true;
                    if (dateRange[0] && isBefore(date, dateRange[0])) return true;
                    if (enableDateRestriction && minDate && maxDate) {
                      return isBefore(date, parseISO(minDate)) || isAfter(date, parseISO(maxDate));
                    }
                    return false;
                  }}
                />
                {enableTimePicker && dateRange[1] && (
                  <div className="p-3 border-t">
                    <div className="mb-4 flex gap-2">
                      <Select value={timeFormatType} onValueChange={(value: "12" | "24") => setTimeFormatType(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Time Format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="12">12 Hours</SelectItem>
                          <SelectItem value="24">24 Hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={timeFormat} onValueChange={setTimeFormat}>
                        <SelectTrigger>
                          <SelectValue placeholder="Display Format" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeFormats.map((format) => (
                            <SelectItem key={format.value} value={format.value}>
                              {format.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <TimePicker
                      date={dateRange[1]}
                      onChange={(newDate) => setDateRange([dateRange[0], newDate, dateRange[2]])}
                      use12Hours={timeFormatType === "12"}
                      timeFormat={timeFormat}
                    />
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")} style={elementStyle}>
                <CalendarIcon className="mr-2 h-4 w-4" style={textStyle} />
                <span style={textStyle}>
                  {date 
                    ? `${dateFormat(date, dateFormatString)}${enableTimePicker ? ` ${formatTime(date)}` : ''}`
                    : placeHolder}
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date || undefined}
                onSelect={(newDate) => {
                  if (newDate) {
                    const currentDate = date || newDate;
                    setDate(currentDate);
                  }
                }}
                disabled={(date) =>
                  enableDateRestriction && minDate && maxDate
                    ? isBefore(date, parseISO(minDate)) || isAfter(date, parseISO(maxDate))
                    : false
                }
              />
              {enableTimePicker && date && (
                <div className="p-3 border-t">
                  <div className="mb-4 flex gap-2">
                    <Select value={timeFormatType} onValueChange={(value: "12" | "24") => setTimeFormatType(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Time Format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12 Hours</SelectItem>
                        <SelectItem value="24">24 Hours</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={timeFormat} onValueChange={setTimeFormat}>
                      <SelectTrigger>
                        <SelectValue placeholder="Display Format" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeFormats.map((format) => (
                          <SelectItem key={format.value} value={format.value}>
                            {format.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <TimePicker
                    date={date}
                    onChange={setDate}
                    use12Hours={timeFormatType === "12"}
                    timeFormat={timeFormat}
                  />
                </div>
              )}
            </PopoverContent>
          </Popover>
        )}
      </div>
      {helperText && <p className="text-muted-foreground text-[0.8rem]" style={textStyle}>{helperText}</p>}
    </div>
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
      ...element.extraAttributes,
    },
  });

  React.useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: PropertiesFormSchemaType) {
    const { timeFormatType, ...rest } = values;
    updateElement(element.id, {
      ...element,
      extraAttributes: {
        ...rest,
        timeFormatType: timeFormatType as "12" | "24",
      },
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
                  Make this field required
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
          name="placeHolder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="useRangePicker"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Use Range Picker</FormLabel>
                <FormDescription>
                  Enable date range selection
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

        {form.watch("useRangePicker") && (
          <>
            <FormField
              control={form.control}
              name="rangePickerLabels.0"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date Label</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rangePickerLabels.1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date Label</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="dateFormat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date Format</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {dateFormats.map((format) => (
                    <SelectItem key={format.value} value={format.value}>
                      {format.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="enableDateRestriction"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Enable Date Restriction</FormLabel>
                <FormDescription>
                  Restrict selectable dates to a specific range
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

        {form.watch("enableDateRestriction") && (
          <>
            <FormField
              control={form.control}
              name="minDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      value={field.value || ''} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maxDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Date</FormLabel>
                  <FormControl>
                    <Input 
                      type="date" 
                      {...field} 
                      value={field.value || ''} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="enableTimePicker"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Enable Time Picker</FormLabel>
                <FormDescription>
                  Allow time selection along with date
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

        {form.watch("enableTimePicker") && (
          <>
            <FormField
              control={form.control}
              name="timeFormatType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Format Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time format type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="12">12 Hours</SelectItem>
                      <SelectItem value="24">24 Hours</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="timeFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Display Format</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time display format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {timeFormats.map((format) => (
                        <SelectItem key={format.value} value={format.value}>
                          {format.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          </>
        )}

        <FormField
          control={form.control}
          name="styles.fontSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Font Size {field.value}px</FormLabel>
              <FormControl>
                <Slider
                  min={8}
                  max={32}
                  step={1}
                  defaultValue={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="styles.borderColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Border Color</FormLabel>
              <FormControl>
                <Input type="color" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="styles.backgroundColor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Background Color</FormLabel>
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

        <FormField
          control={form.control}
          name="styles.textOpacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Text Opacity {field.value}%</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  defaultValue={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="styles.elementOpacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Element Opacity {field.value}%</FormLabel>
              <FormControl>
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  defaultValue={[field.value]}
                  onValueChange={(value) => field.onChange(value[0])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}