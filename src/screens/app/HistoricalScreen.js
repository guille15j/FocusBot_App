import React from 'react';
import { View, useColorScheme, ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { getglobalStyles, updateAppColors } from '../../theme/theme';

export default function HistoricalRecords() {
  const scheme = useColorScheme();
  const AppColors = updateAppColors(scheme);
  const globalStyles = getglobalStyles(scheme);
  const { isWeb } = useResponsiveLayout();
  const styles = getStyles(AppColors);

  return (
    <ScreenWrapper>
      <View style={(isWeb ? globalStyles.container_web : globalStyles.container_movil)}>
        <SafeAreaView style={(isWeb ? { height: '100dvh' } : { height: '100%' })}>
          <ScrollView>
            <Text style={{ color: AppColors.text, padding: 20 }}>Historial</Text>
          </ScrollView>
        </SafeAreaView>
      </View>
    </ScreenWrapper>
  );
}

const getStyles = (AppColors) => StyleSheet.create({});