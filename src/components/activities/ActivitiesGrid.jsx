import React, { useState, useRef } from 'react';
import { View, StyleSheet, useWindowDimensions, Pressable, Animated } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import ActivityCard from './ActivityCard';

const ActivitiesGrid = ({ activities, onActivityPress, AppColors, filterState, opened = true }) => {
  const { width } = useWindowDimensions();
  
  // Estados para controlar la visibilidad y el montaje
  const [isExpanded, setIsExpanded] = useState(opened);
  const [shouldRender, setShouldRender] = useState(opened); // Controla el montaje real
  
  const animatedValue = useRef(new Animated.Value(opened ? 1 : 0)).current;

  const filteredData = Array.isArray(activities) 
    ? activities.filter(a => a !== null && a.state?.toUpperCase() === filterState?.toUpperCase()) 
    : [];

  if (filteredData.length === 0) return null;

  const toggleSection = () => {
    if (isExpanded) {
      // SECUENCIA DE SALIDA:
      // 1. Ejecutar animación
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true, // Ahora sí podemos usarlo para opacidad y escala
      }).start(() => {
        // 2. Al terminar, desmontar los componentes y actualizar estado
        setShouldRender(false);
      });
      setIsExpanded(false);
    } else {
      // SECUENCIA DE ENTRADA:
      // 1. Montar los componentes primero
      setShouldRender(true);
      setIsExpanded(true);
      // 2. Ejecutar animación
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  // Interpolaciones
  const opacity = animatedValue;
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0], // Efecto de deslizamiento sutil
  });
  const rotateChevron = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '0deg'],
  });

  const numColumns = width < 700 ? 1 : width < 1100 ? 2 : 3;

  return (
    <View style={styles.sectionContainer}>
      <Pressable onPress={toggleSection} style={styles.headerPressable}>
        <View style={styles.titleWrapper}>
          <Text variant="labelLarge" style={[styles.stateTitle, { color: AppColors.text }]}>
            {filterState}
          </Text>
          <View style={[styles.countBadge, { backgroundColor: AppColors.surfaceVariant }]}>
            <Text style={{ fontSize: 10, color: AppColors.onSurfaceVariant, fontWeight: 'bold' }}>
              {filteredData.length}
            </Text>
          </View>
        </View>
        
        <Animated.View style={{ transform: [{ rotate: rotateChevron }] }}>
          <IconButton icon="chevron-down" size={20} onPress={toggleSection} />
        </Animated.View>
      </Pressable>

      {/* Usamos shouldRender para permitir que la animación termine antes de desmontar */}
      {shouldRender && (
        <Animated.View style={[styles.gridContainer, { opacity, transform: [{ translateY }] }]}>
          {filteredData.map((item) => (
            <View 
              key={item?.activity_id || item?.id || Math.random()} 
              style={{ width: `${100 / numColumns}%`, paddingBottom: 2 }}
            >
              <ActivityCard 
                activity={item} 
                onPress={() => onActivityPress && onActivityPress(item)} 
              />
            </View>
          ))}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: { marginBottom: 4 },
  headerPressable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
    paddingVertical: 4,
  },
  titleWrapper: { flexDirection: 'row', alignItems: 'center', marginLeft: 16 },
  stateTitle: { fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase', fontSize: 12, opacity: 0.5 },
  countBadge: { marginLeft: 8, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, minWidth: 20, alignItems: 'center' },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', paddingVertical: 4 },
});

export default ActivitiesGrid;