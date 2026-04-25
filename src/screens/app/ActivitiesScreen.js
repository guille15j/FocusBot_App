import React, { useState, useMemo } from 'react';
import { View, ScrollView, useColorScheme, StyleSheet, Alert } from 'react-native';
import { Text, Searchbar, Chip, SegmentedButtons } from 'react-native-paper';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { getColors, getglobalStyles } from '../../theme/theme';
import CustomAnimatedFAB from '../../components/common/CustomAnimatedFAB';
import ActivitiesGrid from '../../components/activities/ActivitiesGrid';
import ActivityDetailModal from '../../components/activities/ActivityDetailModal';

export default function Activities({ navigation }) {
  const scheme = useColorScheme();
  const { isWeb, platform } = useResponsiveLayout();
  
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);
  
  const [isExtended, setIsExtended] = useState(true);
  const onScroll = ({ nativeEvent }) => setIsExtended(nativeEvent.contentOffset.y <= 0);

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
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const actividadesFiltradas = useMemo(() => {
    if (!searchQuery.trim()) return activitiesData;
    const query = searchQuery.toLowerCase().trim();
    return activitiesData.filter(a =>
      a.title.toLowerCase().includes(query) ||
      (a.description && a.description.toLowerCase().includes(query)) ||
      a.category.toLowerCase().includes(query) ||
      a.state.toLowerCase().includes(query) ||
      (a.bot_id && a.bot_id.toLowerCase().includes(query))
    );
  }, [searchQuery]);

  const handleFabPress = () => navigation.navigate('CreateActivity');

  const handleActivityPress = (activity) => {
    setSelectedActivity(activity);
    setDetailModalVisible(true);
  };

  const handleActionPress = (action, activity) => {
    console.log('Accion:', action, 'Actividad:', activity);
    setDetailModalVisible(false);
  };

  const handleEditPress = (activity) => {
    setDetailModalVisible(false);
    navigation.navigate('CreateActivity', { activity });
  };

  const handleDeletePress = (activity) => {
    Alert.alert(
      'Eliminar Actividad',
      `Estas seguro de que deseas eliminar "${activity.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => { setDetailModalVisible(false); console.log('Actividad eliminada:', activity); } },
      ]
    );
  };

  return (
    <ScreenWrapper withScroll={false}>
      <View style={isWeb ? globalStyles.container_web : globalStyles.container_movil}>
        <Text style={[globalStyles.tituloPagina]}>Actividades</Text>
        <Searchbar placeholder="Buscar actividad..." onChangeText={setSearchQuery} value={searchQuery} style={{ marginHorizontal: 15, marginVertical: 15 }} />
        
        <ScrollView onScroll={onScroll} scrollEventThrottle={16} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: isWeb ? 10 : (platform === 'ios' ? 40 : 65) }}>
          <ActivitiesGrid activities={actividadesFiltradas} filterState="EN CURSO" onActivityPress={handleActivityPress} AppColors={colors} />
          <ActivitiesGrid activities={actividadesFiltradas} filterState="PENDIENTE" onActivityPress={handleActivityPress} AppColors={colors} />
          <ActivitiesGrid activities={actividadesFiltradas} filterState="POSPUESTO" onActivityPress={handleActivityPress} AppColors={colors} />
          <ActivitiesGrid activities={actividadesFiltradas} filterState="COMPLETADO" onActivityPress={handleActivityPress} AppColors={colors} opened={false} />
          <ActivitiesGrid activities={actividadesFiltradas} filterState="CANCELADO" onActivityPress={handleActivityPress} AppColors={colors} opened={false} />
        </ScrollView>

        <CustomAnimatedFAB icon="plus" label="Añadir actividad" onPress={handleFabPress} isExtended={isExtended} />
        <ActivityDetailModal visible={detailModalVisible} onDismiss={() => setDetailModalVisible(false)} activity={selectedActivity} onActionPress={handleActionPress} onEditPress={handleEditPress} onDeletePress={handleDeletePress} />
      </View>
    </ScreenWrapper>
  );
}