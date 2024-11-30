// import React from 'react'
// import SidebarBtnElement from "@/components/SidebarBtnElement"
// import { FormElements } from './FormElements'
// import { Card } from './ui/card'
// import useDesigner from '@/hooks/useDesigner'
// import FormElementsSidebar from '@/components/FormElementsSidebar'
// import PropertiesFormSidebar from '@/components/PropertiesFormSidebar'

// function DesignerSidebar() {
//   const {selectedElement} = useDesigner();
//   return (
//     <aside className='w-[400px] max-w-[400px] flex flex-col flex-grow h-full rounded-lg border-blackgap-2 p-4 bg-background overflow-y-auto'>
//       <Card id='designerSidebar' className='border border-l-2 h-full border-black p-4'>
//       {!selectedElement && <FormElementsSidebar />}
//       {selectedElement && <PropertiesFormSidebar />}
//       </Card>
//     </aside>
//   )
// }

// export default DesignerSidebar


"use client"

import React from 'react'
import { Card } from '@/components/ui/card'
import useDesigner from '@/hooks/useDesigner'
import FormElementsSidebar from '@/components/FormElementsSidebar'
import PropertiesFormSidebar from '@/components/PropertiesFormSidebar'
import { useFormBackgroundState } from '@/hooks/useFormBg'

function DesignerSidebar() {
  const { selectedElement } = useDesigner();
  const { getFormBackgroundStyle } = useFormBackgroundState();

  return (
    <aside className='w-[400px] max-w-[400px] flex flex-col flex-grow h-full rounded-lg border-black gap-2 p-4 bg-background overflow-y-auto'>
      <Card 
        id='designerSidebar' 
        className='border border-l-2 h-full border-black p-4'
        style={getFormBackgroundStyle()}
      >
        {!selectedElement && <FormElementsSidebar />}
        {selectedElement && <PropertiesFormSidebar />}
      </Card>
    </aside>
  )
}

export default DesignerSidebar
