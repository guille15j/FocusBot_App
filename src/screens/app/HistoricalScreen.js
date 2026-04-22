import React, { useMemo } from 'react';
import { View, useColorScheme, ScrollView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { getColors, getglobalStyles } from '../../theme/theme';

export default function HistoricalRecords() {
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();
  
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);

  return (
    <ScreenWrapper>
      <View style={isWeb ? globalStyles.container_web : globalStyles.container_movil}>
        <ScrollView>
          <Text style={{ color: colors.text, padding: 20 }}>Historial</Text>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
}