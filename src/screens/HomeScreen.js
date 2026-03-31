// src/screens/HomeScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, FAB } from 'react-native-paper';
import { AuthContext } from '../services/AuthContext';

import { globalStyles } from '../theme/theme';

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
    <View style={globalStyles.container}>
      <Text variant="headlineMedium">¡Bienvenido a FocusBot!</Text>
      <Text style={globalStyles.info}>Aquí aparecerán tus dispositivos pronto.</Text>
      <Button 
          mode="contained" 
          onPress={ejecutarLogOut}
      >
          Cerrar Sesion
      </Button>

      <FAB
        icon="robot"
        style={globalStyles.fab}
        onPress={() => navigation.replace('LinkBot')}
        // onPress={() => console.log("Ir a vincular...")}
      />
    </View>
  );
}
