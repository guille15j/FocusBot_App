import React from 'react';
import { View, StyleSheet, ScrollView  } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { AppColors, globalStyles } from '../../theme/theme';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

export default function BotsPage({ navigation }) {

  const { isWeb } = useResponsiveLayout();

  return (
    <ScreenWrapper >
      <View style ={(isWeb ? globalStyles.container_web : globalStyles.container_movil)}>
        <SafeAreaView style = {(isWeb ? {height: '100dvh'}: {})} >
          <ScrollView>
            



          </ScrollView>
        </SafeAreaView>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 20, backgroundColor: AppColors.primary }
});