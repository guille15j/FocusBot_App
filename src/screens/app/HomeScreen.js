import React, { useContext } from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Text, Button, Card, Avatar, Surface, FAB, Portal } from 'react-native-paper';
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { getglobalStyles,  updateAppColors} from '../../theme/theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { ScrollView } from "react-native-gesture-handler";
import { BlurView } from 'expo-blur';
import { MaterialCommunityIcons } from '@expo/vector-icons';


import GridBots from '../../components/bots/BotsGrid'
import ListaBots from '../../components/bots/BotList'
import UserHeader from '../../components/common/UserHeader'
import BotCarousel from '../../components/bots/BotCarrusel';
import ActivitiesList from '../../components/activities/ActivitiesList';

import { AuthContext } from '../../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const scheme = useColorScheme(); 
  let AppColors = updateAppColors(scheme);
  let globalStyles = getglobalStyles(scheme);

  
  // Obtenemos los datos del usuario y la función signOut del contexto
  const { user, signOut } = useContext(AuthContext);
  const isFocused = useIsFocused(); // Detecta si la pantalla está activa -> para el FAB
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

  const activitiesData = [
  { id: 1, name: 'Entrenamiento de Fuerza', description: 'Rutina de pesas en el gimnasio - Día de Pierna', category: 'Deporte', duration: '60 min' },
  { id: 2, name: 'Cien años de soledad', description: 'Lectura del capítulo 4 al 6', category: 'Lectura', duration: '45 min' },
  { id: 3, name: 'Curso de React Native', description: 'Aprender sobre animaciones y FlatList avanzada', category: 'Estudio', duration: '120 min' },
  { id: 4, name: 'Siesta reparadora', description: 'Descanso de media tarde para recuperar energía', category: 'Descanso', duration: '20 min' },
  { id: 5, name: 'Limpieza de la cocina', description: 'Organizar armarios y fregar el suelo', category: 'Hogar', duration: '30 min' },
  { id: 6, name: 'Revisión de correos', description: 'Responder mensajes pendientes y organizar bandeja', category: 'Otros', duration: '15 min' },
  { id: 7, name: 'Running matutino', description: 'Carrera continua de 5km por el parque', category: 'Deporte', duration: '25 min' },
  { id: 8, name: 'Meditación guiada', description: 'Sesión de mindfulness para reducir el estrés', category: 'Descanso', duration: '15 min' },
  { id: 9, name: 'Práctica de Inglés', description: 'Repaso de verbos irregulares y escucha activa', category: 'Estudio', duration: '40 min' },
  { id: 10, name: 'Lectura de noticias', description: 'Revisión de prensa internacional y tecnología', category: 'Lectura', duration: '20 min' },
  { id: 11, name: 'Yoga en casa', description: 'Estiramientos y posturas básicas de equilibrio', category: 'Deporte', duration: '30 min' },
  { id: 12, name: 'Hacer la colada', description: 'Separar ropa, poner lavadora y tender', category: 'Hogar', duration: '15 min' },
  { id: 13, name: 'Planificación semanal', description: 'Organizar tareas y objetivos de la próxima semana', category: 'Otros', duration: '30 min' },
  { id: 14, name: 'Estudio de Algoritmos', description: 'Resolución de problemas de lógica y optimización', category: 'Estudio', duration: '90 min' },
  { id: 15, name: 'Podcast de Historia', description: 'Escuchar episodio sobre la antigua Roma', category: 'Lectura', duration: '50 min' },
  { id: 16, name: 'Paseo nocturno', description: 'Caminata ligera antes de dormir', category: 'Descanso', duration: '20 min' },
  { id: 17, name: 'Preparación de comidas', description: 'Batch cooking para los próximos tres días', category: 'Hogar', duration: '120 min' },
  { id: 18, name: 'Sesión de Estiramientos', description: 'Mejorar flexibilidad después del trabajo', category: 'Deporte', duration: '15 min' },
  { id: 19, name: 'Escritura de Diario', description: 'Reflexión sobre los logros del día', category: 'Otros', duration: '10 min' },
  { id: 20, name: 'Reunión de equipo', description: 'Sincronización de proyectos y próximos pasos', category: 'Otros', duration: '45 min' }
];

  const styles = getStyles(AppColors, isWeb);

  return (
    <ScreenWrapper withScroll={false}>
      <View style ={(isWeb ? globalStyles.container_web : globalStyles.container_movil)}>
        <SafeAreaView style = {(isWeb ? {height: '100dvh'}: {height: '100%'})} >
          {!isWeb && <UserHeader user = {{'first_name':'nombre', 'last_name':'apellido', 'user_id':'123123'}}/>}
          
          <ScrollView contentContainerStyle={{ paddingBottom: isWeb? 10 : 80}}>
            {isWeb && <UserHeader user = {{'first_name':'nombre', 'last_name':'apellido', 'user_id':'123123'}}/>}
            <BotCarousel 
              bots={botsData} 
              onAddPress={() => console.log("Añadir nuevo bot")}
              onBotPress={(bot) => console.log("Seleccionado:", bot.name)}
              globalStyles={globalStyles}
            />

            <View style={globalStyles.section}>
              <Text variant="titleLarge" style={styles.sectionTitle}>
                Resumen del día
              </Text>
              
              <View style={styles.statsGrid}>
                {/* Tarjeta 1: Tiempo de Enfoque */}
                <Card style={styles.statCard}>
                  <Card.Content style={styles.cardContent}>
                    <MaterialCommunityIcons name="timer-outline" size={24} color={AppColors.primary} />
                    <Text variant="headlineSmall" style={styles.statValue}>5.4h</Text>
                    <Text variant="labelSmall" style={styles.statLabel}>Enfoque</Text>
                  </Card.Content>
                </Card>

                {/* Tarjeta 2: Tareas */}
                <Card style={styles.statCard}>
                  <Card.Content style={styles.cardContent}>
                    <MaterialCommunityIcons name="check-all" size={24} color={AppColors.primary} />
                    <Text variant="headlineSmall" style={styles.statValue}>12</Text>
                    <Text variant="labelSmall" style={styles.statLabel}>Tareas</Text>
                  </Card.Content>
                </Card>

                {/* Tarjeta 3: Bots Activos */}
                <Card style={styles.statCard}>
                  <Card.Content style={styles.cardContent}>
                    <MaterialCommunityIcons name="robot" size={24} color={AppColors.primary} />
                    <Text variant="headlineSmall" style={styles.statValue}>3</Text>
                    <Text variant="labelSmall" style={styles.statLabel}>Bots ON</Text>
                  </Card.Content>
                </Card>

                {/* Tarjeta 4: Productividad */}
                <Card style={styles.statCard}>
                  <Card.Content style={styles.cardContent}>
                    <MaterialCommunityIcons name="trending-up" size={24} color={AppColors.primary} />
                    <Text variant="headlineSmall" style={styles.statValue}>85%</Text>
                    <Text variant="labelSmall" style={styles.statLabel}>Eficiencia</Text>
                  </Card.Content>
                </Card>
              </View>
              
              <Button icon="plus" mode="outlined" style ={globalStyles.buttonOutline} onPress={() => console.log('Ir a historico')}>
                Saber más
              </Button>

            </View>

            <View style ={globalStyles.section_huge}>
              <Text variant="titleLarge" style ={{textAlign: 'center'}}>
                Actividades
              </Text>

              <ActivitiesList 
                activities={activitiesData} 
                onActivityPress={(activity) => console.log("Detalles de:", activity.name)}
                globalStyles={globalStyles} 
              />
            </View>
          </ScrollView>

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
              // backdropColor='transparent'

            />
          </Portal>
        </SafeAreaView>
      </View>
    </ScreenWrapper>
  );
}


const getStyles = (AppColors, isWeb) => StyleSheet.create({

  content: {
    padding: 20,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: 15,
    fontWeight: 'bold',
    color: AppColors.text,
  },
  statsGrid: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
  },
  statCard: {
    // En web 23% para que quepan 4 con espacio. En móvil 48% para que quepan 2.
    width: isWeb ? '23%' : '48%', 
    marginBottom: 15,
    backgroundColor: AppColors.surface,
    borderRadius: 16,
    // Sombra suave para que se vea moderno
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
  },
  statValue: {
    fontWeight: 'bold',
    marginTop: 5,
    color: AppColors.onSurface,
  },
  statLabel: {
    color: AppColors.placeholder,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 2,
  },
});