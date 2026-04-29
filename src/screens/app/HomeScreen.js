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
    {"activity_id": 1, "type_id": 1, "user_id": "U99", "bot_id": "B-Alpha", "title": "Entrenamiento Pierna", "description": "Sentadillas y Prensa", "init_date": "2026-04-19T08:00:00", "end_date": "2026-04-19T09:30:00", "state": "COMPLETADO", "category": "DEPORTES", "result": "SUCCESS"},
    {"activity_id": 2, "type_id": 2, "user_id": "U99", "bot_id": null, "title": "React Native Docs", "description": "Estudio de FlatList", "init_date": "2026-04-19T10:00:00", "end_date": "2026-04-19T12:00:00", "state": "EN CURSO", "category": "ESTUDIOS", "result": null},
    {"activity_id": 3, "type_id": 3, "user_id": "U99", "bot_id": "B-Zeta", "title": "Limpiar Cocina", "description": "Desinfectar superficies", "init_date": "2026-04-19T14:00:00", "end_date": "2026-04-19T15:00:00", "state": "PENDIENTE", "category": "HOGAR", "result": null},
    {"activity_id": 4, "type_id": 1, "user_id": "U99", "bot_id": null, "title": "Lectura: El Quijote", "description": "Capítulo 10", "init_date": "2026-04-18T22:00:00", "end_date": "2026-04-18T23:00:00", "state": "COMPLETADO", "category": "LECTURA", "result": "SUCCESS"},
    {"activity_id": 5, "type_id": 4, "user_id": "U99", "bot_id": "B-Gamma", "title": "Meditación", "description": "Sesión guiada", "init_date": "2026-04-19T16:00:00", "end_date": "2026-04-19T16:20:00", "state": "POSPUESTO", "category": "DESCANSO", "result": "REJECTED"},
    {"activity_id": 6, "type_id": 5, "user_id": "U99", "bot_id": null, "title": "Portfolio Web", "description": "Subir proyectos", "init_date": "2026-04-20T09:00:00", "end_date": "2026-04-20T11:00:00", "state": "PENDIENTE", "category": "OTRAS", "result": null},
    {"activity_id": 7, "type_id": 2, "user_id": "U99", "bot_id": "B-Alpha", "title": "Examen Lógica", "description": "Simulacro algoritmos", "init_date": "2026-04-19T07:00:00", "end_date": "2026-04-19T08:00:00", "state": "CANCELADO", "category": "ESTUDIOS", "result": "FAILED"},
    {"activity_id": 8, "type_id": 3, "user_id": "U99", "bot_id": null, "title": "Lavar Ropa", "description": "Carga blanca", "init_date": "2026-04-19T18:00:00", "end_date": "2026-04-19T18:30:00", "state": "PENDIENTE", "category": "HOGAR", "result": null},
    {"activity_id": 9, "type_id": 1, "user_id": "U99", "bot_id": "B-Beta", "title": "Running 5K", "description": "Parque central", "init_date": "2026-04-19T06:30:00", "end_date": "2026-04-19T07:15:00", "state": "COMPLETADO", "category": "DEPORTES", "result": "SUCCESS"},
    {"activity_id": 10, "type_id": 4, "user_id": "U99", "bot_id": null, "title": "Siesta", "description": "Descanso rápido", "init_date": "2026-04-19T15:30:00", "end_date": "2026-04-19T16:00:00", "state": "COMPLETADO", "category": "DESCANSO", "result": "SUCCESS"},
    {"activity_id": 11, "type_id": 2, "user_id": "U99", "bot_id": "B-Gamma", "title": "Curso Python", "description": "Decoradores", "init_date": "2026-04-20T17:00:00", "end_date": "2026-04-20T18:30:00", "state": "PENDIENTE", "category": "ESTUDIOS", "result": null},
    {"activity_id": 12, "type_id": 1, "user_id": "U99", "bot_id": null, "title": "Lectura: Bioy Casares", "description": "La invención de Morel", "init_date": "2026-04-19T21:00:00", "end_date": "2026-04-19T22:00:00", "state": "EN CURSO", "category": "LECTURA", "result": null},
    {"activity_id": 13, "type_id": 3, "user_id": "U99", "bot_id": "B-Alpha", "title": "Planchar Camisas", "description": "Preparar semana", "init_date": "2026-04-19T20:00:00", "end_date": "2026-04-19T20:45:00", "state": "PENDIENTE", "category": "HOGAR", "result": null},
    {"activity_id": 14, "type_id": 5, "user_id": "U99", "bot_id": null, "title": "Supermercado", "description": "Compra mensual", "init_date": "2026-04-18T10:00:00", "end_date": "2026-04-18T11:30:00", "state": "COMPLETADO", "category": "OTRAS", "result": "SUCCESS"},
    {"activity_id": 15, "type_id": 1, "user_id": "U99", "bot_id": "B-Zeta", "title": "Yoga", "description": "Flexibilidad", "init_date": "2026-04-21T07:00:00", "end_date": "2026-04-21T08:00:00", "state": "PENDIENTE", "category": "DEPORTES", "result": null},
    {"activity_id": 16, "type_id": 4, "user_id": "U99", "bot_id": null, "title": "Podcast Historia", "description": "Roma antigua", "init_date": "2026-04-19T19:00:00", "end_date": "2026-04-19T20:00:00", "state": "EN CURSO", "category": "DESCANSO", "result": null},
    {"activity_id": 17, "type_id": 2, "user_id": "U99", "bot_id": "B-Beta", "title": "Lab React", "description": "Hooks avanzados", "init_date": "2026-04-22T09:00:00", "end_date": "2026-04-22T11:00:00", "state": "PENDIENTE", "category": "ESTUDIOS", "result": null},
    {"activity_id": 18, "type_id": 3, "user_id": "U99", "bot_id": null, "title": "Reparar Grifo", "description": "Fuga baño", "init_date": "2026-04-19T11:00:00", "end_date": "2026-04-19T11:30:00", "state": "CANCELADO", "category": "HOGAR", "result": "REJECTED"},
    {"activity_id": 19, "type_id": 1, "user_id": "U99", "bot_id": "B-Alpha", "title": "Natación", "description": "1000 metros", "init_date": "2026-04-20T08:00:00", "end_date": "2026-04-20T09:00:00", "state": "PENDIENTE", "category": "DEPORTES", "result": null},
    {"activity_id": 20, "type_id": 4, "user_id": "U99", "bot_id": null, "title": "Ver Serie", "description": "Capítulo final", "init_date": "2026-04-19T22:30:00", "end_date": "2026-04-19T23:30:00", "state": "PENDIENTE", "category": "DESCANSO", "result": null},
    {"activity_id": 21, "type_id": 5, "user_id": "U99", "bot_id": "B-Gamma", "title": "Reunión Scrum", "description": "Daily sync", "init_date": "2026-04-19T09:00:00", "end_date": "2026-04-19T09:15:00", "state": "COMPLETADO", "category": "OTRAS", "result": "SUCCESS"},
    {"activity_id": 22, "type_id": 2, "user_id": "U99", "bot_id": null, "title": "LeetCode", "description": "Two Sum", "init_date": "2026-04-18T15:00:00", "end_date": "2026-04-18T15:30:00", "state": "COMPLETADO", "category": "ESTUDIOS", "result": "SUCCESS"},
    {"activity_id": 23, "type_id": 1, "user_id": "U99", "bot_id": "B-Zeta", "title": "Pádel", "description": "Partido dobles", "init_date": "2026-04-21T18:00:00", "end_date": "2026-04-21T19:30:00", "state": "POSPUESTO", "category": "DEPORTES", "result": null},
    {"activity_id": 24, "type_id": 3, "user_id": "U99", "bot_id": null, "title": "Jardinería", "description": "Podar rosales", "init_date": "2026-04-19T10:00:00", "end_date": "2026-04-19T11:00:00", "state": "EN CURSO", "category": "HOGAR", "result": null},
    {"activity_id": 25, "type_id": 4, "user_id": "U99", "bot_id": "B-Alpha", "title": "Escuchar Vinilos", "description": "Jazz tarde", "init_date": "2026-04-19T17:00:00", "end_date": "2026-04-19T18:00:00", "state": "PENDIENTE", "category": "DESCANSO", "result": null}
  ];

  const ejecutarLogout = async () => {
    await signOut();
    console.log("Sesión cerrada");
  };

  return (
    <ScreenWrapper withScroll={true}>
      <View style={isWeb ? globalStyles.container_web : globalStyles.container_movil}>
        {!isWeb && <UserHeader user={user || { first_name: 'Nombre', last_name: 'Apellido', email: 'invitado@focusbot.com' }} />}
        <View style={{ paddingBottom: isWeb ? 10 : 80 }}>
          {isWeb && <UserHeader user={user || { first_name: 'Nombre', last_name: 'Apellido', email: 'invitado@focusbot.com' }} />}
          <BotCarousel 
            bots={botsData} 
            onAddPress={() => console.log("Añadir nuevo bot")}
            onBotPress={(bot) => console.log("Seleccionado:", bot.name)}
            globalStyles={globalStyles}
          />
          <Text variant="titleLarge" style={{ textAlign: 'center', marginVertical:  20 }}>
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