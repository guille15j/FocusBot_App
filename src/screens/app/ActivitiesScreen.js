import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { AppColors, globalStyles } from '../../theme/theme';

export default function Activities() {

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
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
  title: { marginBottom: 20 },
  card: { marginBottom: 10 }
});