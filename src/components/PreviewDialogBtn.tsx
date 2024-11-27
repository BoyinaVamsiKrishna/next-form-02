// import React from "react";
// import { Button } from "@/components/ui/button";
// import { MdPreview } from "react-icons/md";
// import { Dialog, DialogContent, DialogTrigger,   DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import FormPreview from "./FormPreview";
// import { BackgroundProvider, BackgroundState, useBackground } from '@/components/context/BackgroundContext';
// import { cn } from '@/lib/utils';
// function PreviewDialogBtn() {
//   // const { elements } = useDesigner();

//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline" className="gap-2">
//           <MdPreview className="h-6 w-6" />
//           Preview
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="w-screen h-screen max-h-screen max-w-full flex flex-col gap-0 gap-y-0">
//       <DialogHeader className="px-4 py-2 border-b">
//           <DialogTitle className="text-lg font-bold text-muted-foreground">
//             Form preview
//           </DialogTitle>
//           <DialogDescription className="text-sm text-muted-foreground">
//             This is how your form will look like to your users.
//           </DialogDescription>
//         </DialogHeader>
//         <BackgroundProvider>
//         <DynamicBackground>

//         <div className="h-full flex justify-center p-4">
//             {/* <div id="previewElementsBackground" className="bg-green-500 w-1/2 h-full rounded-xl p-4">
//           {elements.map((element) => {
//                   const FormComponent = FormElements[element.type].formComponent;
//                   return <FormComponent key={element.id} elementInstance={element} />;
//                 })}
//           </div> */}
//           <FormPreview />
//           </div>
//         </DynamicBackground>
//         </BackgroundProvider>
//       </DialogContent>
//     </Dialog>
//   );
// }


// function DynamicBackground({ children }: { children: React.ReactNode }) {
//   const { backgroundState } = useBackground();

//   const backgroundStyle = backgroundState.backgroundType === 'color'
//     ? { backgroundColor: backgroundState.backgroundColor }
//     : { backgroundImage: `url(${backgroundState.backgroundImage})` };

//   return (
//     <div 
//       id="previewBackground"
//       className={cn("flex w-full flex-grow items-center justify-center relative overflow-y-auto h-full")}
//       style={backgroundStyle}
//     >
//       {children}
//     </div>
//   );
// }

// export default PreviewDialogBtn;

//=============================================================================================================================

// "use client"

// import React from "react";
// import { Button } from "@/components/ui/button";
// import { MdPreview } from "react-icons/md";
// import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import FormPreview from "./FormPreview";
// import { BackgroundProvider, useBackground } from '@/components/context/BackgroundContext';
// import { cn } from '@/lib/utils';
// import { useBackgroundState } from '@/hooks/useBackgroundState';

// function PreviewDialogBtn() {
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline" className="gap-2">
//           <MdPreview className="h-6 w-6" />
//           Preview
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="w-screen h-screen max-h-screen max-w-full flex flex-col gap-0 gap-y-0">
//         <DialogHeader className="px-4 py-2 border-b">
//           <DialogTitle className="text-lg font-bold text-muted-foreground">
//             Form preview
//           </DialogTitle>
//           <DialogDescription className="text-sm text-muted-foreground">
//             This is how your form will look like to your users.
//           </DialogDescription>
//         </DialogHeader>
//         <BackgroundProvider>
//           <DynamicBackground>
//             <div className="h-full flex justify-center p-4">
//               <FormPreview />
//             </div>
//           </DynamicBackground>
//         </BackgroundProvider>
//       </DialogContent>
//     </Dialog>
//   );
// }

// function DynamicBackground({ children }: { children: React.ReactNode }) {
//   const { getBackgroundStyle } = useBackgroundState();
  

//   return (
//     <div 
//       id="previewBackground"
//       className={cn("flex w-full flex-grow items-center justify-center relative overflow-y-auto h-full")}
//       style={getBackgroundStyle()}
//     >
//       {children} 
//     </div> 
//   );
// }

// export default PreviewDialogBtn; 

// =============================================================================================================
// =============================================================================================================

// "use client"

// import React, {useEffect} from "react";
// import { Button } from "@/components/ui/button";
// import { MdPreview } from "react-icons/md";
// import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
// import FormPreview from "./FormPreview";
// import { BackgroundProvider, useBackground } from '@/components/context/BackgroundContext';
// import { cn } from '@/lib/utils';

// function PreviewDialogBtn() {
//   const {backgroundState} = useBackground();
//   const backgroundStyle = backgroundState.backgroundType === 'color'
//   ? { backgroundColor: backgroundState.backgroundColor }
//   : { backgroundImage: `url(${backgroundState.backgroundImage})` };
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <Button variant="outline" className="gap-2">
//           <MdPreview className="h-6 w-6" />
//           Preview
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="w-screen h-screen max-h-screen max-w-full flex flex-col gap-0 gap-y-0">
//         <DialogHeader className="px-4 py-2 border-b">
//           <DialogTitle className="text-lg font-bold text-muted-foreground">
//             Form preview
//           </DialogTitle>
//           <DialogDescription className="text-sm text-muted-foreground">
//             This is how your form will look like to your users.
//           </DialogDescription>
//         </DialogHeader>
//         <BackgroundProvider>
//           {/* 
//             <div className="h-full flex justify-center p-4"> */}
//             <DynamicBackground>
//               <FormPreview />
//               </DynamicBackground>
//             {/* </div>
//           </DynamicBackground> */}
//         </BackgroundProvider>
//       </DialogContent>
//     </Dialog>
//   );
// }

// function DynamicBackground({ children }: { children: React.ReactNode }) {
//   const { backgroundState } = useBackground();

//   const backgroundStyle = backgroundState.backgroundType === 'color'
//     ? { backgroundColor: backgroundState.backgroundColor }
//     : { backgroundImage: `url(${backgroundState.backgroundImage})` };
//     useEffect(()=>{console.log("Dynamic Background in PreviewDialogBtn")
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

// export default PreviewDialogBtn;

"use client"

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MdPreview } from "react-icons/md";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import FormPreview from "./FormPreview";
import { useBackground } from '@/components/context/BackgroundContext';
import { cn } from '@/lib/utils';

function PreviewDialogBtn() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <MdPreview className="h-6 w-6" />
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-h-screen max-w-full flex flex-col gap-0 gap-y-0">
        <DialogHeader className="px-4 py-2 border-b">
          <DialogTitle className="text-lg font-bold text-muted-foreground">
            Form preview
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            This is how your form will look like to your users.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
        <DynamicBackground>
          <FormPreview />
        </DynamicBackground>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DynamicBackground({ children }: { children: React.ReactNode }) {
  const { backgroundState } = useBackground();

  const backgroundStyle = backgroundState.backgroundType === 'color'
    ? { backgroundColor: backgroundState.backgroundColor }
    : { backgroundImage: `url(${backgroundState.backgroundImage})` };

  useEffect(() => {
    console.log("Dynamic Background in PreviewDialogBtn");
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

export default PreviewDialogBtn;

