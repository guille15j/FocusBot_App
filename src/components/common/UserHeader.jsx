import React, { useContext } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, useColorScheme } from 'react-native'; 
import { Avatar, Text, Button } from 'react-native-paper';
import { updateAppColors } from '../../theme/theme'; // Cambiado para usar el actualizador
import { AuthContext } from '../../context/AuthContext';
// import { globalStyles } from '../../theme/theme'; // Mantener si se usa en otro sitio

const UserHeader = ({ user }) => {
  const scheme = useColorScheme();
  const AppColors = updateAppColors(scheme); // Colores reactivos al sistema
  
  if (!user) return null;

  const { signOut } = useContext(AuthContext);

  const ejecutarLogout = async () => {
    await signOut();
    console.log("Sesión cerrada");
  };

  // Generamos los estilos pasando los colores actuales
  const styles = getStyles(AppColors);

  return (
    <SafeAreaView edges={['top']} style={styles.topBarContainer}>
      <View style={styles.userContainer}>
        <Avatar.Icon 
          size={40} 
          icon="account" 
          style={{ backgroundColor: AppColors.secondary }} 
          color="white" 
        />
        <Text style={styles.userName}>
          {user.first_name} {user.last_name}
        </Text>

        <View style={{ flex: 1 }} /> 

        <Button
          mode="outlined"
          onPress={ejecutarLogout}
          icon="logout"
          textColor={AppColors.text} // Ajuste dinámico
          style={{ borderColor: AppColors.placeholder }}
        >
          Cerrar Sesión
        </Button>
      </View>
    </SafeAreaView>
  );
};

// Función de estilos que recibe AppColors para ser "global" en esta hoja
const getStyles = (AppColors) => StyleSheet.create({
  topBarContainer: {
    backgroundColor: AppColors.primary, // Ahora usa el color del tema
    elevation: 2,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    paddingTop: Platform.OS === 'android' ? 30 : (Platform.OS === 'ios' ? 0 : 20),
    marginTop: Platform.OS === 'android' ? -35 : (Platform.OS === 'ios' ? -60 : 0),
    borderBottomEndRadius: Platform.OS === 'web' ? 0 : 30,
    borderBottomStartRadius: Platform.OS === 'web' ? 0 : 30,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: AppColors.background, // O el color que prefieras según tu paleta
    marginLeft: 16
  },
});

export default UserHeader;