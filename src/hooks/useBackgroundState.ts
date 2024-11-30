'use client'
import { useEffect } from 'react';
import { useBackground } from '@/components/context/BackgroundContext';

export function useBackgroundState() {
  const { backgroundState, updateBackground } = useBackground();
  

  const getBackgroundStyle = () => {
    if (backgroundState.backgroundType === 'color') {
      return { backgroundColor: backgroundState.backgroundColor };
    } else {
      const currentImage = backgroundState.darkModeEnabled ? backgroundState.darkBackgroundImage : backgroundState.backgroundImage;
      return { backgroundImage: `url(${currentImage})` };
    }
  };

  return {
    backgroundState,
    updateBackground,
    getBackgroundStyle,
  };
}