import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Card, Text, Surface } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const BotCard = ({ item, AppColors, onClick }) => {
  const estadoConfig = {
    OFFLINE:   { color: '#757575', icono: 'robot-off', label: 'Desconectado' },
    IDLE:      { color: '#4CAF50', icono: 'robot-happy', label: 'Disponible' },
    FOCUSING:  { color: '#9C27B0', icono: 'robot-angry', label: 'Enfocado' },
  };

  const config = estadoConfig[item?.status] || estadoConfig.OFFLINE;

  // Formateador seguro de la hora para evitar fallos de renderizado si viene nulo
  const formatoHoraSync = () => {
    if (!item?.last_sync) return null;
    try {
      const partes = item.last_sync.split('T');
      if (partes.length > 1) {
        return partes[1].substring(0, 5);
      }
      return item.last_sync.substring(0, 5);
    } catch (e) {
      return null;
    }
  };

  const horaSincronizada = formatoHoraSync();

  return (
    <Card 
      style={[styles.card, { backgroundColor: AppColors.surface }]} 
      elevation={2} 
      onPress={() => onClick && onClick(item)}
    >
      <Card.Title 
        title={item?.name || 'FocusBot'} 
        titleStyle={[styles.title, { color: AppColors.text }]}
        titleVariant="titleMedium"
        subtitle={
          <View style={styles.subtitleContainer}>
            <MaterialCommunityIcons 
              name={item?.ssid ? "wifi" : "lan-connect"} 
              size={13} 
              color={AppColors.textLight} 
            />
            <Text style={[styles.subtitleText, { color: AppColors.textLight }]} numberOfLines={1}>
              {item?.ssid ? item.ssid : (item?.mac_address || item?.mac || 'Sin dirección MAC')}
            </Text>
          </View>
        }
        left={(props) => (
          <Avatar.Icon 
            {...props} 
            icon={config.icono} 
            size={42} 
            style={{ backgroundColor: config.color + '20' }} 
            color={config.color}
          />
        )} 
      />
      
      <Card.Content style={styles.content}>
        <View style={styles.footerRow}>
          <Surface style={[styles.statusBadge, { backgroundColor: config.color + '15', borderColor: config.color + '40' }]}>
            <View style={[styles.statusDot, { backgroundColor: config.color }]} />
            <Text style={[styles.statusText, { color: config.color }]}>
              {config.label}
            </Text>
          </Surface>

          {horaSincronizada && (
            <View style={styles.syncContainer}>
              <MaterialCommunityIcons name="cached" size={13} color={AppColors.placeholder} />
              <Text variant="bodySmall" style={[styles.syncText, { color: AppColors.placeholder }]}>
                {horaSincronizada}
              </Text>
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    overflow: 'hidden',
    width: '100%',
  },
  title: {
    fontWeight: '700',
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  subtitleText: {
    fontSize: 12,
  },
  content: { 
    marginTop: 2,
    paddingBottom: 14,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 0,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  syncContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  syncText: {
    fontSize: 11,
    fontWeight: '500',
  },
});

export default BotCard;