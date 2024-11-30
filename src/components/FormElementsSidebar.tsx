import React from 'react'
import SidebarBtnElement from '@/components/SidebarBtnElement'
import { FormElements } from '@/components/FormElements'
import { Separator } from './ui/separator'


function FormElementsSidebar() {
  return (
    <div className="w-[400px] max-w-[400px] flex flex-col flex-grow gap-2 border-l-2 border-muted p-4 bg-background overflow-y-auto h-full">
        <p className='text-sm text-foreground/70'>Drag and drop elements</p>
        <Separator className='my-2' />
        <p className='text-sm text-foreground/70'>Root Elements</p>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 place-items-center'>
        <SidebarBtnElement formElement={FormElements.BackgroundElement} />
        <SidebarBtnElement formElement={FormElements.FormBG} />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 place-items-center'>
          <p className='text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start'>Layout Elements</p>
          <SidebarBtnElement formElement={FormElements.TitleField}/>
          <SidebarBtnElement formElement={FormElements.SubTitleField}/>
          <SidebarBtnElement formElement={FormElements.ParagraphField}/>
          <SidebarBtnElement formElement={FormElements.SeparatorField}/>
          <SidebarBtnElement formElement={FormElements.SpacerField}/>
          <SidebarBtnElement formElement={FormElements.ButtonField}/>
          <p className='text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start'>Form Elements</p>
          <SidebarBtnElement formElement={FormElements.TextField}/>
          <SidebarBtnElement formElement={FormElements.NumberField}/>
          <SidebarBtnElement formElement={FormElements.TextareaField}/>
          <SidebarBtnElement formElement={FormElements.DateField}/>
          <SidebarBtnElement formElement={FormElements.TimeField}/>
          <p className='text-sm text-muted-foreground col-span-1 md:col-span-2 my-2 place-self-start'>Form Response Elements</p>
          <SidebarBtnElement formElement={FormElements.SelectField}/>
          <SidebarBtnElement formElement={FormElements.RadioButtonField}/>
          <SidebarBtnElement formElement={FormElements.CheckboxField}/>
          <SidebarBtnElement formElement={FormElements.SliderField}/>
          <SidebarBtnElement formElement={FormElements.SwitchField}/>
          {/* <SidebarBtnElement formElement={FormElements.DateField}/> */}
        </div>
    </div>
  )
}

export default FormElementsSidebar



