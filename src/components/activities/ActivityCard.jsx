import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { Card, Text, IconButton, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { updateAppColors } from '../../theme/theme';

const CATEGORIES_CONFIG = {
  DEPORTES: { icon: 'dumbbell', color: '#FFD54F', label: 'Deporte' },
  LECTURA: { icon: 'book-open-variant', color: '#FF8A65', label: 'Lectura' },
  ESTUDIOS: { icon: 'school', color: '#81C784', label: 'Estudio' },
  DESCANSO: { icon: 'weather-night', color: '#9575CD', label: 'Descanso' },
  HOGAR: { icon: 'home', color: '#F06292', label: 'Hogar' },
  OTRAS: { icon: 'link-variant', color: '#BDBDBD', label: 'Otros' },
};

const STATE_COLORS = {
  PENDIENTE: '#FFB74D',   // Naranja
  'EN CURSO': '#4FC3F7',  // Azul
  COMPLETADO: '#81C784',  // Verde
  CANCELADO: '#E57373',   // Rojo
  POSPUESTO: '#BA68C8',   // Morado
};

const ActivityCard = ({ activity, onPress }) => {
  const scheme = useColorScheme();
  const AppColors = updateAppColors(scheme);
  
  // Obtenemos la configuración de la categoría o una por defecto
  const categoryInfo = CATEGORIES_CONFIG[activity.category] || CATEGORIES_CONFIG.OTRAS;
  
  // Formateo simple de horas si existen
  const formatTime = (dateString) => {
    if (!dateString) return '--:--';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <View style={styles.mainContainer}>
        {/* Barra lateral de color según categoría */}
        {/* <View style={[styles.categoryIndicator, { backgroundColor: STATE_COLORS[activity.state] || AppColors.outline , elevation: 4}]} /> */}
        <View style={[styles.categoryIndicator, { backgroundColor: categoryInfo.color || AppColors.outline }]} />

        <View style={styles.contentContainer}>
          {/* Fila Superior: Icono Categoría + Título + Estado */}
          <View style={styles.headerRow}>
            <Surface style={[styles.iconBadge, { backgroundColor: categoryInfo.color + '60' }]}>
              <MaterialCommunityIcons name={categoryInfo.icon} size={25} color={categoryInfo.color} />
            </Surface>
            
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text variant="titleMedium" style={[styles.title, { color: AppColors.text }]} numberOfLines={1}>
                {activity.title}
              </Text>
              <Text variant="labelSmall" style={{ color: AppColors.placeholder }}>
                {categoryInfo.label}
              </Text>
            </View>

            <Surface style={[styles.stateBadge, { borderColor: STATE_COLORS[activity.state] || AppColors.outline }]}>
              <Text variant="labelSmall" style={{ color: STATE_COLORS[activity.state], fontWeight: 'bold' }}>
                {activity.state}
                 
              </Text>
            </Surface>
          </View>

          {/* Descripción */}
          {activity.description && (
            <Text variant="bodyMedium" style={[styles.description, { color: AppColors.textLight }]} numberOfLines={2}>
              {activity.description}
            </Text>
          )}

          {/* Fila Inferior: Horarios y Botón de acción */}
          <View style={styles.footerRow}>
            <View style={styles.timeInfo}>
              <MaterialCommunityIcons name="clock-outline" size={14} color={AppColors.placeholder} />
              <Text variant="bodySmall" style={[styles.timeText, { color: AppColors.placeholder }]}>
                {formatTime(activity.init_date)} - {formatTime(activity.end_date)}
              </Text>
            </View>

            {/* Si hay resultado (SUCCESS/FAILED), mostramos un icono pequeño */}
            {activity.result && (
              <MaterialCommunityIcons 
                name={activity.result === 'SUCCESS' ? 'check-decagram' : 'alert-circle'} 
                size={20} 
                color={activity.result === 'SUCCESS' ? '#4CAF50' : '#F44336'} 
                style={{ marginLeft: 8 }}
              />
            )}
            
            <View style={{ flex: 1 }} />
            
            <IconButton 
              icon="chevron-right" 
              size={20} 
              iconColor={AppColors.primary} 
              onPress={onPress}
            />
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    elevation: 2,
    overflow: 'hidden',
  },
  mainContainer: {
    flexDirection: 'row',
  },
  categoryIndicator: {
    width: 6,
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  stateBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: 'transparent',
    elevation: 0,
  },
  description: {
    marginBottom: 12,
    lineHeight: 18,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 8,
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: 4,
  },
});

export default ActivityCard;