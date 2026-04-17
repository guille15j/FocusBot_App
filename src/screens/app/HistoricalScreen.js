import React from 'react';
import { View, StyleSheet, FlatList, ScrollView  } from 'react-native';
import { Text, List, Divider } from 'react-native-paper';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors, globalStyles } from '../../theme/theme'; 
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

export default function HistoricalRecords() {
  
  const { isWeb } = useResponsiveLayout();

  const data = [
    { id: '1', date: '2024-03-24', detail: 'Focus Session - 45min' },
    { id: '2', date: '2024-03-23', detail: 'Deep Work - 2h' },
  ];

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
