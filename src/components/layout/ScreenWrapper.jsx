import React from 'react';
import { View, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { AppColors } from '../../theme/theme';

export const ScreenWrapper = ({ children, withScroll = true }) => {
  const { isWeb } = useResponsiveLayout();
  const Container = withScroll ? ScrollView : View;

  return (
    <SafeAreaView style={styles.safeArea}>
      <Container
        style={isWeb ? styles.webPadding : styles.mobilePadding}
        showsVerticalScrollIndicator={isWeb ? true:false}
      >
        {children}
      </Container>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    safeArea: { 
        flex: 1, 
        backgroundColor: AppColors.background 
    },
    webPadding: { 
        // paddingHorizontal: 0, 
        // paddingVertical: 24,
        marginLeft: 80,
        // backgroundColor: '#ff0'
    },
    mobilePadding: { 
        // paddingHorizontal: 16, 
        // paddingVertical: 12,
        // marginLeft: 0,
        // backgroundColor: '#ff0000'
    },
});