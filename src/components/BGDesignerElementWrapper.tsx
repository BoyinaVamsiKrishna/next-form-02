"use client";

import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { FormElementInstance, FormElements } from '@/components/FormElements';
import { Button } from './ui/button';
import { BiSolidTrash } from 'react-icons/bi';

interface DesignerElementWrapperProps {
  element: FormElementInstance;
  removeElement: (id: string) => void;
  updateElement: (id: string, element: Partial<FormElementInstance>) => void;
}

function BGDesignerElementWrapper({
  element,
  removeElement,
  updateElement,
}: DesignerElementWrapperProps) {
  const [mouseIsOver, setMouseIsOver] = React.useState<boolean>(false);
  const DesignerElement = FormElements[element.type].designerComponent;
  
  const draggable = useDraggable({
    id: element.id + "-drag-handler",
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    }
  });

  if (draggable.isDragging) return null;

  return (
    <div 
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className='relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset'
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      onClick={(e) => {
        e.stopPropagation();
        // You might want to implement setSelectedElement here
      }}
    >
      {mouseIsOver && (
        <div className='absolute right-0 h-full'>
          <Button 
            className='flex justify-center h-full border rounded-md rounded-l-none bg-red-500'
            variant={'outline'}
            onClick={(e) => {
              e.stopPropagation();
              removeElement(element.id);
            }}
          >
            <BiSolidTrash className='text-foreground h-6 w-6' />
          </Button>
        </div>
      )}
      <div className='flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none'>
        <DesignerElement elementInstance={element} />
      </div>
    </div>
  );
}

export default BGDesignerElementWrapper;