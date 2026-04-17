import { Platform, Dimensions } from 'react-native';
import { useState, useEffect } from 'react';

/**
* Hook personalizado para detectar el tipo de dispositivo y orientación
* 
* @returns {Object} - Información sobre la plataforma y dimensiones
* 
*/

export const useResponsiveLayout = () => {
  const isWeb = Platform.OS === 'web';
  const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';

  return {
    isWeb,
    isMobile,
    platform: Platform.OS,
  };
};