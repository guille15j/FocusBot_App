import React, { useMemo } from 'react';
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

const ActivityDetailModal = ({ visible, onDismiss, activity, onActionPress, onEditPress, onDeletePress }) => {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);

  const categoryInfo = CATEGORIES_CONFIG[activity?.category] || CATEGORIES_CONFIG.OTRAS;

  const getStateConfig = (state) => {
    switch (state) {
      case 'COMPLETADO': return { color: '#81C784', icon: 'check-circle', label: 'Completado' };
      case 'EN CURSO': return { color: '#4FC3F7', icon: 'play-circle', label: 'En Curso' };
      case 'PENDIENTE': return { color: '#FFB74D', icon: 'clock-outline', label: 'Pendiente' };
      case 'CANCELADO': return { color: '#E57373', icon: 'close-circle', label: 'Cancelado' };
      case 'POSPUESTO': return { color: '#BA68C8', icon: 'pause-circle', label: 'Pospuesto' };
      default: return { color: '#757575', icon: 'help-circle', label: state };
    }
  };

  const shouldShowActionButton = activity && !['COMPLETADO', 'CANCELADO'].includes(activity.state);

  const getActionButtonConfig = () => {
    if (!activity) return null;
    
    if (activity.state === 'EN CURSO') {
      return { icon: 'pause', label: 'Pausar', action: 'pause' };
    }
    
    if (['PENDIENTE', 'POSPUESTO'].includes(activity.state)) {
      return { icon: 'play', label: 'Iniciar', action: 'start' };
    }
    
    return null;
  };

  const stateConfig = activity ? getStateConfig(activity.state) : null;
  const actionConfig = getActionButtonConfig();

  const formatDate = (dateString) => {
    if (!dateString) return '--/--/---- --:--';
    const date = new Date(dateString);
    return date.toLocaleDateString([], { day: '2-digit', month: '2-digit', year: 'numeric' }) + 
           '  ' + 
           date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateDuration = () => {
    if (!activity?.init_date || !activity?.end_date) return null;
    const start = new Date(activity.init_date);
    const end = new Date(activity.end_date);
    const diffMs = end - start;
    if (diffMs < 0) return null;
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}min`;
    if (hours > 0) return `${hours}h`;
    return `${minutes}min`;
  };

  const duration = calculateDuration();

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
            <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{activity.title}</Text>
          </View>
          <IconButton 
            icon="close-circle" 
            size={26} 
            onPress={onDismiss}
            iconColor={colors.textLight}
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

            {duration && (
              <Surface style={[styles.badge, { backgroundColor: colors.primary + '20', borderColor: colors.primary }]}>
                <MaterialCommunityIcons name="timer-outline" size={12} color={colors.primary} />
                <Text style={[styles.badgeText, { color: colors.primary }]}>{duration}</Text>
              </Surface>
            )}
          </View>

          {activity.description ? (
            <Surface style={[styles.descriptionCard, { backgroundColor: colors.background }]}>
              <Text style={[styles.sectionTitle, { color: colors.textLight }]}>Descripcion</Text>
              <Text style={[styles.descriptionText, { color: colors.text }]}>
                {activity.description}
              </Text>
            </Surface>
          ) : null}

          <View style={styles.infoGrid}>
            <Surface style={[styles.infoCard, { backgroundColor: colors.background }]}>
              <MaterialCommunityIcons name="calendar-start" size={18} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textLight }]}>Inicio</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{formatDate(activity.init_date)}</Text>
            </Surface>

            <Surface style={[styles.infoCard, { backgroundColor: colors.background }]}>
              <MaterialCommunityIcons name="calendar-end" size={18} color={colors.primary} />
              <Text style={[styles.infoLabel, { color: colors.textLight }]}>Fin</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{formatDate(activity.end_date)}</Text>
            </Surface>
          </View>

          <Surface style={[styles.sectionCard, { backgroundColor: colors.background }]}>
            <View style={styles.sectionCardHeader}>
              <MaterialCommunityIcons name="robot" size={18} color={colors.primary} />
              <Text style={[styles.sectionTitle, { color: colors.textLight }]}>Bot Asignado</Text>
            </View>
            {activity.bot_id ? (
              <BotTile 
                item={{
                  bot_id: activity.bot_id,
                  name: activity.bot_id,
                  status: 'IDLE',
                  version: '1.0',
                  last_sync: activity.end_date
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
              backgroundColor: activity.result === 'SUCCESS' ? '#4CAF50' + '10' : '#F44336' + '10',
              borderColor: activity.result === 'SUCCESS' ? '#4CAF50' : '#F44336'
            }]}>
              <View style={styles.resultContent}>
                <Surface style={[styles.resultIconBadge, {
                  backgroundColor: activity.result === 'SUCCESS' ? '#4CAF50' : '#F44336'
                }]}>
                  <MaterialCommunityIcons 
                    icon={activity.result === 'SUCCESS' ? 'check' : 'close'} 
                    size={18} 
                    color="#FFFFFF" 
                  />
                </Surface>
                <View style={styles.resultTextContainer}>
                  <Text style={[styles.sectionTitle, { color: colors.textLight }]}>Resultado</Text>
                  <Text style={[styles.resultText, { 
                    color: activity.result === 'SUCCESS' ? '#4CAF50' : '#F44336' 
                  }]}>
                    {activity.result === 'SUCCESS' ? 'Completado con exito' : 'No completado'}
                  </Text>
                </View>
              </View>
            </Surface>
          )}
        </ScrollView>

        <View style={styles.actionsContainer}>
          {shouldShowActionButton && actionConfig && (
            <Button 
              mode="contained" 
              onPress={() => onActionPress && onActionPress(actionConfig.action, activity)}
              style={[styles.actionButton, { backgroundColor: stateConfig.color }]}
              textColor={colors.background}
              contentStyle={styles.buttonContent}
              icon={actionConfig.icon}
            >
              {actionConfig.label}
            </Button>
          )}

          <View style={styles.secondaryActions}>
            <Button 
              mode="outlined" 
              onPress={() => onEditPress && onEditPress(activity)}
              style={[styles.secondaryButton, { borderColor: colors.primary }]}
              textColor={colors.primary}
              contentStyle={styles.buttonContent}
              icon="pencil"
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
    flex: 1,
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
  descriptionCard: {
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 2,
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