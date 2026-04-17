import { Platform, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';

/**
* Hook personalizado para detectar el tipo de dispositivo y orientación
* 
* @returns {Object} - Información sobre la plataforma y dimensiones
* 
*/

export const useResponsiveLayout = () => {
  const width = Dimensions.get('window').width;
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