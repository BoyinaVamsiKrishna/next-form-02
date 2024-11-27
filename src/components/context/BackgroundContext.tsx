// "use client"

// import React, { useEffect, createContext, useContext, useReducer, Dispatch } from 'react';

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
//   backgroundState: BackgroundState;
//   updateBackground: (newState: Partial<BackgroundState>) => void;
// }


// interface BackgroundProviderProps {
//   children: React.ReactNode;
//   onBackgroundChange?: (newState: BackgroundState) => void;
// }
// const initialState: BackgroundState = {
//   backgroundType: 'image',
//   backgroundColor: '#ffffff',
//   backgroundImage: '/overlapping-circles.svg',
//   darkModeEnabled: false,
//   darkBackgroundImage: '/dark/overlapping-circles.svg',
// };

// function backgroundReducer(state: BackgroundState, action: BackgroundAction): BackgroundState {
//   switch (action.type) {
//     case 'UPDATE_BACKGROUND':
//       return { ...state, ...action.payload };
//     default:
//       return state;
//   }
// }

// const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

// export function BackgroundProvider({ children, onBackgroundChange }: BackgroundProviderProps) {
//   const [backgroundState, dispatch] = useReducer(backgroundReducer, initialState);

//   const updateBackground = (newState: Partial<BackgroundState>) => {
//     dispatch({ type: 'UPDATE_BACKGROUND', payload: newState });
    
//   };

//   useEffect(() => {
//     console.log('Background state updated:', backgroundState);
//     if (onBackgroundChange) {
//       onBackgroundChange(backgroundState);
//     }
//   }, [backgroundState, onBackgroundChange]);

//   return (
//     <BackgroundContext.Provider value={{ backgroundState, updateBackground }}>
//       {children}
//     </BackgroundContext.Provider>
//   );
// }


// export function useBackground() {
//   const context = useContext(BackgroundContext);
//   if (context === undefined) {
//     throw new Error('useBackground must be used within a BackgroundProvider');
//   }
//   return context;
// }

// export function BackgroundConsumer() {
//   const { backgroundState, updateBackground } = useBackground();

//   return (
//     <div>
//       <h2>Current Background State:</h2>
//       <pre>{JSON.stringify(backgroundState, null, 2)}</pre>
//       <button onClick={() => updateBackground({ backgroundColor: '#f0f0f0' })}>
//         Change Background Color
//       </button>
//     </div>
//   );
// }

"use client"

import React, { useEffect, createContext, useContext, useReducer, Dispatch } from 'react';

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
  backgroundState: BackgroundState;
  updateBackground: (newState: Partial<BackgroundState>) => void;
}

interface BackgroundProviderProps {
  children: React.ReactNode;
  onBackgroundChange?: (newState: BackgroundState) => void;
}

const initialState: BackgroundState = {
  backgroundType: 'image',
  backgroundColor: '#ffffff',
  backgroundImage: '/overlapping-circles.svg',
  darkModeEnabled: false,
  darkBackgroundImage: '/dark/overlapping-circles.svg',
};

function backgroundReducer(state: BackgroundState, action: BackgroundAction): BackgroundState {
  switch (action.type) {
    case 'UPDATE_BACKGROUND':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

export function BackgroundProvider({ children, onBackgroundChange }: BackgroundProviderProps) {
  const [backgroundState, dispatch] = useReducer(backgroundReducer, initialState);

  const updateBackground = (newState: Partial<BackgroundState>) => {
    dispatch({ type: 'UPDATE_BACKGROUND', payload: newState });
  };

  useEffect(() => {
    console.log('Background state updated:', backgroundState);
    if (onBackgroundChange) {
      onBackgroundChange(backgroundState);
    }
  }, [backgroundState, onBackgroundChange]);

  return (
    <BackgroundContext.Provider value={{ backgroundState, updateBackground }}>
      {children}
    </BackgroundContext.Provider>
  );
}

export function useBackground() {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
}

