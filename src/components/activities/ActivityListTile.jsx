import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
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
  'EN_CURSO': '#4FC3F7',
  'PENDIENTE': '#FFB74D',
  'COMPLETADO': '#81C784',
  'CANCELADO': '#E57373',
  'POSPUESTO': '#BA68C8',
  'PAUSADO': '#ffed4d',
};

const ActivityListTile = ({ item, onInfoPress, AppColors }) => {
  const rawKey = item?.category ? String(item.category).toUpperCase().trim() : 'OTRAS';
  const category = CATEGORIES[rawKey] || CATEGORIES.OTRAS;

  const rawState = item?.state ? String(item.state).toUpperCase().trim() : 'PENDIENTE';
  const stateColor = STATE_COLORS[rawState] || AppColors.placeholder;

  const isEnCurso = rawState === 'EN_CURSO' || rawState === 'EN CURSO';
  const isFinalizado = rawState === 'COMPLETADO' || rawState === 'CANCELADO';

  const actionIcon = isEnCurso ? "pause" : (!isFinalizado ? "play" : "information");
  const actionColor = isEnCurso ? AppColors.secondary : (!isFinalizado ? AppColors.primary : AppColors.placeholder);
  
  // Fondo dinámico sutil para el botón de acción según su estado
  const actionBg = isFinalizado ? 'transparent' : (isEnCurso ? AppColors.secondary + '15' : AppColors.primary + '15');

  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      onPress={() => onInfoPress && onInfoPress(item)}
      style={[styles.container,{}]}
    >
      {/* AVATAR DE CATEGORÍA */}
      <View style={styles.avatarWrapper}>
        <Avatar.Icon 
          size={40} 
          icon={category.icon} 
          style={{ backgroundColor: category.color }} 
          // color="#121212" 
        />
      </View>

      <View style={styles.textContainer}>
        <Text variant="titleMedium" style={[styles.title, { color: AppColors.text }]} numberOfLines={1}>
          {item?.title ?? 'Sin título'}
        </Text>
        
        <View style={styles.subtitleRow}>
          <View style={[styles.stateBadge, { backgroundColor: stateColor + '18' }]}>
            <View style={[styles.stateDot, { backgroundColor: stateColor }]} />
            <Text variant="labelSmall" style={[styles.stateText, { color: stateColor }]}>
              {item?.state ?? 'PENDIENTE'}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={[styles.actionWrapper, { backgroundColor: actionBg }]}>
        <IconButton
          icon={actionIcon}
          size={22}
          onPress={() => onInfoPress && onInfoPress(item)}
          iconColor={actionColor}
          disabled={isFinalizado}
          style={styles.iconButtonCustom}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 12, 
    paddingHorizontal: 16,
    borderRadius: 16,          
    marginVertical: 6,         
    marginHorizontal: 4,       
    // borderWidth: 1,            
    // elevation: 1,              
    // shadowColor: '#000',       
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  avatarWrapper: {
    // Pequeño efecto contenedor para el avatar
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },

    // shadowOpacity: 0.1,
    // shadowRadius: 3,
  },
  textContainer: { 
    flex: 1, 
    marginLeft: 14, 
    justifyContent: 'center' 
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  subtitleRow: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  stateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginTop: 2,
  },
  stateDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  stateText: {
    fontWeight: '700',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    fontSize: 10,
  },
  actionWrapper: {
    borderRadius: 22,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButtonCustom: {
    margin: 0,
    padding: 0,
  }
});

export default ActivityListTile;