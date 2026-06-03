import React, { useState, useRef, useMemo, useEffect } from 'react';
import { View, StyleSheet, useWindowDimensions, Pressable, Animated } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import ActivityCard from './ActivityCard';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

const ActivitiesGrid = ({ activities, onActivityPress, AppColors, filterState, opened = true }) => {
  const { width } = useWindowDimensions();
  const { isWeb } = useResponsiveLayout();
  const [isExpanded, setIsExpanded] = useState(opened);
  const [shouldRender, setShouldRender] = useState(opened);
  
  const animatedValue = useRef(new Animated.Value(opened ? 1 : 0)).current;

  // 1. Filtrado comprueba tanto status como state
  const filteredData = useMemo(() => {
    return Array.isArray(activities) 
      ? activities.filter(a => a !== null && (a.status || a.state)?.toUpperCase() === filterState?.toUpperCase()) 
      : [];
  }, [activities, filterState]);

  // 2. Hook de Sincronización (SIEMPRE se debe ejecutar antes de cualquier early return)
  useEffect(() => {
    if (opened) {
      setShouldRender(true);
      setIsExpanded(true);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: !isWeb,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: !isWeb,
      }).start(() => {
        setShouldRender(false);
      });
      setIsExpanded(false);
    }
  }, [opened]);

  const toggleSection = () => {
    if (isExpanded) {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 250,
        useNativeDriver: !isWeb,
      }).start(() => {
        setShouldRender(false);
      });
      setIsExpanded(false);
    } else {
      setShouldRender(true);
      setIsExpanded(true);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: !isWeb,
      }).start();
    }
  };

  const opacity = animatedValue;
  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });
  const rotateChevron = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['-90deg', '0deg'],
  });

  const numColumns = width < 600 ? 1 : width < 1100 ? 2 : 3;

  // CONDICIONAL MOVIDA AQUÍ: Si no hay datos, evitamos pintar el JSX de manera segura
  if (filteredData.length === 0) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <Pressable onPress={toggleSection} style={styles.headerPressable}>
        <View style={styles.titleWrapper}>
          <Text variant="labelLarge" style={[styles.stateTitle, { color: AppColors.text }]}>
            {filterState}
          </Text>
          <View style={[styles.countBadge, { backgroundColor: AppColors.surfaceVariant || AppColors.surface }]}>
            <Text style={{ fontSize: 10, color: AppColors.textLight, fontWeight: 'bold' }}>
              {filteredData.length}
            </Text>
          </View>
        </View>
        
        <View style={styles.iconWrapper}>
          <Animated.View style={{ transform: [{ rotate: rotateChevron }] }}>
            <IconButton icon="chevron-down" size={20} onPress={toggleSection} style={styles.noMargin} />
          </Animated.View>
        </View>
      </Pressable>

      {shouldRender && (
        <Animated.View style={[styles.gridContainer, { opacity, transform: [{ translateY }] }]}>
          {filteredData.map((item, index) => (
            <View 
              key={item?.activity_id || item?.id || `grid-act-${index}`} 
              style={{ width: `${100 / numColumns}%`, padding: 4 }}
            >
              <ActivityCard 
                activity={item}
                item={item} 
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
  sectionContainer: { marginBottom: 4, },
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
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMargin: {
    margin: 0,
  }
});

export default ActivitiesGrid;