import React, { useState, useMemo } from 'react';
import { View, ScrollView, useColorScheme, StyleSheet, Alert, RefreshControl } from 'react-native';
import { Text, Searchbar, Icon } from 'react-native-paper';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { getColors, getglobalStyles } from '../../theme/theme';
import CustomAnimatedFAB from '../../components/common/CustomAnimatedFAB';
import ActivitiesGrid from '../../components/activities/ActivitiesGrid';
import ActivityDetailModal from '../../components/activities/ActivityDetailModal';

// CUSTOM HOOKS
import { useActivities } from '../../hooks/useActivities';

export default function Activities({ navigation }) {
  const scheme = useColorScheme();
  const { isWeb, platform } = useResponsiveLayout();
  
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isExtended, setIsExtended] = useState(true);

  const onScroll = ({ nativeEvent }) => {
    setIsExtended(nativeEvent.contentOffset.y <= 0);
  };

  const { 
    activities, 
    loading, 
    refresh, 
    updateActivityState, 
    deleteActivity 
  } = useActivities(true);

  // Filtro adaptativo que cubre tanto campos de título de mockups antiguos como esquemas name reales
  const actividadesFiltradas = useMemo(() => {
    const safeActivities = Array.isArray(activities) ? activities : [];
    const query = (searchQuery || '').trim().toLowerCase();
    
    if (!query) return safeActivities;
    
    return safeActivities.filter(act => 
      act?.name?.toLowerCase().includes(query) ||
      act?.title?.toLowerCase().includes(query) ||
      act?.description?.toLowerCase().includes(query)
    );
  }, [searchQuery, activities]);

  const handleFabPress = () => navigation.navigate('CreateActivity');

  const handleActivityPress = (activity) => {
    setSelectedActivity(activity);
    setDetailModalVisible(true);
  };

  const handleActionPress = async (action, activity) => {
    let nuevoEstado;
    switch (action) {
      case 'start':
        nuevoEstado = 'EN_CURSO';
        break;
      case 'pause':
        nuevoEstado = 'PAUSADO';
        break;
      case 'resume':
        nuevoEstado = 'EN_CURSO';
        break;
      default:
        return;
    }
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
        <Text style={[globalStyles.tituloPagina, styles.pageTitle]}>Actividades</Text>
        
        <Searchbar 
          placeholder="Buscar actividad..." 
          onChangeText={setSearchQuery} 
          value={searchQuery} 
          style={styles.searchBar} 
          inputStyle={styles.searchInput}
          placeholderTextColor={colors.placeholder}
          iconColor={colors.placeholder}
          theme={{
            colors: {
              elevation: {
                level3: colors.surfaceVariant || 'rgba(0,0,0,0.04)'
              }
            }
          }}
        />
        
        <ScrollView 
          onScroll={onScroll} 
          scrollEventThrottle={16} 
          style={styles.scrollContainer} 
          contentContainerStyle={{ paddingBottom: isWeb ? 20 : (platform === 'ios' ? 40 : 65) }}
          refreshControl={
            <RefreshControl 
              refreshing={loading} 
              onRefresh={refresh} 
              colors={[colors.primary]} 
              tintColor={colors.primary}
            />
          }
        >
          {activities.length === 0 && !loading ? (
            <View style={styles.emptyContainer}>
              <Icon source="robot-happy" size={80} color={colors.placeholder} />
              <Text variant="bodyLarge" style={[styles.emptyText, { color: colors.placeholder }]}>
                No hay actividades cargadas en la lista. Creadas pulsando el boton inferior.
              </Text>
            </View>
          ) : ( 
            <>
              <ActivitiesGrid activities={actividadesFiltradas} filterState="EN_CURSO" onActivityPress={handleActivityPress} AppColors={colors} />
              <ActivitiesGrid activities={actividadesFiltradas} filterState="PAUSADO" onActivityPress={handleActivityPress} AppColors={colors} />
              <ActivitiesGrid activities={actividadesFiltradas} filterState="PENDIENTE" onActivityPress={handleActivityPress} AppColors={colors} />
              <ActivitiesGrid activities={actividadesFiltradas} filterState="POSPUESTO" onActivityPress={handleActivityPress} AppColors={colors} opened={false}/>
              <ActivitiesGrid activities={actividadesFiltradas} filterState="COMPLETADO" onActivityPress={handleActivityPress} AppColors={colors} opened={false} />
              <ActivitiesGrid activities={actividadesFiltradas} filterState="CANCELADO" onActivityPress={handleActivityPress} AppColors={colors} opened={false} />
            </>
          )}
        </ScrollView>

        <CustomAnimatedFAB icon="plus" label="Añadir actividad" onPress={handleFabPress} isExtended={isExtended} />
        <ActivityDetailModal visible={detailModalVisible} onDismiss={() => setDetailModalVisible(false)} activity={selectedActivity} onActionPress={handleActionPress} onEditPress={handleEditPress} onDeletePress={handleDeletePress} />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  searchBar: {
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 16,
    height: 48,
    justifyContent: 'center',
  },
  searchInput: {
    fontSize: 15,
    minHeight: 0,
  },
  scrollContainer: {
    flex: 1,
  },
  emptyContainer: {
    padding: 60, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 22,
    maxWidth: 300,
  }
});