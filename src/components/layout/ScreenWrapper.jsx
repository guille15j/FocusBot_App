import React from 'react';
import { View, ScrollView, StyleSheet, Platform, useColorScheme } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { getColors } from '../../theme/theme';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const ScreenWrapper = ({ children, withScroll = true }) => {
  const { isWeb } = useResponsiveLayout();
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const Container = withScroll ? ScrollView : View;

  return (
    <View
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.background,
          paddingTop: isWeb ? 0 : insets.top,
          paddingBottom: isWeb ? 0 : insets.bottom,
        }
      ]}
    >
      <Container
        style={isWeb ? styles.webPadding : styles.mobilePadding}
        showsVerticalScrollIndicator={!isWeb}
        contentContainerStyle={withScroll ? { flexGrow: 1 } : undefined}
      >
        {children}
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1,
  },
  webPadding: { 
    // El padding/margen para web se manejará en las pantallas o en el layout principal
  },
  mobilePadding: { 
    // Puedes añadir padding si quieres
  },
});