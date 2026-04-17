import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Card, Avatar, Surface, FAB, Portal } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { globalStyles, AppColors } from '../../theme/theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { ScrollView } from "react-native-gesture-handler";
import { BlurView } from 'expo-blur';


import GridBots from '../../components/bots/BotsGrid'
import ListaBots from '../../components/bots/BotList'
import UserHeader from '../../components/common/UserHeader'

import { AuthContext } from '../../context/AuthContext';

export default function HomeScreen({ navigation }) {
  
  // Obtenemos los datos del usuario y la función signOut del contexto
  const { user, signOut } = useContext(AuthContext);
  const [open, setOpen] = React.useState(false);
  
  // Función para cerrar sesión
  const ejecutarLogout = async () => {
    await signOut();
    console.log("Sesión cerrada");
  };

  const { isWeb } = useResponsiveLayout();

  const botsData = [
  {
    bot_id: "BOT001",
    name: "FocusBot Alpha",
    ssid: "FocusNet_Alpha",
    mac_address: "00:1A:7D:DA:71:13",
    status: "IDLE",
    version: "1.2.3",
    last_sync: "2026-04-17T19:45:00",
  },
  {
    bot_id: "BOT002",
    name: "FocusBot Beta",
    ssid: "FocusNet_Beta",
    mac_address: "00:1A:7D:DA:71:14",
    status: "FOCUSING",
    version: "1.2.3",
    last_sync: "2026-04-17T19:50:00",
  },
  {
    bot_id: "BOT003",
    name: "FocusBot Beta",
    ssid: "FocusNet_Beta",
    mac_address: "00:1A:7D:DA:71:14",
    status: "FOCUSING",
    version: "1.2.3",
    last_sync: "2026-04-17T19:50:00",
  },
  {
    bot_id: "BOT004",
    name: "FocusBot Beta",
    ssid: "FocusNet_Beta",
    mac_address: "00:1A:7D:DA:71:14",
    status: "FOCUSING",
    version: "1.2.3",
    last_sync: "2026-04-17T19:50:00",
  },
  {
    bot_id: "BOT005",
    name: "FocusBot Beta",
    ssid: "FocusNet_Beta",
    mac_address: "00:1A:7D:DA:71:14",
    status: "FOCUSING",
    version: "1.2.3",
    last_sync: "2026-04-17T19:50:00",
  },
];


  return (
    <ScreenWrapper >
      <View style ={(isWeb ? globalStyles.container_web : globalStyles.container_movil)}>
        <SafeAreaView style = {(isWeb ? {height: '100dvh'}: {height: '100%'})} >
          <UserHeader user = {{'first_name':'nombre', 'last_name':'apellido'}}/>
          
          <ScrollView>
            <GridBots data = {botsData} numColumns = {3}/>
            

            <ListaBots data={botsData}/>
          </ScrollView>

          <Portal>
            <FAB.Group
              open={open}
              visible
              icon={open ? 'close' : 'plus'}
              actions={[
                {
                  icon: 'robot',
                  label: 'Nuevo Bot',
                  onPress: () => console.log('Crear bot'),
                  style: {backgroundColor: AppColors.secondary },
                  labelStyle: { marginRight: -20},
                  color: AppColors.background
                },
                {
                  icon: 'calendar',
                  label: 'Nueva Actividad',
                  onPress: () => console.log('Configurar'),
                  style: { marginBottom:170, backgroundColor: AppColors.secondary }, 
                  labelStyle: { marginBottom:170 , marginRight: -20},
                  color: AppColors.background
                },
              ]}
              onStateChange={({ open }) => setOpen(open)}
              fabStyle={[globalStyles.fab, { bottom: 100, backgroundColor: (open ? AppColors.placeholder : AppColors.primary)}]}
              color= {AppColors.background}
              backdropColor='transparent'

            />
        </Portal>
        </SafeAreaView>
      </View>
    </ScreenWrapper>
  );
}


const styles = StyleSheet.create({

  content: {
    padding: 20,
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -10,
  },

});