// 'use client'

// import React, { useState, useEffect } from 'react'
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogFooter
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { SquarePen, Trash2 } from "lucide-react"
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip"

// interface FormData {
//   id: string;
//   name: string;
//   description: string;
//   createdAt: Date;
// }

// export default function FormCreator() {
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [formName, setFormName] = useState('')
//   const [formDescription, setFormDescription] = useState('')
//   const [draftForms, setDraftForms] = useState<FormData[]>([])
//   const [editingFormId, setEditingFormId] = useState<string | null>(null)

//   const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormName(e.target.value)
//   }

//   const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     setFormDescription(e.target.value)
//   }

//   const updateDraft = () => {
//     const newDraft: FormData = {
//       id: editingFormId || Date.now().toString(),
//       name: formName,
//       description: formDescription,
//       createdAt: new Date()
//     }

//     setDraftForms(prevForms => {
//       if (editingFormId) {
//         return prevForms.map(form => form.id === editingFormId ? newDraft : form)
//       } else {
//         return [...prevForms, newDraft]
//       }
//     })
//   }

//   const handleSave = () => {
//     setIsDialogOpen(false)
//     setDraftForms(prevForms => prevForms.filter(form => form.id !== editingFormId))
//     setFormName('')
//     setFormDescription('')
//     setEditingFormId(null)
//   }

//   const handleEdit = (id: string) => {
//     const formToEdit = draftForms.find(form => form.id === id)
//     if (formToEdit) {
//       setFormName(formToEdit.name)
//       setFormDescription(formToEdit.description)
//       setEditingFormId(id)
//       setIsDialogOpen(true)
//     }
//   }

//   const handleDelete = (id: string) => {
//     setDraftForms(prevForms => prevForms.filter(form => form.id !== id))
//   }

//   const formatTimeAgo = (date: Date) => {
//     const now = new Date()
//     const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

//     if (diffInMinutes < 60) {
//       return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
//     } else if (diffInMinutes < 1440) {
//       const hours = Math.floor(diffInMinutes / 60)
//       return `${hours} hour${hours !== 1 ? 's' : ''} ago`
//     } else {
//       const days = Math.floor(diffInMinutes / 1440)
//       return `${days} day${days !== 1 ? 's' : ''} ago`
//     }
//   }

//   useEffect(() => {
//     if (!isDialogOpen && (formName || formDescription)) {
//       updateDraft()
//       setFormName('')
//       setFormDescription('')
//       setEditingFormId(null)
//     }
//   }, [isDialogOpen])

//   return (
//     <div className="p-4">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
//         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//           <DialogTrigger asChild>
//             <Button variant="outline" className="h-[190px] w-full flex flex-col items-center justify-center">
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="24"
//                 height="24"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="mb-2"
//               >
//                 <path d="M14 3v4a1 1 0 0 0 1 1h4" />
//                 <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
//                 <line x1="12" y1="11" x2="12" y2="17" />
//                 <line x1="9" y1="14" x2="15" y2="14" />
//               </svg>
//               Create Form
//             </Button>
//           </DialogTrigger>
//           <DialogContent>
//             <DialogHeader>
//               <DialogTitle>{editingFormId ? 'Edit Form' : 'Create Form'}</DialogTitle>
//               <DialogDescription>
//                 {editingFormId ? 'Edit your form details.' : 'Enter the details for your new form.'}
//               </DialogDescription>
//             </DialogHeader>
//             <div className="space-y-4">
//               <div>
//                 <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                   Name
//                 </label>
//                 <Input id="name" value={formName} onChange={handleNameChange} />
//               </div>
//               <div>
//                 <label htmlFor="description" className="block text-sm font-medium text-gray-700">
//                   Description
//                 </label>
//                 <Textarea id="description" value={formDescription} onChange={handleDescriptionChange} />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button onClick={handleSave}>Save</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {draftForms.map((form) => (
//           <Card key={form.id} className="h-[190px] relative group border-2 border-transparent hover:border-red-500 transition-colors duration-200">
//             <CardHeader className="flex flex-row items-center justify-between pb-2">
//               <div className="flex flex-col">
//                 <h3 className="font-bold">{form.name || "No Name"}</h3>
//                 <p className="text-sm text-gray-500">{formatTimeAgo(form.createdAt)}</p>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <TooltipProvider>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-500"
//                         onClick={() => handleDelete(form.id)}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </TooltipTrigger>
//                     <TooltipContent>
//                       <p>Delete Draft</p>
//                     </TooltipContent>
//                   </Tooltip>
//                 </TooltipProvider>
//                 <Badge className="bg-red-500">Draft</Badge>
//               </div>
//             </CardHeader>
//             <CardContent className="h-20 overflow-hidden">
//               <p className="text-sm">{form.description || "No description"}</p>
//             </CardContent>
//             <CardFooter className="absolute bottom-0 left-0 right-0">
//               <Button variant="outline" className="w-full" onClick={() => handleEdit(form.id)}>
//                 <SquarePen className="w-4 h-4 mr-2" />
//                 Edit Form
//               </Button>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }
'use client'
import {BsFileEarmarkPlus} from "react-icons/bs"
import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SquarePen, Trash2 } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export interface FormData {
  id: number;
  name: string;
  description: string;
  createdAt: Date;
  userId ?: string;        
  published?:boolean;         
  content?: string;          
  visits?: number;
  submissions?: number;           
  shareURL?: string;           
  FormSubmissions?: [];
}

interface FormCreatorProps {
  onFormSubmit: (form: FormData) => void;
  formsCount?: number;
}

export default function CreateFormButton({ onFormSubmit }: FormCreatorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [draftForms, setDraftForms] = useState<FormData[]>([])
  const [editingFormId, setEditingFormId] = useState<number | null>(null)

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormName(e.target.value)
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormDescription(e.target.value)
  }

  const updateDraft = useCallback(() => {
    const newDraft: FormData = {
      id: editingFormId || draftForms.length + 1,
      name: formName,
      description: formDescription,
      createdAt: new Date()
    }

    setDraftForms(prevForms => {
      if (editingFormId) {
        return prevForms.map(form => form.id === editingFormId ? newDraft : form)
      } else {
        return [...prevForms, newDraft]
      }
    })
  }, [formName, formDescription, editingFormId, draftForms.length])

  const handleSave = () => {
    const newForm: FormData = {
      id: + 1,
      name: formName,
      description: formDescription,
      createdAt: new Date()
    }
    onFormSubmit(newForm)
    setIsDialogOpen(false)
    setDraftForms(prevForms => prevForms.filter(form => form.id !== editingFormId))
    setFormName('')
    setFormDescription('')
    setEditingFormId(null)
  }

  const handleEdit = (id: number) => {
    const formToEdit = draftForms.find(form => form.id === id)
    if (formToEdit) {
      setFormName(formToEdit.name)
      setFormDescription(formToEdit.description)
      setEditingFormId(id)
      setIsDialogOpen(true)
    }
  }

  const handleDelete = (id: number) => {
    setDraftForms(prevForms => prevForms.filter(form => form.id !== id))
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`
    } else {
      const days = Math.floor(diffInMinutes / 1440)
      return `${days} day${days !== 1 ? 's' : ''} ago`
    }
  }

  useEffect(() => {
    if (!isDialogOpen && (formName || formDescription)) {
      updateDraft()
      setFormName('')
      setFormDescription('')
      setEditingFormId(null)
    }
  }, [isDialogOpen, formName, formDescription, updateDraft])

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <div className="flex flex-row gap-4">
        <div className="flex">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" 
            className='p-4 text-wrap group border border-primary/20 h-[190px] w-32 items-center jusitfy-center  flex flex-col flex-grow hover:border-primary hover:cursor-pointer border-dashed gap-4'
            >
              <BsFileEarmarkPlus className="h-8 w-8 text-muted-foreground group-hover:text-primary"/>
              <p className="font-bold text-lg text-muted-foreground group-hover: text-primary">
                Create New Form
              </p>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingFormId ? 'Edit Form' : 'Create Form'}</DialogTitle>
              <DialogDescription>
                {editingFormId ? 'Edit your form details.' : 'Enter the details for your new form.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <Input id="name" value={formName} onChange={handleNameChange} />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <Textarea id="description" value={formDescription} onChange={handleDescriptionChange} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
        <div className="flex">
        {draftForms.map((form) => (
          <Card key={form.id} className="hover:border-2 hover:border-red-600 max-h-[190px]">
            <CardHeader className="flex flex-row items-baseline gap-4 py
            -1">
              <div className="flex items-center justify-start">
                <h3 className="font-bold">{form.name || "No Name"}</h3>
              </div>
              <div className="flex flex-row items-center justify-end">
              <div className="flex items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={'outline'}
                        size="icon"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDelete(form.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Draft</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Badge className="bg-red-500">Draft</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{formatTimeAgo(form.createdAt)}</p>
              <p className="text-sm">{form.description || "No description"}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => handleEdit(form.id)}>
                <SquarePen className="w-4 h-4 mr-2" />
                Edit Form
              </Button>
            </CardFooter>
          </Card>
        ))}
        </div>
      </div>
      </div>
    </div>
  )
}