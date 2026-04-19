import React, { useState } from 'react';
import { View, ScrollView, useColorScheme } from 'react-native';
import { Text } from 'react-native-paper';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { getglobalStyles, updateAppColors } from '../../theme/theme';

import CustomAnimatedFAB from '../../components/common/CustomAnimatedFAB';
import ActivitiesList from '../../components/activities/ActivitiesList';

export default function Activities() {
  const scheme = useColorScheme(); 
  let AppColors = updateAppColors(scheme);
  let globalStyles = getglobalStyles(scheme);
  
  const [isExtended, setIsExtended] = useState(true);
  const { isWeb } = useResponsiveLayout();
  const onScroll = ({ nativeEvent }) => {
    const currentScrollOffset = nativeEvent.contentOffset.y;
    setIsExtended(currentScrollOffset <= 0);
  };

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


  return (
    <ScreenWrapper withScroll={false}>
      <View style ={(isWeb ? globalStyles.container_web : globalStyles.container_movil)}>
        <SafeAreaView style = {(isWeb ? {height: '100dvh'}: {height: '100%'})} >
          
          <ScrollView onScroll={onScroll} scrollEventThrottle={16} ontentContainerStyle={{ paddingBottom: isWeb? 10 : 80}}>
            <Text style={globalStyles.tituloPagina}>Actividades</Text>
            
          </ScrollView>

          <CustomAnimatedFAB 
            icon="plus"
            label="Añadir actividad"
            onPress={() => console.log("Click!")}
            isExtended={isExtended}
          />

        </SafeAreaView>
      </View>
    </ScreenWrapper>
  );
}

const getStyles = (AppColors) => StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: AppColors.surface,
    elevation: 2,
  },
});