import React from 'react';
import { View, ScrollView, StyleSheet, useColorScheme, KeyboardAvoidingView } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { getColors } from '../../theme/theme';
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const ScreenWrapper = ({ children, withScroll = true }) => {
  const { isWeb, platform } = useResponsiveLayout();
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
      <KeyboardAvoidingView
        behavior={platform === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoiding}
        enabled={!isWeb} 
        keyboardVerticalOffset={platform === 'ios' ? 36 : 0}
      >
        <Container
          style={[
            isWeb ? styles.webPadding : styles.mobileContainer,
            // 🚀 SOLUCIÓN: El margen va aquí, pero le aplicamos el mismo fondo de la app.
            // Esto hace que las sombras ('elevation') se dibujen sobre el color correcto 
            // y elimina la dichosa línea blanca.
            !isWeb && { 
              marginBottom: platform === 'ios' ? 36 : 70,
              backgroundColor: colors.background 
            }
          ]}
          showsVerticalScrollIndicator={!isWeb}
          contentContainerStyle={withScroll ? { flexGrow: 1 } : undefined}
        >
          {children}
        </Container>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1,
  },
  keyboardAvoiding: {
    flex: 1,
  },
  webPadding: { 
    marginVertical: 20,
    marginLeft: 80,
    height: '100dvh',
    overflow: 'scroll',
  },
  mobileContainer: {
    flex: 1,
  }
});