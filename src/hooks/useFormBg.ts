// 'use client'
// import { useFormBG } from '@/components/context/FormBackgroundContext';

// export function useBackgroundState() {
//   const { formBackgroundState, updateFormBG } = useFormBG();
  

//   const getBackgroundStyle = () => {
//     if (formBackgroundState.backgroundType === 'color') {
//       return { backgroundColor: formBackgroundState.backgroundColor };
//     } else {
//       const currentImage = formBackgroundState.darkModeEnabled ? formBackgroundState.darkBackgroundImage : formBackgroundState.backgroundImage;
//       return { backgroundImage: `url(${currentImage})` };
//     }
//   };

//   return {
//     formBackgroundState,
//     updateFormBG,
//     getBackgroundStyle,
//   };
// }

// =========================================================================
'use client'
import { useFormBG } from '@/components/context/FormBackgroundContext';

export function useFormBackgroundState() {
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

  return {
    formBackgroundState,
    updateFormBG,
    getFormBackgroundStyle,
  };
}
