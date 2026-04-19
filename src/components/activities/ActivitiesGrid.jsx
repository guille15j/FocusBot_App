import React from 'react';
import { View, StyleSheet, useWindowDimensions } from 'react-native';
import { Text } from 'react-native-paper';
import ActivityListTile from './ActivityListTile';
import ActivityCard from './ActivityCard';

const ActivitiesGrid = ({ activities, onActivityPress, AppColors, filterState }) => {
  const { width } = useWindowDimensions();

  // Filtrado por estado: comparamos en mayúsculas para evitar errores de case-sensitive
  const filteredData = Array.isArray(activities) 
    ? activities.filter(a => a !== null && a.state?.toUpperCase() === filterState?.toUpperCase()) 
    : [];

  // Si no hay actividades con ese estado, no renderizamos nada (opcional)
  if (filteredData.length === 0) return null;

  const getColumnCount = () => {
    if (width < 600) return 1;
    if (width < 900) return 2;
    if (width < 1400) return 3;
    return 4;
  };

  const numColumns = getColumnCount();

  return (
    <View style={styles.sectionContainer}>
      {/* Título de la sección basado en el estado */}
      <Text variant="titleLarge" style={[styles.stateTitle, { color: AppColors.text }]}>
        {filterState}
      </Text>

      <View style={styles.gridContainer}>
        {filteredData.map((item) => (
          <View 
            key={item?.activity_id || item?.id || Math.random()} 
            style={[styles.gridItem, { width: `${100 / numColumns}%` }]}
          >
            <View >
              {/* <ActivityListTile 
                item={item} 
                onInfoPress={onActivityPress} 
                AppColors={AppColors} 
              /> */}
              <ActivityCard 
                activity={item} 
                onPress={() => onActivityPress && onActivityPress(item)} 
                />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 24,
  },
  stateTitle: {
    marginLeft: 16,
    marginBottom: 8,
    fontWeight: 'bold',
    textTransform: 'capitalize'
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
  },
  gridItem: {
    padding: 8,
  },
  innerCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(150, 150, 150, 0.1)',
    overflow: 'hidden',
    elevation: 1, // Pequeña sombra para destacar sobre el fondo
  }
});

export default ActivitiesGrid;