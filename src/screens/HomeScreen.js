// src/screens/HomeScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, FAB } from 'react-native-paper';
import { authStorage } from '../services/authStorage';
import { AuthContext } from '../services/AuthContext';

export default function HomeScreen({ navigation }) {

  const { signOut } = React.useContext(AuthContext);

  const ejecutarLogOut = async () => {
    try{
      await signOut();
      console.log("Sesión cerrada correctamente");
    }catch(error){
      console.error("Error al cerrar sesión", error);
    }
  };




  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">¡Bienvenido a FocusBot!</Text>
      <Text style={styles.info}>Aquí aparecerán tus dispositivos pronto.</Text>
      <Button 
          mode="contained" 
          onPress={ejecutarLogOut}
          style={styles.button}
      >
          Cerrar Sesion
      </Button>

      {/* Botón flotante */}
      <FAB
        icon="plus"
        label="Bot"
        style={styles.fab}
        onPress={() => console.log("Ir a vincular...")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', alignItems: 'center' },
  info: { marginTop: 10, color: 'gray' },
  button: { marginTop: 10, paddingVertical: 5},
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
});