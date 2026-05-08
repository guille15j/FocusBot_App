import React, { useState, useMemo } from 'react';
import { View, ScrollView, useColorScheme, StyleSheet, Alert } from 'react-native';
import { Text, Searchbar, Chip, SegmentedButtons } from 'react-native-paper';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { getColors, getglobalStyles } from '../../theme/theme';
import CustomAnimatedFAB from '../../components/common/CustomAnimatedFAB';
import ActivitiesGrid from '../../components/activities/ActivitiesGrid';
import ActivityDetailModal from '../../components/activities/ActivityDetailModal';

//CUSTOM HOOKS
import { useActivities } from '../../hooks/useActivities';

export default function Activities({ navigation }) {
  const scheme = useColorScheme();
  const { isWeb, platform } = useResponsiveLayout();
  
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);
  
  const [isExtended, setIsExtended] = useState(true);
  const onScroll = ({ nativeEvent }) => setIsExtended(nativeEvent.contentOffset.y <= 0);

  // Llamamos al hook. Usamos polling (true) para que si un bot 
  // cambia el estado de una actividad, lo veamos sin refrescar.
  const { 
    activities, 
    loading, 
    refresh, 
    updateActivityState, 
    deleteActivity 
  } = useActivities(true);

  // El buscador ahora apunta a 'activities' del hook
  const actividadesFiltradas = useMemo(() => {
    if (!searchQuery) return activities;
    return activities.filter(act => 
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, activities]);

  const [searchQuery, setSearchQuery] = useState('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const handleFabPress = () => navigation.navigate('CreateActivity');

  const handleActivityPress = (activity) => {
    setSelectedActivity(activity);
    setDetailModalVisible(true);
  };

  const handleActionPress = async (activity) => {
    // Ejemplo: Si está PENDIENTE, la pasamos a EN CURSO
    const nuevoEstado = activity.state === 'PENDIENTE' ? 'EN CURSO' : 'COMPLETADO';
    try {
      await updateActivityState(activity.activity_id, nuevoEstado);
      setDetailModalVisible(false);
    } catch (e) {
      Alert.alert("Error", "No se pudo actualizar el estado.");
    }
  };

  const handleDeletePress = (activity) => {
    Alert.alert(
      "Eliminar",
      "¿Seguro que quieres borrar esta actividad?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Borrar", 
          style: "destructive", 
          onPress: async () => {
            await deleteActivity(activity.activity_id);
            setDetailModalVisible(false);
          } 
        }
      ]
    );
  };

  const handleEditPress = (activity) => {
    setDetailModalVisible(false);
    navigation.navigate('CreateActivity', { activity });
  };

  return (
    <ScreenWrapper withScroll={false}>
      <View style={isWeb ? globalStyles.container_web : globalStyles.container_movil}>
        <Text style={[globalStyles.tituloPagina]}>Actividades</Text>
        <Searchbar placeholder="Buscar actividad..." onChangeText={setSearchQuery} value={searchQuery} style={{ marginHorizontal: 15, marginVertical: 15 }} />
        
        <ScrollView onScroll={onScroll} scrollEventThrottle={16} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: isWeb ? 10 : (platform === 'ios' ? 40 : 65) }}>
          {activities.length === 0 && !loading ? (
            <View style={{ padding: 50, alignItems: 'center' }}>
              <Text variant="bodyLarge" style={{ color: colors.outline, textAlign: 'center' }}>
                No hay actividades.{"\n"}¡Crea la primera pulsando el botón +!
              </Text>
            </View>
          ) : ( <>
            <ActivitiesGrid activities={actividadesFiltradas} filterState="EN CURSO" onActivityPress={handleActivityPress} AppColors={colors} />
            <ActivitiesGrid activities={actividadesFiltradas} filterState="PENDIENTE" onActivityPress={handleActivityPress} AppColors={colors} />
            <ActivitiesGrid activities={actividadesFiltradas} filterState="POSPUESTO" onActivityPress={handleActivityPress} AppColors={colors} />
            <ActivitiesGrid activities={actividadesFiltradas} filterState="COMPLETADO" onActivityPress={handleActivityPress} AppColors={colors} opened={false} />
            <ActivitiesGrid activities={actividadesFiltradas} filterState="CANCELADO" onActivityPress={handleActivityPress} AppColors={colors} opened={false} />
          </>)}
        </ScrollView>

        <CustomAnimatedFAB icon="plus" label="Añadir actividad" onPress={handleFabPress} isExtended={isExtended} />
        <ActivityDetailModal visible={detailModalVisible} onDismiss={() => setDetailModalVisible(false)} activity={selectedActivity} onActionPress={handleActionPress} onEditPress={handleEditPress} onDeletePress={handleDeletePress} />
      </View>
    </ScreenWrapper>
  );
}