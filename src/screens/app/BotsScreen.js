import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, FAB } from 'react-native-paper';
import { AppColors } from '../../theme/theme';

export default function BotsPage({ navigation }) {
  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text variant="headlineMedium">Mis Bots</Text>
        <Text>Aquí aparecerá la lista de tus dispositivos vinculados.</Text>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('LinkBot')}
          label="Vincular Nuevo"
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 20, backgroundColor: AppColors.primary }
});