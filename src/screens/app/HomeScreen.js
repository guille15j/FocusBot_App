import React, { useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Avatar, Surface, FAB } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { globalStyles, AppColors } from '../../theme/theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

// Contexto para obtener datos del usuario y función de logout
import { AuthContext } from '../../context/AuthContext';

export default function HomeScreen({ navigation }) {
  
  // Obtenemos los datos del usuario y la función signOut del contexto
  const { user, signOut } = useContext(AuthContext);
  
  // Función para cerrar sesión
  const ejecutarLogout = async () => {
    await signOut();
    console.log("Sesión cerrada");
  };

  const { isWeb } = useResponsiveLayout();

  return (
    <ScreenWrapper >
      <View style ={(isWeb ? globalStyles.container_web : globalStyles.container_movil)}>
        <SafeAreaView style = {(isWeb ? {height: '100dvh'}: {})} >
          <ScrollView>
            <Text style = {(isWeb ? {height: '1000px'}: {height:'1000'})}>
              prueba contenido
            </Text>

            <Button
              mode="outlined"
              onPress={ejecutarLogout}
              style={globalStyles.logoutButton}
              textColor={AppColors.error}
              icon="logout"
            >
              Cerrar Sesión
            </Button>




          </ScrollView>
        </SafeAreaView>
      </View>
    </ScreenWrapper>
  );
}


