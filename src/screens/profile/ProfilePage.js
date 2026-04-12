import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Button, Text, List } from 'react-native-paper';
import { AuthContext } from '../../services/AuthContext';

export default function ProfilePage() {
  const { signOut } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text size={80} label="U" />
        <Text variant="headlineSmall" style={styles.name}>Mi Perfil</Text>
      </View>
      
      <List.Section style={styles.section}>
        <List.Item title="Configuración de Cuenta" left={p => <List.Icon {...p} icon="cog" />} />
        <List.Item title="Privacidad" left={p => <List.Icon {...p} icon="shield-account" />} />
      </List.Section>

      <Button mode="outlined" onPress={signOut} color="red" style={styles.logout}>
        Cerrar Sesión
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { alignItems: 'center', marginTop: 20 },
  name: { marginTop: 10 },
  section: { marginTop: 30 },
  logout: { marginTop: 50, borderColor: 'red' }
});