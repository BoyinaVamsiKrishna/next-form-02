import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { HiSaveAs } from 'react-icons/hi';
import useDesigner from '@/hooks/useDesigner';

interface SaveFormBtnProps {
  onSave: (elements: any) => void;
}

function SaveFormBtn({ onSave }: SaveFormBtnProps) {
  const { elements } = useDesigner();
  const [elementsObj, setElementsObj] = useState({});

  useEffect(() => {
    console.log(elementsObj)
    onSave(elementsObj)
  }, [elementsObj]);


  const handleSave = () => {
    setElementsObj(elements)
  };

  return (
    <Button variant="outline" className="gap-2" onClick={handleSave}>
      <HiSaveAs className="h-4 w-4" />
      Save
    </Button>
  );
}

export default SaveFormBtn;