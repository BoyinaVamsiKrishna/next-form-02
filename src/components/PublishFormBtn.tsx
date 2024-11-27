import React from 'react';
import { Button } from './ui/button';
import { MdOutlinePublish } from 'react-icons/md';

export interface FormElement {
  id: string;
  type: string;
  extraAttributes: {
    label: string;
    helperText: string;
    required: boolean;
    placeHolder: string;
  };
}
export type PublishFormBtnProps = (elementsArray: FormElement[]) => void;
function PublishFormBtn({elementsObj, onPublish}: {elementsObj: any, onPublish: PublishFormBtnProps }) {
  const [elementsArray, setElementsArray] = React.useState<FormElement[]>([]);
  const handlePublish = () => {
    setElementsArray((prevElements: FormElement[]) => {
      const existingElementIndex = prevElements.findIndex(
        (element) => element.id === elementsObj.id
      );

      if (existingElementIndex !== -1) {
        // If an element with the same id exists, replace it
        const updatedElements = [...prevElements];
        updatedElements[existingElementIndex] = elementsObj;
        return updatedElements;
      } else {
        // If no element with the same id exists, add the new element
        return [...prevElements, elementsObj];
      }
    });
    
  };
  React.useEffect(()=>{
    console.log("Publish Component")
    console.log(elementsArray);
    onPublish(elementsArray)
  }, [elementsArray])
  return (
    <Button 
    onClick={handlePublish}
    className="gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400 hover: bg-slate-200">
      <MdOutlinePublish className="h-4 w-4" />
      Publish
    </Button>
  );
}


export default PublishFormBtn;
