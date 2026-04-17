import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, List, Divider } from 'react-native-paper';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';

export default function HistoricalRecords() {
  const data = [
    { id: '1', date: '2024-03-24', detail: 'Focus Session - 45min' },
    { id: '2', date: '2024-03-23', detail: 'Deep Work - 2h' },
  ];

  return (
    <ScreenWrapper>
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Historial</Text>
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
    </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 15 },
  title: { marginBottom: 20 }
});