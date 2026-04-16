import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';

export default function Activities() {
  return (
    <ScrollView style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Actividades</Text>
      <Card style={styles.card}>
        <Card.Title title="Sesión de Enfoque" subtitle="Pendiente" />
        <Card.Content>
          <Text variant="bodyMedium">No hay actividades recientes hoy.</Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 15 },
  title: { marginBottom: 20 },
  card: { marginBottom: 10 }
});