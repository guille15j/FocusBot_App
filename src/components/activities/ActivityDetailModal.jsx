import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Portal, Modal, Text, IconButton, Button, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'react-native';
import { getColors, getglobalStyles } from '../../theme/theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import BotTile from '../bots/BotListTile';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const CATEGORIES_CONFIG = {
  DEPORTES: { icon: 'dumbbell', color: '#FFD54F', label: 'Deporte' },
  LECTURA: { icon: 'book-open-variant', color: '#FF8A65', label: 'Lectura' },
  ESTUDIOS: { icon: 'school', color: '#81C784', label: 'Estudio' },
  DESCANSO: { icon: 'weather-night', color: '#9575CD', label: 'Descanso' },
  HOGAR: { icon: 'home', color: '#F06292', label: 'Hogar' },
  OTRAS: { icon: 'link-variant', color: '#BDBDBD', label: 'Otros' },
};

const ACTIVITY_TYPE_CONFIG = {
  POMODORO: { label: 'Pomodoro', icon: 'timer', color: '#EF5350' },
  HITO: { label: 'Hito', icon: 'flag', color: '#FFA726' },
  TEMPORIZADOR: { label: 'Temporizador', icon: 'timer-sand', color: '#42A5F5' },
};

const AUDIO_CONFIG = {
  ninguno: { label: 'Sin Sonido', icon: 'volume-off', color: '#BDBDBD' },
  fogata: { label: 'Fogata', icon: 'fire', color: '#FF7043' },
  bosque: { label: 'Bosque', icon: 'tree', color: '#66BB6A' },
  rio: { label: 'Río', icon: 'water', color: '#29B6F6' },
  lluvia: { label: 'Lluvia', icon: 'weather-pouring', color: '#78909C' },
  'ruido blanco': { label: 'Ruido Blanco', icon: 'waves', color: '#AB47BC' },
};

const ActivityDetailModal = ({ visible, onDismiss, activity, onActionPress, onEditPress, onDeletePress }) => {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);

  const [isLoading, setIsLoading] = useState(false);

  const categoryInfo = CATEGORIES_CONFIG[activity?.category] || CATEGORIES_CONFIG.OTRAS;
  const typeInfo = ACTIVITY_TYPE_CONFIG[activity?.type?.name_type] || { label: activity?.type?.name_type || 'Desconocido', icon: 'help-circle', color: '#757575' };
  const audioInfo = AUDIO_CONFIG[activity?.extra_data?.audio] || AUDIO_CONFIG.ninguno;

  const getStateConfig = (state) => {
    switch (state) {
      case 'COMPLETADO': return { color: '#81C784', icon: 'check-circle', label: 'Completado' };
      case 'EN_CURSO': return { color: '#4FC3F7', icon: 'play-circle', label: 'En Curso' };
      case 'PENDIENTE': return { color: '#FFB74D', icon: 'clock-outline', label: 'Pendiente' };
      case 'CANCELADO': return { color: '#E57373', icon: 'close-circle', label: 'Cancelado' };
      case 'POSPUESTO': return { color: '#BA68C8', icon: 'pause-circle', label: 'Pospuesto' };
      case 'PAUSADO': return { color: '#ffed4d', icon: 'stop', label: 'Pausado' };
      default: return { color: '#757575', icon: 'help-circle', label: state };
    }
  };

  const shouldShowActionButton = activity && !['COMPLETADO', 'CANCELADO'].includes(activity.state);

  const getActionButtonConfig = () => {
    if (!activity) return null;
    if (['PENDIENTE', 'POSPUESTO'].includes(activity.state)) return { icon: 'play', label: 'Iniciar', action: 'start' };
    return null;
  };

  const stateConfig = activity ? getStateConfig(activity.state) : null;
  const actionConfig = getActionButtonConfig();

  const handleStartPress = async () => {
    if (!onActionPress || isLoading) return;
    try {
      setIsLoading(true);
      await onActionPress(actionConfig.action, activity);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }) + 
           '  ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateDuration = () => {
    if (!activity?.init_date || !activity?.end_date) return null;
    const start = new Date(activity.init_date);
    const end = new Date(activity.end_date);
    const diffMs = end - start;
    if (diffMs < 0 || isNaN(diffMs)) return null;
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}min`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}min`;
  };

  const duration = calculateDuration();
  const formattedInitDate = formatDate(activity?.init_date);
  const formattedEndDate = formatDate(activity?.end_date);

  if (!activity) return null;

  return (
    <Portal>
      <Modal 
        visible={visible} 
        onDismiss={onDismiss} 
        style={{ 
          backgroundColor: 'rgba(0,0,0,0.7)',
          marginTop: -insets.top,
          marginBottom: -insets.bottom,
        }}
        contentContainerStyle={[
          styles.modalContainer, 
          { 
            backgroundColor: colors.surface,
            marginHorizontal: isWeb ? '35%' : 16,
            maxHeight: SCREEN_HEIGHT - (isWeb ? 100 : 40),
          }
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Surface style={[styles.headerIconSurface, { backgroundColor: stateConfig.color + '20' }]}>
              <MaterialCommunityIcons name={stateConfig.icon} size={22} color={stateConfig.color} />
            </Surface>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{activity.title}</Text>
            </View>
          </View>
          <IconButton 
            icon="close-circle" 
            size={26} 
            onPress={onDismiss}
            iconColor={colors.textLight}
            disabled={isLoading}
          />
        </View>

        <ScrollView 
          showsVerticalScrollIndicator={false} 
          bounces={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.badgesRow}>
            <Surface style={[styles.badge, { backgroundColor: stateConfig.color + '20', borderColor: stateConfig.color }]}>
              <MaterialCommunityIcons name={stateConfig.icon} size={12} color={stateConfig.color} />
              <Text style={[styles.badgeText, { color: stateConfig.color }]}>{stateConfig.label}</Text>
            </Surface>
            
            <Surface style={[styles.badge, { backgroundColor: categoryInfo.color + '20', borderColor: categoryInfo.color }]}>
              <MaterialCommunityIcons name={categoryInfo.icon} size={12} color={categoryInfo.color} />
              <Text style={[styles.badgeText, { color: categoryInfo.color }]}>{categoryInfo.label}</Text>
            </Surface>

            <Surface style={[styles.badge, { backgroundColor: typeInfo.color + '20', borderColor: typeInfo.color }]}>
              <MaterialCommunityIcons name={typeInfo.icon} size={12} color={typeInfo.color} />
              <Text style={[styles.badgeText, { color: typeInfo.color }]}>{typeInfo.label}</Text>
            </Surface>

            <Surface style={[styles.badge, { backgroundColor: audioInfo.color + '20', borderColor: audioInfo.color }]}>
              <MaterialCommunityIcons name={audioInfo.icon} size={12} color={audioInfo.color} />
              <Text style={[styles.badgeText, { color: audioInfo.color }]}>{audioInfo.label}</Text>
            </Surface>

            {duration && (
              <Surface style={[styles.badge, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}>
                <MaterialCommunityIcons name="timer-outline" size={12} color={colors.primary} />
                <Text style={[styles.badgeText, { color: colors.primary }]}>{duration}</Text>
              </Surface>
            )}
          </View>

          <Surface style={[styles.sectionCard, { backgroundColor: colors.background }]}>
            <View style={styles.sectionCardHeader}>
              <MaterialCommunityIcons name={typeInfo.icon} size={18} color={typeInfo.color} />
              <Text style={[styles.sectionTitle, { color: colors.textLight }]}>Configuración de {typeInfo.label}</Text>
            </View>

            {activity.type?.name_type === 'POMODORO' && (
              <View style={styles.typeSpecificContent}>
                <View style={styles.configItemRow}>
                  <MaterialCommunityIcons name="clock-outline" size={16} color={colors.textLight} />
                  <Text style={[styles.configDetailText, { color: colors.text }]}>
                    <Text style={{ fontWeight: 'bold' }}>Enfoque:</Text> {activity.type?.work_duration} min
                  </Text>
                </View>
                <View style={styles.configItemRow}>
                  <MaterialCommunityIcons name="coffee-outline" size={16} color={colors.textLight} />
                  <Text style={[styles.configDetailText, { color: colors.text }]}>
                    <Text style={{ fontWeight: 'bold' }}>Descanso Corto:</Text> {activity.type?.short_break} min
                  </Text>
                </View>
                <View style={styles.configItemRow}>
                  <MaterialCommunityIcons name="bed-outline" size={16} color={colors.textLight} />
                  <Text style={[styles.configDetailText, { color: colors.text }]}>
                    <Text style={{ fontWeight: 'bold' }}>Descanso Largo:</Text> {activity.type?.long_break} min
                  </Text>
                </View>
                <View style={styles.configItemRow}>
                  <MaterialCommunityIcons name="refresh" size={16} color={colors.textLight} />
                  <Text style={[styles.configDetailText, { color: colors.text }]}>
                    <Text style={{ fontWeight: 'bold' }}>Frecuencia:</Text> Cada {activity.type?.cycles_before_long} ciclos
                  </Text>
                </View>
                <View style={styles.configItemRow}>
                  <MaterialCommunityIcons name="flag-checkered" size={16} color={colors.textLight} />
                  <Text style={[styles.configDetailText, { color: colors.text }]}>
                    <Text style={{ fontWeight: 'bold' }}>Ciclos Totales:</Text> {activity.extra_data?.total_ciclos === 0 ? 'Infinitos (Manual)' : `${activity.extra_data?.total_ciclos} ciclos`}
                  </Text>
                </View>
              </View>
            )}

            {activity.type?.name_type === 'TEMPORIZADOR' && (
              <View style={styles.typeSpecificContent}>
                <View style={styles.configItemRow}>
                  <MaterialCommunityIcons name="clock" size={16} color={colors.textLight} />
                  <Text style={[styles.configDetailText, { color: colors.text }]}>
                    <Text style={{ fontWeight: 'bold' }}>Tiempo Programado:</Text> {Math.floor((activity.type?.work_duration || 0) / 60)}h {(activity.type?.work_duration || 0) % 60}min ({activity.type?.work_duration} minutos totales)
                  </Text>
                </View>
              </View>
            )}

            {activity.type?.name_type === 'HITO' && (
              <View style={styles.typeSpecificContent}>
                <View style={styles.configItemRow}>
                  <MaterialCommunityIcons name="format-list-bulleted" size={16} color={colors.textLight} />
                  <Text style={[styles.configDetailText, { color: colors.text, fontWeight: 'bold' }]}>
                    Lista de Hitos ({activity.extra_data?.hitos?.length || 0}):
                  </Text>
                </View>
                {activity.extra_data?.hitos && activity.extra_data.hitos.length > 0 ? (
                  activity.extra_data.hitos.map((hito, idx) => (
                    <View key={idx} style={styles.hitoRow}>
                      <MaterialCommunityIcons name="flag-variant-outline" size={14} color={typeInfo.color} />
                      <Text style={[styles.hitoItemText, { color: colors.text }]}>{hito}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={[styles.emptyText, { color: colors.textLight }]}>No hay hitos definidos</Text>
                )}
              </View>
            )}
          </Surface>

          {(formattedInitDate || formattedEndDate) && (
            <View style={styles.infoGrid}>
              {formattedInitDate && (
                <Surface style={[styles.infoCard, { backgroundColor: colors.background }]}>
                  <MaterialCommunityIcons name="calendar-start" size={18} color={colors.primary} />
                  <Text style={[styles.infoLabel, { color: colors.textLight }]}>Inicio</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{formattedInitDate}</Text>
                </Surface>
              )}

              {formattedEndDate && (
                <Surface style={[styles.infoCard, { backgroundColor: colors.background }]}>
                  <MaterialCommunityIcons name="calendar-end" size={18} color={colors.primary} />
                  <Text style={[styles.infoLabel, { color: colors.textLight }]}>Fin</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{formattedEndDate}</Text>
                </Surface>
              )}
            </View>
          )}

          <Surface style={[styles.sectionCard, { backgroundColor: colors.background }]}>
            <View style={styles.sectionCardHeader}>
              <MaterialCommunityIcons name="robot" size={18} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.textLight }]}>Bot Asignado</Text>
            </View>
            
            {activity.bot?.bot_id ? (
              <BotTile 
                item={{
                  bot_id: activity.bot.bot_id,
                  name: activity.bot.name,
                  mac: activity.bot.mac,
                  status: activity.bot.status,
                  last_sync: activity.bot.end_date
                }}
                AppColors={colors}
              />
            ) : (
              <Text style={[styles.emptyText, { color: colors.textLight }]}>
                Sin bot asignado
              </Text>
            )}
          </Surface>

          {activity.state === 'COMPLETADO' && activity.result && (
            <Surface style={[styles.resultCard, { 
              backgroundColor: activity.result === 'SUCCESS' ? '#4CAF5010' : '#F4433610',
              borderColor: activity.result === 'SUCCESS' ? '#4CAF50' : '#F44336'
            }]}>
              <View style={styles.resultContent}>
                <Surface style={[styles.resultIconBadge, {
                  backgroundColor: activity.result === 'SUCCESS' ? '#4CAF50' : '#F44336'
                }]}>
                  <MaterialCommunityIcons 
                    name={activity.result === 'SUCCESS' ? 'check' : 'close'} 
                    size={18} 
                    color="#FFFFFF" 
                  />
                </Surface>
                <View style={styles.resultTextContainer}>
                  <Text style={[styles.sectionTitle, { color: colors.textLight }]}>Resultado</Text>
                  <Text style={[styles.resultText, { 
                    color: activity.result === 'SUCCESS' ? '#4CAF50' : '#F44336' 
                  }]}>
                    {activity.result === 'SUCCESS' ? 'Completado con éxito' : 'No completado'}
                  </Text>
                </View>
              </View>
            </Surface>
          )}
        </ScrollView>

        <View style={styles.actionsContainer}>
          {shouldShowActionButton && actionConfig && (
            <View style={activity.state === 'EN_CURSO' ? styles.parallelActionsRow : null}>
              <Button 
                mode="contained" 
                onPress={handleStartPress}
                loading={isLoading}
                disabled={isLoading}
                style={[
                  activity.state === 'EN_CURSO' ? styles.parallelButton : styles.actionButton, 
                  { backgroundColor: stateConfig.color }
                ]}
                textColor={colors.background}
                contentStyle={styles.buttonContent}
                icon={actionConfig.icon}
              >
                {actionConfig.label}
              </Button>
            </View>
          )}
          
          <View style={styles.secondaryActions}>
            <Button 
              mode="outlined" 
              onPress={() => onEditPress && onEditPress(activity)}
              style={[styles.secondaryButton, { borderColor: colors.primary }]}
              textColor={colors.primary}
              contentStyle={styles.buttonContent}
              icon="pencil"
              disabled={isLoading || (activity.state !== 'PENDIENTE' && activity.state !== 'POSPUESTO')}
            >
              Editar
            </Button>
            
            <Button 
              mode="outlined" 
              onPress={() => onDeletePress && onDeletePress(activity)}
              style={[styles.secondaryButton, { borderColor: colors.error }]}
              textColor={colors.error}
              contentStyle={styles.buttonContent}
              icon="delete"
              disabled={isLoading || (activity.state !== 'PENDIENTE' && activity.state !== 'POSPUESTO')}
            >
              Eliminar
            </Button>
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    borderRadius: 24,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  headerIconSurface: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  typeSpecificContent: {
    marginTop: 6,
    gap: 6,
  },
  configItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  configDetailText: {
    fontSize: 13,
  },
  hitoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 24,
    marginVertical: 1,
  },
  hitoItemText: {
    fontSize: 13,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  infoGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  infoCard: {
    flex: 1,
    padding: 10,
    borderRadius: 14,
    alignItems: 'center',
    gap: 1,
  },
  infoLabel: {
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  sectionCard: {
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
  },
  sectionCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  resultCard: {
    padding: 12,
    borderRadius: 14,
    marginBottom: 4,
    borderWidth: 1,
  },
  resultContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  resultIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultTextContainer: {
    flex: 1,
  },
  resultText: {
    fontSize: 13,
    fontWeight: '600',
  },
  actionsContainer: {
    gap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  actionButton: {
    borderRadius: 30,
    width: '100%',
  },
  parallelActionsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  parallelButton: {
    flex: 1,
    borderRadius: 30,
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryButton: {
    flex: 1,
    borderRadius: 30,
  },
  buttonContent: {
    paddingVertical: 6,
  },
});

export default ActivityDetailModal;