import React, { useEffect } from "react";
import useDesigner from "@/hooks/useDesigner";
import { FormElements } from "@/components/FormElements";
import { FormBGProvider } from '@/components/context/FormBackgroundContext';
import { useFormBG } from '@/components/context/FormBackgroundContext';
import { cn } from "@/lib/utils";
function FormPreviewContent() {
  const { elements } = useDesigner();
  const { formBackgroundState, updateFormBG } = useFormBG();
  
  const getFormBackgroundStyle = () => {
    if (formBackgroundState.backgroundType === 'color') {
      return { backgroundColor: formBackgroundState.backgroundColor };
    } else {
      const currentImage = formBackgroundState.darkModeEnabled ? formBackgroundState.darkBackgroundImage : formBackgroundState.backgroundImage;
      return { 
        backgroundImage: `url(${currentImage})`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto'
      };
    }
  };

  return (
            <div id="previewElementsBackground"
               className={cn("w-1/2  h-dvh overflow-y-auto rounded-xl p-4")}
               style={getFormBackgroundStyle()}>
          {elements.map((element) => {
                  const FormComponent = FormElements[element.type].formComponent;
                  return <FormComponent key={element.id} elementInstance={element} />;
                })}
          </div>
  );
}

function FormPreview(){
  return (
    <FormBGProvider>
      <FormPreviewContent />
    </FormBGProvider>
  )
}


export default FormPreview;


