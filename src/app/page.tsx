'use client'

import CreateFormButton from '@/components/CreateFormButton'
import FormBuilder from '@/components/FormBuilder';
import React, { useState, useEffect } from 'react'
import { FormData } from '@/components/CreateFormButton';
import { FormElement, PublishFormBtnProps } from "@/components/PublishFormBtn";
import {Button} from "@/components/ui/button"
import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { toast } from "sonner";
import Tick from './Tick';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import Confetti from "react-confetti";
import FormSubmitDialog from "@/components/FormSubmitDialog";

export default function Home() {
  // const [updatedElements, setUpdatedElements] = React.useState({});
  const [formIn, setFormIn]=useState<boolean>(true)
  const [form, setForm] = React.useState<FormData | undefined>(undefined)
  const [childData, setChildData] = useState<FormElement[]>([]);
  const [childDataCondition, setChildDataCondition] = useState<boolean>(false);
  const [submitDialog, setSubmitDialog] = useState<boolean>(false);

  const handlePublishBtn : PublishFormBtnProps = (elementsArrayData: FormElement[])=>{
    setChildData(elementsArrayData)
  }
  const handleFormSubmit = (newForm: FormData) => {
    setForm(newForm)
  }
  useEffect(() => {
    if (form) {
      console.log(form)
      setFormIn(false);
      setSubmitDialog(false);

    }
  }, [form]);
  // const handleElementsUpdate = (elements: any) => {
  //   setUpdatedElements(elements);
  //   // You can perform any additional actions here with the updated elements
  //   console.log("Updated elements in FormBuilder:", elements);
  // };

  useEffect(()=>{console.log(childData);
    if (childData.length > 0) {
                setChildDataCondition(true)
    }
  }, [childData])
  const shareUrl = window!==undefined ? `${window.location.origin}/submit/${form?.name}` : null;
  return (
    <div className="container pt-4">
        <div className='w-full px-4'>
        {formIn && <div> <p>Hello</p><CreateFormButton onFormSubmit={handleFormSubmit} /> </div>} 
        </div>
        {(childDataCondition) ?
            <div className="flex flex-col items-center justify-center min-h-screen w-full">
            {/* <div className="max-w-md">

              <h2 className="text-2xl">Share this form</h2>
              <h3 className="text-xl text-muted-foreground border-b pb-10">
                Anyone with the link can view and submit the form
              </h3>
              <div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4">
                <input className="w-full" readOnly value={shareUrl} />
                <Button
                  className="mt-2 w-full"
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    toast("Link copied to clipboard");
                  }}
                >
                  Copy link
                </Button>
              </div>
            </div> */}
            { submitDialog ? <FormSubmitDialog /> :
            <div>
            <Confetti />
            <Alert className="border-2 border-primary w-full max-w-2xl mx-auto shadow-xl shadow-primary rounded-xl overflow-hidden">
              <div className='p-8'>
              <AlertTitle>
                <h1 className="text-center text-4xl font-bold text-primary border-b pb-2 mb-10">
                  🎊 Form Published 🎊
                </h1>
              </AlertTitle>
              <AlertDescription>
              <h2 className="text-2xl">Share this form</h2>
                      <h3 className="text-xl text-muted-foreground border-b pb-10">
                        Anyone with the link can view and submit the form
                      </h3>
                      <div className="my-4 flex flex-col gap-2 items-center border-b pb-4">
                        {shareUrl && <input className="w-full py-2" readOnly value={shareUrl} />}
                        <Button
                          className="mt-2 w-full"
                          onClick={() => {
                            if(shareUrl!==null){
                            navigator.clipboard.writeText(shareUrl);
                            toast("Link copied to clipboard");
                            }
                          }}
                        >
                          Copy link
                        </Button>
                        <div className='w-full flex flex-row items-center justify-between'>
                          <div onClick={()=>{setFormIn(true); setChildDataCondition(false); setForm(undefined);}} className='flex cursor-pointer'><BsArrowLeft  />Go Back Home</div>
                          <div onClick={()=>{setFormIn(true); setChildDataCondition(false); setForm(undefined); setSubmitDialog(true);}} className='flex'><BsArrowRight/>Form Details</div>
                        </div>
                      </div>
              </AlertDescription>
              </div>
            </Alert>
            </div>
            }
          </div>
        : 
                <div className='w-full h-full px-8'>
                {form && <FormBuilder form={form} sendDataToParent={handlePublishBtn} />}
                </div>
        }
    </div>
  );
}

