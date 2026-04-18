import React, { useContext } from 'react';
import { View, StyleSheet, SafeAreaView, Platform, useColorScheme } from 'react-native'; 
import { Avatar, Text, Button, IconButton } from 'react-native-paper';
import { updateAppColors, getglobalStyles } from '../../theme/theme'; // Cambiado para usar el actualizador
import { AuthContext } from '../../context/AuthContext';
// import { globalStyles } from '../../theme/theme'; // Mantener si se usa en otro sitio

const UserHeader = ({ user }) => {
  const scheme = useColorScheme();
  const AppColors = updateAppColors(scheme); // Colores reactivos al sistema  
  const isWeb = Platform.OS === 'web';
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
      <View style={styles.userContainer  }>

        {!isWeb && (
          <>
            <Avatar.Image 
              size={60} 
              source={require('../../assets/avatar.png')} 
              // style={{ backgroundColor: AppColors.secondary }} 
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
              mode="contained"
              icon="logout"
              size = {20}
              onPress={ejecutarLogout}
              iconColor={AppColors.primary}                
              // style={{ backgroundColor: AppColors.error }}  
            />
          </>
        )}

        {isWeb && (
          <View
            style = {{
              flexDirection: 'row',
              alignItems: 'center',
              margin: 20
            }}
          >
            <Avatar.Image 
              size={100} 
              source={require('../../assets/avatar.png')} 
              // style={{ backgroundColor: AppColors.secondary }} 
            />

            <View>
              <Text style={styles.userTittle}>
                ¡Hola de nuevo!
              </Text>
              <Text style={styles.userName}>
                {user.first_name} {user.last_name}
              </Text>
            </View>
          </View>
        )}

      </View>
    </SafeAreaView>
  );
};

// Función de estilos que recibe AppColors para ser "global" en esta hoja
const getStyles = (AppColors) => StyleSheet.create({
  topBarContainer: {
    
    backgroundColor: Platform.OS === 'web' ? 'transparent' : AppColors.surface,
    borderRadius: Platform.OS === 'web' ? 0 : 60,
    marginHorizontal: Platform.OS === 'web' ? 0 : 10,

    // ANDROID
    elevation: Platform.OS === 'web' ? 0 : 5,

    // iOS
    shadowColor: Platform.OS === 'web' ? 0 : '#000',
    shadowOffset: Platform.OS === 'web' ? 0 : { width: 0, height: 3 },
    shadowOpacity: Platform.OS === 'web' ? 0 : 0.25,
    shadowRadius: Platform.OS === 'web' ? 0 : 4,
  },

  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  userTittle: {
    fontSize: 30,
    fontWeight: '1000',
    color: AppColors.primary,
    marginLeft: 16
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
  logoContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    backgroundColor: AppColors.primary,
    width: '100%'
    // marginBottom: 40,
  },
  logoContainer_name: {
    display: 'flex',
    flexDirection: "row"

  },
  logo_focus: {
    fontSize: 22,
    fontWeight: 'bold',
    color: AppColors.primary,
    // marginBottom: 8,
  },
  logo_bot: {
    fontSize: 22,
    fontWeight: 'bold',
    color: AppColors.text,
    // marginBottom: 8,
  },
  logoSubtitle: {
    fontSize: 11,
    color: AppColors.textLight,
  },
});

export default UserHeader;