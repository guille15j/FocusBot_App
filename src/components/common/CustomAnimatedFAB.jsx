import React from 'react';
import { useColorScheme, StyleSheet } from 'react-native';
import { AnimatedFAB, MD2LightTheme, MD2DarkTheme } from 'react-native-paper';
import { updateAppColors, getglobalStyles } from '../../theme/theme';

/**
 * Componente FAB Animado personalizado.
 * @param {string} icon - Nombre del icono de MaterialCommunityIcons.
 * @param {string} label - Texto a mostrar cuando está extendido.
 * @param {function} onPress - Acción al presionar.
 * @param {boolean} isExtended - Estado controlado desde el ScrollView padre.
 */
const CustomAnimatedFAB = ({ icon, label, onPress, isExtended = true }) => {
  const scheme = useColorScheme();
  const AppColors = updateAppColors(scheme);
  const globalStyles = getglobalStyles(scheme);

  // Forzamos MD2 para asegurar que el botón sea circular
  const baseTheme = scheme === 'dark' ? MD2DarkTheme : MD2LightTheme;

  return (
    <AnimatedFAB
      icon={icon}
      label={label}
      extended={isExtended}
      onPress={onPress}
      visible={true}
      animateFrom={'right'}
      iconMode={'dynamic'}
      // Configuración temática para forzar el círculo del boton cuando este cerrado
      
      theme={{ 
        ...baseTheme,
        roundness: 30, 
        colors: { 
          ...baseTheme.colors,
          primary: AppColors.primary,
          accent: AppColors.primary 
        } 
      }}
      style={[
        globalStyles.fab, 
        { 
            borderRadius: 100, 
            backgroundColor: AppColors.primary 
        }
      ]}
      color={AppColors.background}
    />
  );
};

export default CustomAnimatedFAB;