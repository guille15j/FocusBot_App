import React from 'react';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { AppColors } from '../../theme/theme';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const ScreenWrapper = ({ children, withScroll = true }) => {
  const { isWeb } = useResponsiveLayout();
  const insets = useSafeAreaInsets();
  const Container = withScroll ? ScrollView : View;

  // Ajuste fino para móviles reales
  const topInset = Platform.OS === "ios"
    ? Math.min(insets.top, 0) // Evita exceso por Dynamic Island
    : Math.max(insets.top- 50, 0); // Android mete más padding del necesario

  const bottomInset = Platform.OS === "android"
    ? Math.max(insets.bottom - 6, 0) // Ajuste por gestos
    : insets.bottom;

  return (
    <View
      style={[
        styles.safeArea,
        {
          paddingTop: isWeb ? 0 : topInset,
          paddingBottom: isWeb ? 0 : bottomInset,
        }
      ]}
    >
      <Container
        style={isWeb ? styles.webPadding : styles.mobilePadding}
        showsVerticalScrollIndicator={isWeb}
      >
        {children}
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: AppColors.background,
  },
  webPadding: { 
    marginLeft: 80,
  },
  mobilePadding: { 
    // Puedes añadir padding si quieres
  },
});
