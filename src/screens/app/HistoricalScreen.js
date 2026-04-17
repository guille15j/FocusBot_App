import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, List, Divider } from 'react-native-paper';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { AppColors } from '../../theme/theme'; 

export default function HistoricalRecords() {
  const data = [
    { id: '1', date: '2024-03-24', detail: 'Focus Session - 45min' },
    { id: '2', date: '2024-03-23', detail: 'Deep Work - 2h' },
  ];

  return (
    <ScreenWrapper>
      <Text variant="headlineMedium" style={styles.title}>Historial</Text>
      
      {/* ========== TARJETA DE ESTADÍSTICAS ========== */}
      <View style={styles.statsCard}>
        <Text variant="titleMedium" style={styles.statsTitle}>
          Resumen de Hoy
        </Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Sesiones</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0h</Text>
            <Text style={styles.statLabel}>Enfoque</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>0</Text>
            <Text style={styles.statLabel}>Bots</Text>
          </View>
        </View>
      </View>
          
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.detail}
            description={item.date}
            left={props => <List.Icon {...props} icon="calendar-check" />}
          />
        )}
        ItemSeparatorComponent={Divider}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  title: { 
    marginBottom: 20,
    marginHorizontal: 15,
  },
  statsCard: {
    margin: 20,
    padding: 20,
    borderRadius: 20,
    backgroundColor: AppColors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statsTitle: {
    color: AppColors.text,
    marginBottom: 16,
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: AppColors.placeholder, // ← Cambiado de textLight a placeholder
    marginTop: 4,
  },
});