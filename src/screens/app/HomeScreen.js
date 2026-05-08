import React, { useContext, useMemo } from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Text, FAB, Portal } from 'react-native-paper';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { getColors, getglobalStyles } from '../../theme/theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import UserHeader from '../../components/common/UserHeader';
import BotCarousel from '../../components/bots/BotCarrusel';
import ActivitiesList from '../../components/activities/ActivitiesList';
import { AuthContext } from '../../context/AuthContext';
import {  ActivityIndicator } from 'react-native-paper';

//CUSTOM HOOKS
import { useActivities } from '../../hooks/useActivities';

export default function HomeScreen({ navigation }) {
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();
  
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);

  const { user, signOut } = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [open, setOpen] = React.useState(false);

  // Llamamos al hook con autoRefresh activo cada 60 segundos
  const { activities, loading } = useActivities(true, 60000);

  // Seleccionamos solo las 10 actividades más recientes para no saturar la pantalla de informacion irrelevante
  const recentActivities = useMemo(() => {
    if (Array.isArray(activities)) {
      return activities.slice(0, 10);
    }
    // Si no es un array (está cargando o hubo error), devolvemos array vacío
    return [];
  }, [activities]);

  const botsData = [
    { bot_id: "BOT001", name: "FocusBot Alpha", ssid: "FocusNet_Alpha", mac_address: "00:1A:7D:DA:71:13", status: "IDLE", version: "1.2.3", last_sync: "2026-04-17T19:45:00" },
    { bot_id: "BOT002", name: "FocusBot Beta", ssid: "FocusNet_Beta", mac_address: "00:1A:7D:DA:71:14", status: "OFFLINE", version: "1.2.3", last_sync: "2026-04-17T19:50:00" },
    { bot_id: "BOT003", name: "FocusBot Gamma", ssid: "FocusNet_Gamma", mac_address: "00:1A:7D:DA:71:15", status: "FOCUSING", version: "1.2.3", last_sync: "2026-04-17T19:55:00" },
  ];



  const ejecutarLogout = async () => {
    await signOut();
    console.log("Sesión cerrada");
  };

  return (
    <ScreenWrapper withScroll={true}>
      <View style={isWeb ? globalStyles.container_web : globalStyles.container_movil}>
        {!isWeb && 
          <UserHeader user={user || { 
            first_name: 'Nombre', 
            last_name: 'Apellido', 
            email: 'invitado@focusbot.com' }} 
          />
        }
        <View style={{ paddingBottom: isWeb ? 10 : 80 }}>
          {isWeb && <UserHeader user={user || { first_name: 'Nombre', last_name: 'Apellido', email: 'invitado@focusbot.com' }} />}
          <BotCarousel 
            bots={botsData} 
            onAddPress={() => console.log("Añadir nuevo bot")}
            onBotPress={(bot) => console.log("Seleccionado:", bot.name)}
            globalStyles={globalStyles}
            addProp = {true}
          />
          <Text variant="titleLarge" style={{ textAlign: 'center', marginVertical:  20 }}>
            Actividades Recientes
          </Text>
          {loading && activities.length === 0 ? (
            <ActivityIndicator animating={true} color={colors.primary} style={{ marginVertical: 20 }} />
          ) : (
            <ActivitiesList 
              activities={recentActivities} 
              // Navegamos a la pantalla principal de actividades al pulsar
              onActivityPress={(activity) => navigation.navigate('Activities')}
              globalStyles={globalStyles} 
            />
          )}
        </View>
      </View>
      <Portal>
        <FAB.Group
          open={open}
          visible={isFocused}
          icon={open ? 'close' : 'plus'}
          actions={[
            {
              icon: 'robot',
              label: 'Nuevo Bot',
              onPress: () => console.log('Crear bot'),
              style: { backgroundColor: colors.secondary,},
              color: colors.background,
            },
            {
              icon: 'calendar',
              label: 'Nueva Actividad',
              onPress: () => console.log('Configurar'),
              style: { backgroundColor: colors.secondary, marginBottom: isWeb ? 10: 100 },
              color: colors.background,
              labelStyle: {marginBottom: isWeb ? 10: 100 }
            },
          ]}
          onStateChange={({ open }) => setOpen(open)}
          fabStyle={
            { 
            backgroundColor: open ? colors.placeholder : colors.primary,
            bottom: isWeb ? 20 : 100,
            
            }
          }
          color={colors.background}
          backdropColor="rgba(0,0,0,0.5)"
        />
      </Portal>
    </ScreenWrapper>
  );
}