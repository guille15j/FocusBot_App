import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, Avatar } from 'react-native-paper';


const CATEGORIES = {
  Deporte: { icon: 'dumbbell', color: '#FFD54F' },
  Lectura: { icon: 'book-open-variant', color: '#FF8A65' },
  Estudio: { icon: 'school', color: '#81C784' },
  Descanso: { icon: 'weather-night', color: '#9575CD' },
  Hogar: { icon: 'home', color: '#F06292' },
  Otros: { icon: 'link-variant', color: '#BDBDBD' },
};

const ActivityListTile = ({ item, onInfoPress, AppColors }) => {
  const category = CATEGORIES[item.category] || CATEGORIES.Otros;

  return (
    <View style={styles.container}>
      {/* Icono de Categoría */}
      <Avatar.Icon 
        size={48} 
        icon={category.icon} 
        style={{ backgroundColor: category.color }} 
        color="white"
      />

      <View style={styles.textContainer}>
        <Text variant="titleMedium" style={{ color: AppColors.text }}>
          {item.name}
        </Text>
        <Text variant="bodySmall" style={{ color: AppColors.placeholder }} numberOfLines={1}>
          {item.description}
        </Text>
      </View>

      {/* Acción Derecha */}
      <IconButton
        icon="chevron-right"
        size={24}
        onPress={() => onInfoPress(item)}
        iconColor={AppColors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
});

export default ActivityListTile;