"use client"

import React, { useEffect, useState, useCallback } from "react";
import useDesigner from "@/hooks/useDesigner";
import { FormElements } from "@/components/FormElements";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

type BackgroundType = 'color' | 'image';

export interface FormBackgroundState {
  backgroundType: BackgroundType;
  backgroundColor: string;
  backgroundImage: string;
  darkModeEnabled: boolean;
  darkBackgroundImage: string;
}


function FormPreview({ formBackground }: { formBackground: FormBackgroundState }) {
  const { elements } = useDesigner();
  return (
    <div  id="previewElementsBackground"
          className={cn("w-1/2 h-full overflow-y-auto rounded-xl p-4")}
          style={formBackground.backgroundType === 'color'
            ? { backgroundColor: formBackground.backgroundColor }
            : { backgroundImage: `url(${formBackground.backgroundImage})` }
          }
        >
    {elements.map((element) => {
      const FormComponent = FormElements[element.type].formComponent;
      return <FormComponent key={element.id} elementInstance={element} />;
    })}
  </div>
  );
}

export default FormPreview;
