import React, { useMemo } from 'react';
import { useColorScheme, StyleSheet } from 'react-native';
import { AnimatedFAB, MD2LightTheme, MD2DarkTheme } from 'react-native-paper';
import { getColors, getglobalStyles } from '../../theme/theme';

const CustomAnimatedFAB = ({ icon, label, onPress, isExtended = true }) => {
  const scheme = useColorScheme();
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme), [scheme]);

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
      theme={{ 
        ...baseTheme,
        roundness: 30,
        colors: { 
          ...baseTheme.colors,
          primary: colors.primary,
          accent: colors.primary 
        } 
      }}
      style={[
        globalStyles.fab, 
        { 
            borderRadius: 100, 
            backgroundColor: colors.primary 
        }
      ]}
      color={colors.background}
    />
  );
};

export default CustomAnimatedFAB;