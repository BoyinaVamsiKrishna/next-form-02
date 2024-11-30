// "use client"

// import React, { createContext, useContext, useReducer, Dispatch } from 'react';

// type BackgroundType = 'color' | 'image';

// export interface BackgroundState {
//   backgroundType: BackgroundType;
//   backgroundColor: string;
//   backgroundImage: string;
//   darkModeEnabled: boolean;
//   darkBackgroundImage: string;
// }

// type BackgroundAction = {
//   type: 'UPDATE_BACKGROUND';
//   payload: Partial<BackgroundState>;
// };

// interface BackgroundContextType {
//   formBackgroundState: BackgroundState;
//   updateFormBG: (newState: Partial<BackgroundState>) => void;
// }

// interface BackgroundProviderProps {
//   children: React.ReactNode;
//   onBackgroundChange?: (newState: BackgroundState) => void;
// }

// const initialState: BackgroundState = {
//   backgroundType: 'image',
//   backgroundColor: '#ffffff',
//   backgroundImage: '/circuit-board.svg',
//   darkModeEnabled: false,
//   darkBackgroundImage: '/dark/circuit-board-dark.svg',
// };

// function formBackgroundReducer(state: BackgroundState, action: BackgroundAction): BackgroundState {
//   switch (action.type) {
//     case 'UPDATE_BACKGROUND':
//       return { ...state, ...action.payload };
//     default:
//       return state;
//   }
// }

// const FormBGContext = createContext<BackgroundContextType | undefined>(undefined);

// export function FormBGProvider({ children, onBackgroundChange }: BackgroundProviderProps) {
//   const [formBackgroundState, dispatch] = useReducer(formBackgroundReducer, initialState);

//   const updateFormBG = (newState: Partial<BackgroundState>) => {
//     dispatch({ type: 'UPDATE_BACKGROUND', payload: newState });
//     console.log("Form BG Component", newState);
//   };

//   React.useEffect(() => {
//     console.log('Form Background state updated:', formBackgroundState);
//     if (onBackgroundChange) {
//       onBackgroundChange(formBackgroundState);
//     }
//   }, [formBackgroundState, onBackgroundChange]);

//   return (
//     <FormBGContext.Provider value={{ formBackgroundState, updateFormBG }}>
//       {children}
//     </FormBGContext.Provider>
//   );
// }

// export function useFormBG() {
//   const context = useContext(FormBGContext);
//   if (context === undefined) {
//     throw new Error('useFormBG must be used within a FormBGProvider');
//   }
//   return context;
// }

// export function FormBGConsumer() {
//   const { formBackgroundState, updateFormBG } = useFormBG();

//   return (
//     <div>
//       <h2>Current Background State:</h2>
//       <pre>{JSON.stringify(formBackgroundState, null, 2)}</pre>
//       <button onClick={() => updateFormBG({ backgroundColor: '#f0f0f0' })}>
//         Change Form Background Color
//       </button>
//     </div>
//   );
// }

"use client"

import React, { createContext, useContext, useReducer, Dispatch, useCallback } from 'react';

type BackgroundType = 'color' | 'image';

export interface BackgroundState {
  backgroundType: BackgroundType;
  backgroundColor: string;
  backgroundImage: string;
  darkModeEnabled: boolean;
  darkBackgroundImage: string;
}

type BackgroundAction = {
  type: 'UPDATE_BACKGROUND';
  payload: Partial<BackgroundState>;
};

interface BackgroundContextType {
  formBackgroundState: BackgroundState;
  updateFormBG: (newState: Partial<BackgroundState>) => void;
  getFormBackgroundStyle: () => React.CSSProperties;
}

const initialState: BackgroundState = {
  backgroundType: 'image',
  backgroundColor: '#ffffff',
  backgroundImage: '/circuit-board.svg',
  darkModeEnabled: false,
  darkBackgroundImage: '/dark/circuit-board-dark.svg',
};

function formBackgroundReducer(state: BackgroundState, action: BackgroundAction): BackgroundState {
  switch (action.type) {
    case 'UPDATE_BACKGROUND':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const FormBGContext = createContext<BackgroundContextType | undefined>(undefined);

export function FormBGProvider({ children }: { children: React.ReactNode }) {
  const [formBackgroundState, dispatch] = useReducer(formBackgroundReducer, initialState);

  const updateFormBG = (newState: Partial<BackgroundState>) => {
    dispatch({ type: 'UPDATE_BACKGROUND', payload: newState });
  };

  const getFormBackgroundStyle = useCallback(() => {
    if (formBackgroundState.backgroundType === 'color') {
      return { backgroundColor: formBackgroundState.backgroundColor };
    } else {
      const currentImage = formBackgroundState.darkModeEnabled 
        ? formBackgroundState.darkBackgroundImage 
        : formBackgroundState.backgroundImage;
      return { 
        backgroundImage: `url(${currentImage})`,
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto'
      };
    }
  }, [formBackgroundState]);

  const value = React.useMemo(() => ({
    formBackgroundState,
    updateFormBG,
    getFormBackgroundStyle
  }), [formBackgroundState]);

  return (
    <FormBGContext.Provider value={value}>
      {children}
    </FormBGContext.Provider>
  );
}

export function useFormBG() {
  const context = useContext(FormBGContext);
  if (!context) {
    throw new Error('useFormBG must be used within a FormBGProvider');
  }
  return context;
}

