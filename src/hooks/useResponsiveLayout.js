import { Platform, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';

export const useResponsiveLayout = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    return () => subscription?.remove();
  }, []);

  const width = dimensions.width;
  const platform = Platform.OS;
  
  const isMobile = (
    platform === 'web' ?
    width < 768 
    : (platform === 'ios' || platform === 'android'));
  
  const isWeb = (platform === 'web' && !isMobile);
  
  return {
    isWeb,
    isMobile,
    platform: Platform.OS,
  };
};