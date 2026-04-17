import React, { useContext } from 'react';
import { View, StyleSheet , ScrollView } from 'react-native';
import { Avatar, Button, Text, List } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors, globalStyles } from '../../theme/theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';


export default function ProfilePage() {
  const { signOut } = useContext(AuthContext);

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
                
              <Text>
                Perfil
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
