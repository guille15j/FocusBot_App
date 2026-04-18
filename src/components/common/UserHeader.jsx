import React, { useContext } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, useColorScheme } from 'react-native'; 
import { Avatar, Text, Button, IconButton } from 'react-native-paper';
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
        <View>
          
        <Text style={styles.userName}>
          {user.first_name} {user.last_name}
        </Text>
        <Text style={styles.userDetail}>
          {user.user_id}
        </Text>
        </View>

        <View style={{ flex: 1 }} /> 

        <IconButton
          mode = "contained"
          onPress={ejecutarLogout}
          icon="logout"
          color="white" 
          backgroundColor= {AppColors.error}
          style={{ borderColor: AppColors.error }}
        />
      </View>
    </SafeAreaView>
  );
};

// Función de estilos que recibe AppColors para ser "global" en esta hoja
const getStyles = (AppColors) => StyleSheet.create({
  topBarContainer: {
    backgroundColor: AppColors.surface,
    borderRadius: Platform.OS === 'web' ? 0 : 60,
    marginHorizontal: Platform.OS === 'web' ? 0 : 10,

    // ANDROID
    elevation: 5,

    // iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  userName: {
    fontSize: 20,
    fontWeight: '500',
    color: AppColors.text,
    marginLeft: 16
  },
  userDetail: {
    fontSize: 16,
    fontWeight: '500',
    color: AppColors.placeholder,
    marginLeft: 16
  },
});

export default UserHeader;