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

export default function HomeScreen({ navigation }) {
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();
  
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);

  const { user, signOut } = useContext(AuthContext);
  const isFocused = useIsFocused();
  const [open, setOpen] = React.useState(false);

  const botsData = [
    { bot_id: "BOT001", name: "FocusBot Alpha", ssid: "FocusNet_Alpha", mac_address: "00:1A:7D:DA:71:13", status: "IDLE", version: "1.2.3", last_sync: "2026-04-17T19:45:00" },
    { bot_id: "BOT002", name: "FocusBot Beta", ssid: "FocusNet_Beta", mac_address: "00:1A:7D:DA:71:14", status: "OFFLINE", version: "1.2.3", last_sync: "2026-04-17T19:50:00" },
    { bot_id: "BOT003", name: "FocusBot Gamma", ssid: "FocusNet_Gamma", mac_address: "00:1A:7D:DA:71:15", status: "FOCUSING", version: "1.2.3", last_sync: "2026-04-17T19:55:00" },
  ];

  const activitiesData = [
    { activity_id: 1, type_id: 1, user_id: "U99", bot_id: "B-Alpha", title: "Entrenamiento Pierna", description: "Sentadillas y Prensa", init_date: "2026-04-19T08:00:00", end_date: "2026-04-19T09:30:00", state: "COMPLETADO", category: "DEPORTES", result: "SUCCESS" },
    { activity_id: 2, type_id: 2, user_id: "U99", bot_id: null, title: "React Native Docs", description: "Estudio de FlatList", init_date: "2026-04-19T10:00:00", end_date: "2026-04-19T12:00:00", state: "EN CURSO", category: "ESTUDIOS", result: null },
    { activity_id: 3, type_id: 3, user_id: "U99", bot_id: "B-Zeta", title: "Limpiar Cocina", description: "Desinfectar superficies", init_date: "2026-04-19T14:00:00", end_date: "2026-04-19T15:00:00", state: "PENDIENTE", category: "HOGAR", result: null },
  ];

  const ejecutarLogout = async () => {
    await signOut();
    console.log("Sesión cerrada");
  };

  return (
    <ScreenWrapper withScroll={true}>
      <View style={isWeb ? globalStyles.container_web : globalStyles.container_movil}>
        {!isWeb && <UserHeader user={{ first_name: 'Nombre', last_name: 'Apellido', user_id: '123' }} />}
        <View style={{ paddingBottom: isWeb ? 10 : 80 }}>
          {isWeb && <UserHeader user={{ first_name: 'Nombre', last_name: 'Apellido', user_id: '123' }} />}
          <BotCarousel 
            bots={botsData} 
            onAddPress={() => console.log("Añadir nuevo bot")}
            onBotPress={(bot) => console.log("Seleccionado:", bot.name)}
            globalStyles={globalStyles}
          />
          <Text variant="titleLarge" style={{ textAlign: 'center', marginVertical: 20 }}>
            Actividades
          </Text>
          <ActivitiesList 
            activities={activitiesData} 
            onActivityPress={(activity) => console.log("Detalles de:", activity.title)}
            globalStyles={globalStyles} 
          />
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
              style: { backgroundColor: colors.secondary },
              color: colors.background
            },
            {
              icon: 'calendar',
              label: 'Nueva Actividad',
              onPress: () => console.log('Configurar'),
              style: { backgroundColor: colors.secondary },
              color: colors.background
            },
          ]}
          onStateChange={({ open }) => setOpen(open)}
          fabStyle={{ 
            backgroundColor: open ? colors.placeholder : colors.primary,
            bottom: isWeb ? 20 : 70,
          }}
          color={colors.background}
          backdropColor="rgba(0,0,0,0.5)"
        />
      </Portal>
    </ScreenWrapper>
  );
}