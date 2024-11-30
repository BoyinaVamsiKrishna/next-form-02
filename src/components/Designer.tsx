// "use client";

// import React, { useEffect } from 'react';
// import DesignerSidebar from './DesignerSidebar';
// import { useDndMonitor, useDraggable, useDroppable } from '@dnd-kit/core';
// import { Card } from '@/components/ui/card';
// import { cn } from '@/lib/utils';
// import useDesigner from '@/hooks/useDesigner';
// import { ElementsType, FormElementInstance, FormElements } from '@/components/FormElements';
// import { idGenerator } from '@/lib/idGenerator';
// import { DragEndEvent } from '@dnd-kit/core';
// import { Button } from './ui/button';
// import { BiSolidTrash } from 'react-icons/bi';
// import { FormBGProvider, useFormBG } from '@/components/context/FormBackgroundContext';
// import { useFormBackgroundState } from '@/hooks/useFormBg';

// function DesignerContent() {
//   const { elements, addElement, selectedElement, setSelectedElement, removeElement } = useDesigner();
//   const { getFormBackgroundStyle, formBackgroundState } = useFormBackgroundState();
//   useEffect(()=>{
//     console.log("Use Effect in Designer Component")
//     console.log(formBackgroundState)}, [formBackgroundState])
//   const droppable = useDroppable({
//     id: "designer-drop-area",
//     data: {
//       isDesignerDropArea: true,
//     },
//   });

//   useDndMonitor({
//     onDragEnd: (event: DragEndEvent) => {
//       const { active, over } = event;
//       if (!active || !over) return;

//       const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;
//       const isDroppingOverDesignerDropArea = over.data?.current?.isDesignerDropArea;

//       const droppingSidebarBtnOverDesignerDropArea = isDesignerBtnElement && isDroppingOverDesignerDropArea;

//       // First scenario
//       if (droppingSidebarBtnOverDesignerDropArea) {
//         const type = active.data?.current?.type;
//         const newElement = FormElements[type as ElementsType].construct(idGenerator());
//         addElement(elements.length, newElement);
//         return;
//       }

//       const isDroppingOverDesignerElementTopHalf = over.data?.current?.isTopHalfDesignerElement;
//       const isDroppingOverDesignerElementBottomHalf = over.data?.current?.isBottomHalfDesignerElement;
//       const isDroppingOverDesignerElement = isDroppingOverDesignerElementTopHalf || isDroppingOverDesignerElementBottomHalf;
//       const droppingSidebarBtnOverDesignerElement = isDesignerBtnElement && isDroppingOverDesignerElement;

//       // Second scenario
//       if (droppingSidebarBtnOverDesignerElement) {
//         const type = active.data?.current?.type;
//         const newElement = FormElements[type as ElementsType].construct(idGenerator());
//         const overId = over.data?.current?.elementId;
//         const overElementIndex = elements.findIndex((el) => el.id === overId);
//         if (overElementIndex === -1) {
//           throw new Error("Element not found");
//         }
//         let indexForNewElement = overElementIndex;
//         if (isDroppingOverDesignerElementBottomHalf) {
//           indexForNewElement = overElementIndex + 1;
//         }
//         addElement(indexForNewElement, newElement);
//         return;
//       }

//       // Third scenario
//       const isDraggingDesignerElement = active.data?.current?.isDesignerElement;
//       const draggingDesignerElementOverAnotherDesignerElement = isDroppingOverDesignerElement && isDraggingDesignerElement;

//       if (draggingDesignerElementOverAnotherDesignerElement) {
//         const activeId = active.data?.current?.elementId;
//         const overId = over.data?.current?.elementId;
//         const activeElementIndex = elements.findIndex((el) => el.id === activeId);
//         const overElementIndex = elements.findIndex((el) => el.id === overId);
//         if (activeElementIndex === -1 || overElementIndex === -1) {
//           throw new Error("Element not found");
//         }
//         const activeElement = { ...elements[activeElementIndex] };
//         removeElement(activeId);
//         let indexForNewElement = overElementIndex;
//         if (isDroppingOverDesignerElementBottomHalf) {
//           indexForNewElement = overElementIndex + 1;
//         }
//         addElement(indexForNewElement, activeElement);
//       }
//     }
//   });

//   return (
//     <div className="flex w-full h-full bg-none">
//       <div className="p-4 w-full">
//         <Card id="designercard" className='w-full h-full' style={getFormBackgroundStyle()}>
//           <div 
//             onClick={() => { if (selectedElement) setSelectedElement(null); }}
//             className='abcd h-full border-r-8 rounded-lg p-4'
//           >
//             <div 
//               ref={droppable.setNodeRef}
//               className={cn(
//                 "bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto",
//                 droppable.isOver && "ring-4 ring-primary ring-inset"
//               )}
//             >
//               {!droppable.isOver && elements.length === 0 && (
//                 <p className="text-3xl text-muted-foreground flex flex-grow items-center font-bold">
//                   Drop here
//                 </p>
//               )}
//               {droppable.isOver && elements.length === 0 && (
//                 <div className='p-4 w-full'>
//                   <div className='h-[120px] w-full rounded-md bg-slate-300 bg-opacity-25'></div>
//                 </div>
//               )}
//               {elements.length > 0 && (
//                 <div className='flex flex-col text-background w-full gap-2 p-4'>
//                   {elements.map((element) => (
//                     <DesignerElementWrapper key={element.id} element={element} />
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         </Card>
//       </div>
//       <div>
//         <DesignerSidebar />
//       </div>
//     </div>
//   );
// }

// function Designer() {
//   return (
//     <FormBGProvider>
//       <DesignerContent />
//     </FormBGProvider>
//   );
// }

// function DesignerElementWrapper({ element }: { element: FormElementInstance }) {
//   const DesignerElement = FormElements[element.type].designerComponent;
//   const { removeElement, selectedElement, setSelectedElement } = useDesigner();
//   const [mouseIsOver, setMouseIsOver] = React.useState<boolean>(true);
//   const topHalf = useDroppable({
//     id: element.id + "-top",
//     data: {
//       type: element.type,
//       elementId: element.id,
//       isTopHalfDesignerElement: true,
//     }
//   });
//   const bottomHalf = useDroppable({
//     id: element.id + "-bottom",
//     data: {
//       type: element.type,
//       elementId: element.id,
//       isBottomHalfDesignerElement: true,
//     },
//   });
//   const draggable = useDraggable({
//     id: element.id + "-drag-handler",
//     data: {
//       type: element.type,
//       elementId: element.id,
//       isDesignerElement: true,
//     }
//   });

//   if (draggable.isDragging) return null;

//   return (
//     <div 
//       ref={draggable.setNodeRef}
//       {...draggable.listeners}
//       {...draggable.attributes}
//       className='relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded-md ring-1 ring-accent ring-inset'
//       onMouseEnter={() => { setMouseIsOver(true) }}
//       onMouseLeave={() => { setMouseIsOver(false) }}
//       onClick={(e) => {
//         e.stopPropagation();
//         setSelectedElement(element);
//       }}
//     >
//       <div ref={topHalf.setNodeRef} className='absolute w-full h-1/2 rounded-t-md bg-slate-300 bg-opacity-50'></div>
//       <div ref={bottomHalf.setNodeRef} className='absolute w-full bottom-0 h-1/2 rounded-b-md bg-slate-300 bg-opacity-50'></div>
//       {mouseIsOver && (
//         <>
//           <div className='absolute right-0 h-full'>
//             <Button 
//               className='flex justify-center h-full border rounded-md rounded-l-none bg-red-500 dark:bg-red-500'
//               variant={'outline'}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 removeElement(element.id);
//               }}
//             >
//               <BiSolidTrash className='text-foreground h-6 w-6' />
//             </Button>
//           </div>
//           <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse'>
//             <p className='text-muted-foreground text-sm'>Click for properties or drag to move</p>
//           </div>
//         </>
//       )}
//       {topHalf.isOver && (
//         <div className='absolute top-0 w-full rounded-md h-[7px] bg-current rounded-b-none' />
//       )}
//       {bottomHalf.isOver && (
//         <div className='absolute bottom-0 w-full rounded-md h-[7px] bg-current rounded-t-none' />
//       )}
//       <div className={cn(
//         'flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 text-black dark:text-white pointer-events-none opacity-100',
//         mouseIsOver && "opacity-30",
//       )}>
//         <DesignerElement elementInstance={element} />
//       </div>
//     </div>
//   );
// }

// export default Designer;

"use client";

import React, { useEffect, useCallback } from 'react';
import DesignerSidebar from './DesignerSidebar';
import { useDndMonitor, useDraggable, useDroppable } from '@dnd-kit/core';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import useDesigner from '@/hooks/useDesigner';
import { ElementsType, FormElementInstance, FormElements } from '@/components/FormElements';
import { idGenerator } from '@/lib/idGenerator';
import { DragEndEvent } from '@dnd-kit/core';
import { Button } from './ui/button';
import { BiSolidTrash } from 'react-icons/bi';
import { FormBGProvider, useFormBG } from '@/components/context/FormBackgroundContext';
import { useFormBackgroundState } from '@/hooks/useFormBg';

function DesignerContent({ onBackgroundChange }: { onBackgroundChange: (state: any) => void }) {
  const { elements, addElement, selectedElement, setSelectedElement, removeElement } = useDesigner();
  const { getFormBackgroundStyle, formBackgroundState } = useFormBackgroundState();
  useEffect(()=>{
    console.log("Use Effect in Designer Component")
    console.log(formBackgroundState)}, [formBackgroundState])
  useEffect(() => {
    onBackgroundChange(formBackgroundState);
  }, [formBackgroundState, onBackgroundChange]);
  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  });

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;
      if (!active || !over) return;

      const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;
      const isDroppingOverDesignerDropArea = over.data?.current?.isDesignerDropArea;

      const droppingSidebarBtnOverDesignerDropArea = isDesignerBtnElement && isDroppingOverDesignerDropArea;

      // First scenario
      if (droppingSidebarBtnOverDesignerDropArea) {
        const type = active.data?.current?.type;
        const newElement = FormElements[type as ElementsType].construct(idGenerator());
        addElement(elements.length, newElement);
        return;
      }

      const isDroppingOverDesignerElementTopHalf = over.data?.current?.isTopHalfDesignerElement;
      const isDroppingOverDesignerElementBottomHalf = over.data?.current?.isBottomHalfDesignerElement;
      const isDroppingOverDesignerElement = isDroppingOverDesignerElementTopHalf || isDroppingOverDesignerElementBottomHalf;
      const droppingSidebarBtnOverDesignerElement = isDesignerBtnElement && isDroppingOverDesignerElement;

      // Second scenario
      if (droppingSidebarBtnOverDesignerElement) {
        const type = active.data?.current?.type;
        const newElement = FormElements[type as ElementsType].construct(idGenerator());
        const overId = over.data?.current?.elementId;
        const overElementIndex = elements.findIndex((el) => el.id === overId);
        if (overElementIndex === -1) {
          throw new Error("Element not found");
        }
        let indexForNewElement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1;
        }
        addElement(indexForNewElement, newElement);
        return;
      }

      // Third scenario
      const isDraggingDesignerElement = active.data?.current?.isDesignerElement;
      const draggingDesignerElementOverAnotherDesignerElement = isDroppingOverDesignerElement && isDraggingDesignerElement;

      if (draggingDesignerElementOverAnotherDesignerElement) {
        const activeId = active.data?.current?.elementId;
        const overId = over.data?.current?.elementId;
        const activeElementIndex = elements.findIndex((el) => el.id === activeId);
        const overElementIndex = elements.findIndex((el) => el.id === overId);
        if (activeElementIndex === -1 || overElementIndex === -1) {
          throw new Error("Element not found");
        }
        const activeElement = { ...elements[activeElementIndex] };
        removeElement(activeId);
        let indexForNewElement = overElementIndex;
        if (isDroppingOverDesignerElementBottomHalf) {
          indexForNewElement = overElementIndex + 1;
        }
        addElement(indexForNewElement, activeElement);
      }
    }
  });

  return (
    <div className="flex w-full h-full bg-none">
      <div className="p-4 w-full">
        <Card id="designercard" className='w-full h-full' style={getFormBackgroundStyle()}>
          <div 
            onClick={() => { if (selectedElement) setSelectedElement(null); }}
            className='abcd h-full border-r-8 rounded-lg p-4'
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
                  <div className='h-[120px] w-full rounded-md bg-slate-300 bg-opacity-25'></div>
                </div>
              )}
              {elements.length > 0 && (
                <div className='flex flex-col text-background w-full gap-2 p-4'>
                  {elements.map((element) => (
                    <DesignerElementWrapper key={element.id} element={element} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
      <div>
        <DesignerSidebar />
      </div>
    </div>
  );
}

function Designer({ onBackgroundChange }: { onBackgroundChange: (state: any) => void }) {
  return (
    <FormBGProvider>
      <DesignerContent onBackgroundChange={onBackgroundChange} />
    </FormBGProvider>
  );
}

function DesignerElementWrapper({ element }: { element: FormElementInstance }) {
  const DesignerElement = FormElements[element.type].designerComponent;
  const { removeElement, selectedElement, setSelectedElement } = useDesigner();
  const [mouseIsOver, setMouseIsOver] = React.useState<boolean>(true);
  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    }
  });
  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  });
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
      onMouseEnter={() => { setMouseIsOver(true) }}
      onMouseLeave={() => { setMouseIsOver(false) }}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedElement(element);
      }}
    >
      <div ref={topHalf.setNodeRef} className='absolute w-full h-1/2 rounded-t-md bg-slate-300 bg-opacity-50'></div>
      <div ref={bottomHalf.setNodeRef} className='absolute w-full bottom-0 h-1/2 rounded-b-md bg-slate-300 bg-opacity-50'></div>
      {mouseIsOver && (
        <>
          <div className='absolute right-0 h-full'>
            <Button 
              className='flex justify-center h-full border rounded-md rounded-l-none bg-red-500 dark:bg-red-500'
              variant={'outline'}
              onClick={(e) => {
                e.stopPropagation();
                removeElement(element.id);
              }}
            >
              <BiSolidTrash className='text-foreground h-6 w-6' />
            </Button>
          </div>
          <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse'>
            <p className='text-muted-foreground text-sm'>Click for properties or drag to move</p>
          </div>
        </>
      )}
      {topHalf.isOver && (
        <div className='absolute top-0 w-full rounded-md h-[7px] bg-current rounded-b-none' />
      )}
      {bottomHalf.isOver && (
        <div className='absolute bottom-0 w-full rounded-md h-[7px] bg-current rounded-t-none' />
      )}
      <div className={cn(
        'flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 text-black dark:text-white pointer-events-none opacity-100',
        mouseIsOver && "opacity-30",
      )}>
        <DesignerElement elementInstance={element} />
      </div>
    </div>
  );
}

export default Designer;

