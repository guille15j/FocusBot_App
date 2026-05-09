import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton, Avatar } from 'react-native-paper';

const CATEGORIES = {
  DEPORTES: { icon: 'dumbbell', color: '#FFD54F' },
  DEPORTE: { icon: 'dumbbell', color: '#FFD54F' },
  LECTURA: { icon: 'book-open-variant', color: '#FF8A65' },
  ESTUDIOS: { icon: 'school', color: '#81C784' },
  ESTUDIO: { icon: 'school', color: '#81C784' },
  DESCANSO: { icon: 'weather-night', color: '#9575CD' },
  HOGAR: { icon: 'home', color: '#F06292' },
  OTRAS: { icon: 'link-variant', color: '#BDBDBD' },
  OTRA: { icon: 'link-variant', color: '#BDBDBD' },
};

const STATE_COLORS = {
  'EN CURSO': '#4FC3F7',
  'PENDIENTE': '#FFB74D',
  'COMPLETADO': '#81C784',
  'CANCELADO': '#E57373',
  'POSPUESTO': '#BA68C8',
};

const ActivityListTile = ({ item, onInfoPress, AppColors }) => {
  const rawKey = item?.category ? String(item.category).toUpperCase().trim() : 'OTRAS';
  const category = CATEGORIES[rawKey] || CATEGORIES.OTRAS;

  const rawState = item?.state ? String(item.state).toUpperCase().trim() : 'PENDIENTE';
  const stateColor = STATE_COLORS[rawState] || AppColors.placeholder;

  return (
    <View style={styles.container}>
      <Avatar.Icon 
        size={44} 
        icon={category.icon} 
        style={{ backgroundColor: category.color }} 
        color="white"
      />
      <View style={styles.textContainer}>
        <Text variant="titleMedium" style={{ color: AppColors.text }} numberOfLines={1}>
          {item?.title ?? 'Sin título'}
        </Text>
        <View style={styles.subtitleRow}>
          <Text variant="labelSmall" style={{ color: stateColor, fontWeight: 'bold' }}>
            {item?.state ?? 'PENDIENTE'} •{' '}
          </Text>
          
        </View>
      </View>
      
        
        <IconButton
          icon= {rawState === 'EN CURSO' ? "pause": ( (rawState != 'COMPLETADO' && rawState != 'CANCELADO') ? "play" : "information")}
          size={24}
          onPress={() => onInfoPress && onInfoPress(item)}
          iconColor={rawState === 'EN CURSO' ? AppColors.secondary: ( (rawState != 'COMPLETADO' && rawState != 'CANCELADO') ? AppColors.primary : AppColors.placeholder)}
          disabled = {rawState === 'COMPLETADO' || rawState === 'CANCELADO'}
        />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 10, 
    paddingHorizontal: 16 
  },
  textContainer: { 
    flex: 1, 
    marginLeft: 16, 
    justifyContent: 'center' 
  },
  subtitleRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  }
});

export default ActivityListTile;