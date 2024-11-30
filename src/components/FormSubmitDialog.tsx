import React from "react";
import { Button } from "@/components/ui/button";
import { MdPreview } from "react-icons/md";
import useDesigner from "@/hooks/useDesigner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FormElements } from "@/components/FormElements";
import { Card } from "./ui/card";
function FormSubmitDialog() {
  const { elements } = useDesigner();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <MdPreview className="h-6 w-6" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-h-screen max-w-full flex flex-col gap-0 gap-y-0">
        <div className="bg-accent flex flex-col flex-grow items-center justify-center p-4 overflow-y-auto">
        <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background h-full w-full rounded-2xl p-8 overflow-y-auto">
        <Card 
        className='h-full border-r-2 bg-primary rounded-lg p-4'>
          {elements.map((element) => {
            const FormComponent = FormElements[element.type].formComponent;
            return <FormComponent key={element.id} elementInstance={element} />;
          })}
        <Button className="w-full">Submit</Button>
        </Card>
        </div>
        </div>
        
      </DialogContent>
    </Dialog>
  );
}


export default FormSubmitDialog;
