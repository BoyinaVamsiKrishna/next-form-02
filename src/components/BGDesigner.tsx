"use client";

import React from 'react';
import { useDndMonitor, useDroppable } from '@dnd-kit/core';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ElementsType, FormElementInstance, FormElements } from '@/components/FormElements';
import BGDesignerElementWrapper from '@/components/BGDesignerElementWrapper';

interface DesignerProps {
  elements: FormElementInstance[];
  addElement: (index: number, element: FormElementInstance) => void;
  removeElement: (id: string) => void;
  selectedElement: FormElementInstance | null;
  setSelectedElement: React.Dispatch<React.SetStateAction<FormElementInstance | null>>;
  updateElement: (id: string, element: Partial<FormElementInstance>) => void;
}

function BGDesigner({
  elements,
  addElement,
  removeElement,
  selectedElement,
  setSelectedElement,
  updateElement
}: DesignerProps) {
  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  });

  useDndMonitor({
    onDragEnd: (event) => {
      const { active, over } = event;
      if (!active || !over) return;

      const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;
      const isDroppingOverDesignerDropArea = over.data?.current?.isDesignerDropArea;

      const droppingSidebarBtnOverDesignerDropArea =
        isDesignerBtnElement && isDroppingOverDesignerDropArea;

      if (droppingSidebarBtnOverDesignerDropArea) {
        const type = active.data?.current?.type as ElementsType;
        const newElement = FormElements[type].construct(crypto.randomUUID());
        addElement(elements.length, newElement);
      }
    },
  });

  return (
    <div className="flex w-full h-full">
      <div className="p-4 w-full">
        <Card 
          onClick={() => {
            if (selectedElement) setSelectedElement(null);
          }}
          className='h-full border-r-2 bg-primary rounded-lg p-4'
        >
          <div
            ref={droppable.setNodeRef}
            className={cn(
              "bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto",
              droppable.isOver && "ring-4 ring-primary ring-inset"
            )}
          >
            {!droppable.isOver && elements.length === 0 && (
              <p className="text-3xl text-muted-foreground flex flex-grow items-center font-bold">
                Drop here
              </p>
            )}
            {droppable.isOver && elements.length === 0 && (
              <div className='p-4 w-full'>
                <div className='h-[120px] w-full rounded-md bg-primary/20'></div>
              </div>
            )}
            {elements.length > 0 && (
              <div className='flex flex-col text-background w-full gap-2 p-4'>
                {elements.map((element) => (
                  <BGDesignerElementWrapper
                    key={element.id}
                    element={element}
                    removeElement={removeElement}
                    updateElement={updateElement}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default BGDesigner;