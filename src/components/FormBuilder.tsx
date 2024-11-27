
// "use client"

// import React, { useState, useEffect } from "react";
// import { DndContext, useSensors, useSensor, MouseSensor, TouchSensor, DragEndEvent } from "@dnd-kit/core";
// import Designer from "./Designer";
// import { cn } from "@/lib/utils";
// import { FormData } from "./CreateFormButton";
// import { FormElement, PublishFormBtnProps } from "./PublishFormBtn";
// import PreviewDialogBtn from "@/components/PreviewDialogBtn";
// import PublishFormBtn from "./PublishFormBtn";
// import SaveFormBtn from "./SaveFormBtn";
// import { FormElementInstance, ElementsType } from "@/components/FormElements";
// import { BackgroundElementFormElement } from "@/components/fields/BackgroundElementField";
// import DragOverlayWrapper from "@/components/DragOverlayWrapper";
// import { BackgroundProvider, BackgroundState, useBackground } from '@/components/context/BackgroundContext';

// function FormBuilder({ form, sendDataToParent }: { form: FormData, sendDataToParent: PublishFormBtnProps }) {
//   const [elements, setElements] = useState<FormElementInstance[]>([]);
//   const [updatedElements, setUpdatedElements] = useState({});
//   const [updatedelementsArray, setUpdatedElementsArray] = useState<FormElement[]>([]);
//   const { backgroundState, updateBackground } = useBackground();

//   const mouseSensor = useSensor(MouseSensor, {
//     activationConstraint: {
//       distance: 10,
//     }
//   });

//   const touchSensor = useSensor(TouchSensor, {
//     activationConstraint: {
//       delay: 300,
//       tolerance: 5
//     }
//   });

//   const sensors = useSensors(mouseSensor, touchSensor);

//   const addElement = (index: number, element: FormElementInstance) => {
//     setElements((prev) => {
//       const newElements = [...prev];
//       newElements.splice(index, 0, element);
//       return newElements;
//     });
//   };

//   const removeElement = (id: string) => {
//     setElements((prev) => prev.filter((element) => element.id !== id));
//   };

//   const updateElement = (id: string, newElement: Partial<FormElementInstance>) => {
//     setElements((prev) =>
//       prev.map((element) => (element.id === id ? { ...element, ...newElement } : element))
//     );
//   };

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;

//     if (active.data.current?.type === "BackgroundElement" && !over) {
//       const newBackgroundElement = BackgroundElementFormElement.construct(crypto.randomUUID());
//       if (newBackgroundElement.extraAttributes) {
//         updateBackground(newBackgroundElement.extraAttributes as BackgroundState);
//       }
//     } else if (over && over.id === "designer-drop-area") {
//       const type = active.data.current?.type as ElementsType;
//       const newElement = {
//         id: crypto.randomUUID(),
//         type,
//         extraAttributes: {},
//       };
//       addElement(elements.length, newElement);
//     }
//   };

//   const handleElementsUpdate = (elements: Record<string, FormElementInstance>) => {
//     setUpdatedElements(elements);
//   };

//   const handlePublishBtn: PublishFormBtnProps = (elementsArrayData: FormElement[]) => {
//     setUpdatedElementsArray(elementsArrayData);
//   };

//   useEffect(() => {
//     console.log(updatedElements);
//     sendDataToParent(updatedelementsArray);
//     console.log("Updated Elements Array");
//     console.log(updatedelementsArray);
//   }, [updatedElements, updatedelementsArray]);

//   return (
//     <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
//       <main className="flex flex-col w-full min-h-screen">
//         <nav className="flex justify-between border-b-2 p-4 gap-3 items-center">
//           <h2 className="truncate font-medium">
//             <span className="text-muted-foreground mr-2">Form:</span>
//             {form?.name}
//           </h2>
//           <div className="flex items-center gap-2">
//             <PreviewDialogBtn />
//             {!form?.published && (
//               <>
//                 <SaveFormBtn onSave={handleElementsUpdate} />
//                 <PublishFormBtn elementsObj={updatedElements} onPublish={handlePublishBtn} />
//               </>
//             )}
//           </div>
//         </nav>
//         <BackgroundProvider>
//         <DynamicBackground>
//           <Designer />
//         </DynamicBackground>
//         </BackgroundProvider>
//       </main>
//       <DragOverlayWrapper />
//     </DndContext>
//   );
// }

// function DynamicBackground({ children }: { children: React.ReactNode }) {
//   const { backgroundState } = useBackground();

//   const backgroundStyle = backgroundState.backgroundType === 'color'
//     ? { backgroundColor: backgroundState.backgroundColor }
//     : { backgroundImage: `url(${backgroundState.backgroundImage})` };
//     useEffect(()=>{console.log("Dynamic Background in FormBuilder")
//       console.log(backgroundStyle);}, [backgroundStyle])

//   return (
//     <div 
//       className={cn("flex w-full flex-grow items-center justify-center relative overflow-y-auto h-full")}
//       style={backgroundStyle}
//     >
//       {children}
//     </div>
//   );
// }

// export default FormBuilder;

"use client"

import React, { useState, useEffect } from "react";
import { DndContext, useSensors, useSensor, MouseSensor, TouchSensor, DragEndEvent } from "@dnd-kit/core";
import Designer from "./Designer";
import { cn } from "@/lib/utils";
import { FormData } from "./CreateFormButton";
import { FormElement, PublishFormBtnProps } from "./PublishFormBtn";
import PreviewDialogBtn from "@/components/PreviewDialogBtn";
import PublishFormBtn from "./PublishFormBtn";
import SaveFormBtn from "./SaveFormBtn";
import { FormElementInstance, ElementsType } from "@/components/FormElements";
import { BackgroundElementFormElement } from "@/components/fields/BackgroundElementField";
import DragOverlayWrapper from "@/components/DragOverlayWrapper";
import { BackgroundProvider, BackgroundState, useBackground } from '@/components/context/BackgroundContext';

function FormBuilder({ form, sendDataToParent }: { form: FormData, sendDataToParent: PublishFormBtnProps }) {
  const [elements, setElements] = useState<FormElementInstance[]>([]);
  const [updatedElements, setUpdatedElements] = useState({});
  const [updatedelementsArray, setUpdatedElementsArray] = useState<FormElement[]>([]);
  const { backgroundState, updateBackground } = useBackground();

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    }
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5
    }
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const addElement = (index: number, element: FormElementInstance) => {
    setElements((prev) => {
      const newElements = [...prev];
      newElements.splice(index, 0, element);
      return newElements;
    });
  };

  const removeElement = (id: string) => {
    setElements((prev) => prev.filter((element) => element.id !== id));
  };

  const updateElement = (id: string, newElement: Partial<FormElementInstance>) => {
    setElements((prev) =>
      prev.map((element) => (element.id === id ? { ...element, ...newElement } : element))
    );
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.data.current?.type === "BackgroundElement" && !over) {
      const newBackgroundElement = BackgroundElementFormElement.construct(crypto.randomUUID());
      if (newBackgroundElement.extraAttributes) {
        updateBackground(newBackgroundElement.extraAttributes as BackgroundState);
      }
    } else if (over && over.id === "designer-drop-area") {
      const type = active.data.current?.type as ElementsType;
      const newElement = {
        id: crypto.randomUUID(),
        type,
        extraAttributes: {},
      };
      addElement(elements.length, newElement);
    }
  };

  const handleElementsUpdate = (elements: Record<string, FormElementInstance>) => {
    setUpdatedElements(elements);
  };

  const handlePublishBtn: PublishFormBtnProps = (elementsArrayData: FormElement[]) => {
    setUpdatedElementsArray(elementsArrayData);
  };

  useEffect(() => {
    console.log(updatedElements);
    sendDataToParent(updatedelementsArray);
    console.log("Updated Elements Array");
    console.log(updatedelementsArray);
  }, [updatedElements, updatedelementsArray]);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <main className="flex flex-col w-full min-h-screen">
        <nav className="flex justify-between border-b-2 p-4 gap-3 items-center">
          <h2 className="truncate font-medium">
            <span className="text-muted-foreground mr-2">Form:</span>
            {form?.name}
          </h2>
          <div className="flex items-center gap-2">
            <PreviewDialogBtn />
            {!form?.published && (
              <>
                <SaveFormBtn onSave={handleElementsUpdate} />
                <PublishFormBtn elementsObj={updatedElements} onPublish={handlePublishBtn} />
              </>
            )}
          </div>
        </nav>
        <DynamicBackground>
          <Designer />
        </DynamicBackground>
      </main>
      <DragOverlayWrapper />
    </DndContext>
  );
}

function DynamicBackground({ children }: { children: React.ReactNode }) {
  const { backgroundState } = useBackground();

  const backgroundStyle = backgroundState.backgroundType === 'color'
    ? { backgroundColor: backgroundState.backgroundColor }
    : { backgroundImage: `url(${backgroundState.backgroundImage})` };

  useEffect(() => {
    console.log("Dynamic Background in FormBuilder");
    console.log(backgroundStyle);
  }, [backgroundStyle]);

  return (
    <div 
      className={cn("flex w-full flex-grow items-center justify-center relative overflow-y-auto h-full")}
      style={backgroundStyle}
    >
      {children}
    </div>
  );
}

export default FormBuilder;

