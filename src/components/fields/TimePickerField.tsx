"use client"

import * as React from "react"
import { Clock } from "lucide-react"
import { format, parse, isAfter, isBefore, set } from "date-fns"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ElementsType, FormElement, FormElementInstance } from "@/components/FormElements"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import useDesigner from "@/hooks/useDesigner"

const type: ElementsType = "TimeField"

const extraAttributes = {
  label: "Time",
  helperText: "Pick a time",
  required: false,
  placeHolder: "Select a time",
  defaultTime: null,
  timeFormat: "HH:mm" as "HH:mm" | "HH:mm:ss" | "hh:mm a" | "hh:mm:ss a",
  disabled: false,
  styles: {
    fontSize: 16,
    borderColor: "#000000",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    textOpacity: 100,
    elementOpacity: 100,
  },
}

const propertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeHolder: z.string().max(50),
  defaultTime: z.string().nullable(),
  timeFormat: z.enum(["HH:mm", "HH:mm:ss", "hh:mm a", "hh:mm:ss a"]),
  disabled: z.boolean().default(false),
  styles: z.object({
    fontSize: z.number().min(8).max(32),
    borderColor: z.string(),
    backgroundColor: z.string(),
    textColor: z.string(),
    textOpacity: z.number().min(0).max(100),
    elementOpacity: z.number().min(0).max(100),
  }),
})

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes
}

// Utility functions
function isValidHour(value: string) {
  return /^(0[0-9]|1[0-9]|2[0-3])$/.test(value);
}

function isValid12Hour(value: string) {
  return /^(0[1-9]|1[0-2])$/.test(value);
}

function isValidMinuteOrSecond(value: string) {
  return /^[0-5][0-9]$/.test(value);
}

function getValidNumber(value: string, max: number, min: number = 0, loop: boolean = false) {
  let numericValue = parseInt(value, 10);
  if (!isNaN(numericValue)) {
    if (!loop) {
      if (numericValue > max) numericValue = max;
      if (numericValue < min) numericValue = min;
    } else {
      if (numericValue > max) numericValue = min;
      if (numericValue < min) numericValue = max;
    }
    return numericValue.toString().padStart(2, "0");
  }
  return "00";
}

function getValidHour(value: string) {
  if (isValidHour(value)) return value;
  return getValidNumber(value, 23);
}

function getValid12Hour(value: string) {
  if (isValid12Hour(value)) return value;
  return getValidNumber(value, 12, 1);
}

function getValidMinuteOrSecond(value: string) {
  if (isValidMinuteOrSecond(value)) return value;
  return getValidNumber(value, 59);
}

function getValidArrowNumber(value: string, min: number, max: number, step: number) {
  let numericValue = parseInt(value, 10);
  if (!isNaN(numericValue)) {
    numericValue += step;
    return getValidNumber(String(numericValue), max, min, true);
  }
  return "00";
}

function getValidArrowHour(value: string, step: number) {
  return getValidArrowNumber(value, 0, 23, step);
}

function getValidArrow12Hour(value: string, step: number) {
  return getValidArrowNumber(value, 1, 12, step);
}

function getValidArrowMinuteOrSecond(value: string, step: number) {
  return getValidArrowNumber(value, 0, 59, step);
}

function convert12HourTo24Hour(hour: number, period: "AM" | "PM") {
  if (period === "PM") {
    if (hour <= 11) {
      return hour + 12;
    } else {
      return hour;
    }
  } else if (period === "AM") {
    if (hour === 12) return 0;
    return hour;
  }
  return hour;
}

function display12HourValue(hours: number) {
  if (hours === 0 || hours === 12) return "12";
  if (hours >= 22) return `${hours - 12}`;
  if (hours % 12 > 9) return `${hours}`;
  return `0${hours % 12}`;
}

type TimePickerInputProps = {
  type: "hours" | "minutes" | "seconds" | "12hours"
  value: string
  onChange: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  max?: number
  min?: number
  disabled?: boolean
}

const TimePickerInput = React.forwardRef<HTMLInputElement, TimePickerInputProps>(
  ({ type, value, onChange, onFocus, onBlur, onKeyDown, max, min, disabled }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.replace(/\D/g, "").slice(0, 2);
      let validatedValue = "";
      switch (type) {
        case "hours":
          validatedValue = getValidHour(newValue);
          break;
        case "12hours":
          validatedValue = getValid12Hour(newValue);
          break;
        case "minutes":
        case "seconds":
          validatedValue = getValidMinuteOrSecond(newValue);
          break;
      }
      onChange(validatedValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (onKeyDown) {
        onKeyDown(e);
      }
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        e.preventDefault();
        const step = e.key === "ArrowUp" ? 1 : -1;
        let newValue = "";
        switch (type) {
          case "hours":
            newValue = getValidArrowHour(value, step);
            break;
          case "12hours":
            newValue = getValidArrow12Hour(value, step);
            break;
          case "minutes":
          case "seconds":
            newValue = getValidArrowMinuteOrSecond(value, step);
            break;
        }
        onChange(newValue);
      }
    };

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="numeric"
        value={value}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        className="w-[48px] text-center font-mono"
        disabled={disabled}
      />
    );
  }
);

TimePickerInput.displayName = "TimePickerInput";

interface TimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  use12Hours: boolean
  enableSeconds: boolean
  disabled?: boolean
  selectedTime: string
  setSelectedTime: (time: string) => void
  timeFormat: string
}

function TimePicker({ 
  date, 
  setDate, 
  use12Hours, 
  enableSeconds, 
  disabled,
  selectedTime,
  setSelectedTime,
  timeFormat
}: TimePickerProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null)
  const hourRef = React.useRef<HTMLInputElement>(null)
  const secondRef = React.useRef<HTMLInputElement>(null)
  const selectedTimeRef = React.useRef<HTMLInputElement>(null)
  const [period, setPeriod] = React.useState<"AM" | "PM">("AM")

  const [hours, setHours] = React.useState("00")
  const [minutes, setMinutes] = React.useState("00")
  const [seconds, setSeconds] = React.useState("00")

  React.useEffect(() => {
    if (date) {
      setHours(use12Hours ? display12HourValue(date.getHours()) : getValidHour(String(date.getHours())))
      setMinutes(getValidMinuteOrSecond(String(date.getMinutes())))
      setSeconds(getValidMinuteOrSecond(String(date.getSeconds())))
      setPeriod(date.getHours() >= 12 ? "PM" : "AM")
    }
  }, [date, use12Hours])

  const updateDate = (newHours: string, newMinutes: string, newSeconds: string, newPeriod: "AM" | "PM") => {
    const newDate = new Date()
    let hours = parseInt(newHours, 10)
    if (use12Hours) {
      hours = convert12HourTo24Hour(hours, newPeriod)
    }
    newDate.setHours(hours, parseInt(newMinutes, 10), parseInt(newSeconds, 10))
    setDate(newDate)
    setSelectedTime(format(newDate, timeFormat))
  }

  const handleHourChange = (value: string) => {
    setHours(value)
    updateDate(value, minutes, seconds, period)
  }

  const handleMinuteChange = (value: string) => {
    setMinutes(value)
    updateDate(hours, value, seconds, period)
  }

  const handleSecondChange = (value: string) => {
    setSeconds(value)
    updateDate(hours, minutes, value, period)
  }

  const handlePeriodChange = (newPeriod: "AM" | "PM") => {
    setPeriod(newPeriod)
    updateDate(hours, minutes, seconds, newPeriod)
  }

  const handleSelectedTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value
    setSelectedTime(newTime)
    const parsedDate = parse(newTime, timeFormat, new Date())
    if (!isNaN(parsedDate.getTime())) {
      setDate(parsedDate)
      setHours(use12Hours ? display12HourValue(parsedDate.getHours()) : getValidHour(String(parsedDate.getHours())))
      setMinutes(getValidMinuteOrSecond(String(parsedDate.getMinutes())))
      setSeconds(getValidMinuteOrSecond(String(parsedDate.getSeconds())))
      setPeriod(parsedDate.getHours() >= 12 ? "PM" : "AM")
    }
  }

  // Calculate the width of the selected time input
  const getSelectedTimeInputWidth = () => {
    const baseWidth = 70; // Base width for the input
    const charWidth = 8; // Approximate width of each character
    return baseWidth + selectedTime.length * charWidth;
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-end gap-2">
        <div className="grid gap-1 text-center">
          <Label htmlFor="hours" className="text-xs">
            Hours
          </Label>
          <TimePickerInput
            ref={hourRef}
            type={use12Hours ? "12hours" : "hours"}
            value={hours}
            onChange={handleHourChange}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault()
                minuteRef.current?.focus()
              }
            }}
            disabled={disabled}
          />
        </div>
        <div className="grid gap-1 text-center">
          <Label htmlFor="minutes" className="text-xs">
            Minutes
          </Label>
          <TimePickerInput
            ref={minuteRef}
            type="minutes"
            value={minutes}
            onChange={handleMinuteChange}
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                e.preventDefault()
                hourRef.current?.focus()
              } else if (e.key === "ArrowRight" && enableSeconds) {
                e.preventDefault()
                secondRef.current?.focus()
              }
            }}
            disabled={disabled}
          />
        </div>
        {enableSeconds && (
          <div className="grid gap-1 text-center">
            <Label htmlFor="seconds" className="text-xs">
              Seconds
            </Label>
            <TimePickerInput
              ref={secondRef}
              type="seconds"
              value={seconds}
              onChange={handleSecondChange}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") {
                  e.preventDefault()
                  minuteRef.current?.focus()
                }
              }}
              disabled={disabled}
            />
          </div>
        )}
        {use12Hours && (
          <div className="grid gap-1 text-center">
            <Label className="text-xs">Period</Label>
            <Select value={period} onValueChange={handlePeriodChange} disabled={disabled}>
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
      </div>
      <div className="grid gap-1 text-center">
      <Label className="text-xs">Selected Time</Label>
      <div className="flex flex-row gap-2">
        <Input
          id="selectedTime"
          ref={selectedTimeRef}
          value={selectedTime}
          onChange={handleSelectedTimeChange}
          placeholder={timeFormat}
          className="flex text-center font-mono"
          style={{ width: `${getSelectedTimeInputWidth()}px` }}
          readOnly
          disabled={disabled}
        />
          <div className="flex h-10 items-center">
            <Clock className="h-4 w-4" />
          </div>

        </div>
      </div>

    </div>
  )
}

export const TimePickerFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: Clock,
    label: "Time Picker",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,
}

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance
  const { label, helperText, required, placeHolder, styles } = element.extraAttributes

  const styleProps = {
    fontSize: `${styles.fontSize}px`,
    borderColor: styles.borderColor,
    backgroundColor: styles.backgroundColor,
  }

  const elementStyle = {
    ...styleProps,
    opacity: styles.elementOpacity / 100,
  }

  const textStyle = {
    color: styles.textColor,
    opacity: styles.textOpacity / 100,
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground" style={textStyle}>
        {label}
        {required && "*"}
      </Label>
      <Button
        variant="outline"
        className={cn(
          "w-full justify-start text-left font-normal",
          "text-muted-foreground"
        )}
        style={elementStyle}
      >
        <Clock className="mr-2 h-4 w-4" style={textStyle} />
        <span style={textStyle}>{placeHolder}</span>
      </Button>
      {helperText && <p className="text-muted-foreground text-[0.8rem]" style={textStyle}>{helperText}</p>}
    </div>
  )
}

function FormComponent({ 
  elementInstance,
  defaultValue,
  onValueChange,
  isValid,
}: { 
  elementInstance: FormElementInstance
  defaultValue?: string
  onValueChange?: (value: string) => void
  isValid?: boolean
}) {
  const element = elementInstance as CustomInstance
  const { 
    label, 
    helperText, 
    required, 
    placeHolder,
    timeFormat,
    disabled,
    styles 
  } = element.extraAttributes

  const [time, setTime] = React.useState<Date | undefined>(defaultValue ? new Date(`1970-01-01T${defaultValue}`) : undefined)
  const [selectedTime, setSelectedTime] = React.useState(defaultValue || "")

  const styleProps = {
    fontSize: `${styles.fontSize}px`,
    borderColor: styles.borderColor,
    backgroundColor: styles.backgroundColor,
  }

  const elementStyle = {
    ...styleProps,
    opacity: styles.elementOpacity / 100,
  }

  const textStyle = {
    color: styles.textColor,
    opacity: styles.textOpacity / 100,
  }

  const handleTimeChange = (newTime: Date | undefined) => {
    setTime(newTime);
    if (newTime) {
      const formattedTime = format(newTime, timeFormat);
      setSelectedTime(formattedTime);
      onValueChange?.(formattedTime);
    } else {
      setSelectedTime("");
      onValueChange?.("");
    }
  };

  const use12Hours = timeFormat.includes("a")
  const enableSeconds = timeFormat.includes("ss")

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label style={textStyle}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <TimePicker
        date={time}
        setDate={handleTimeChange}
        use12Hours={use12Hours}
        enableSeconds={enableSeconds}
        disabled={disabled}
        selectedTime={selectedTime}
        setSelectedTime={(newTime) => {
          setSelectedTime(newTime);
          onValueChange?.(newTime);
        }}
        timeFormat={timeFormat}
      />
      {helperText && (
        <p 
          className="text-muted-foreground text-[0.8rem]"
          style={textStyle}
        >
          {helperText}
        </p>
      )}
    </div>
  )
}

type PropertiesFormSchemaType = z.infer<typeof propertiesSchema>

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
  const element = elementInstance as CustomInstance
  const { updateElement } = useDesigner()

  const form = useForm<PropertiesFormSchemaType>({
    resolver: zodResolver(propertiesSchema),
    mode: "onBlur",
    defaultValues: {
      ...element.extraAttributes,
    },
  })

  React.useEffect(() => {
    form.reset(element.extraAttributes)
  }, [element, form])

  function applyChanges(values: PropertiesFormSchemaType) {
    updateElement(element.id, {
      ...element,
      extraAttributes: values,
    })
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
          name="timeFormat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Format</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time format" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="HH:mm">24-hour (14:30)</SelectItem>
                  <SelectItem value="HH:mm:ss">24-hour with seconds (14:30:45)</SelectItem>
                  <SelectItem value="hh:mm a">12-hour (02:30 PM)</SelectItem>
                  <SelectItem value="hh:mm:ss a">12-hour with seconds (02:30:45 PM)</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="disabled"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Disabled</FormLabel>
                <FormDescription>
                  Disable the time picker
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
  )
}