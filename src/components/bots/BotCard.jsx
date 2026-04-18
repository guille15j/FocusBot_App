import React from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import {Avatar, Badge, IconButton, Card, Text, Chip } from 'react-native-paper';
// import {  getglobalStyles, updateAppColors } from '../../theme/theme';


const BotCard = ({ item , AppColors, globalStyles}) => {
  // this.AppColors = AppColors

  const estadoConfig = {
    OFFLINE:    { color: '#757575', icono: 'robot-off', animar: false },
    BOOTING:    { color: '#FF9800', icono: 'robot-confused', animar: true },
    CONFIGURING:{ color: '#2196F3', icono: 'cog-sync', animar: true },
    IDLE:       { color: '#32b100', icono: 'robot', animar: false },
    FOCUSING:   { color: '#9C27B0', icono: 'target', animar: true },
    PAUSED:     { color: '#FFC107', icono: 'pause-circle', animar: false },
    BREAK:      { color: '#00BCD4', icono: 'coffee', animar: false },
    FINISHED:   { color: '#3F51B5', icono: 'check-circle', animar: false },
    ERROR:      { color: '#F44336', icono: 'alert-octagon', animar: false },
  };

  const config = estadoConfig[item.status] || estadoConfig.ERROR;

  return (

    <Card style={styles.card} elevation={3}>
      <Card.Title 
        title={item.name} 
        titleVariant="titleLarge"
        subtitle={item.ssid ? `Wi-Fi: ${item.ssid}` : item.mac_address}
        left={(props) => (
          <View>
            <Avatar.Icon 
              {...props} 
              icon={config.icono} 
              size={44} 
              style={{ backgroundColor: AppColors.primary }} 
            />
            <Badge 
              visible 
              size={14} 
              style={[styles.badge, { backgroundColor: config.color }]} 
            />
          </View>
        )} 
      />
      
      <Card.Content style={styles.content}>
        <View style={styles.statusBadge}>
            <Text style={[styles.statusText, { color: config.color }]}>
                ● {item.status}
            </Text>
        </View>

        <View style={styles.infoRow}>
            <Text variant="labelSmall" style={styles.label}>Versión:</Text>
            <Text variant="bodySmall">{item.version}</Text>
        </View>

        <Text variant="bodySmall" style={styles.syncText}>
            Visto: {item.last_sync ? item.last_sync.split('T')[1].substring(0, 5) : '--:--'}
        </Text>
      </Card.Content>

      {/* <Card.Actions>
        <IconButton 
            icon="play" 
            mode="contained"
            disabled={item.status !== 'IDLE' && item.status !== 'PAUSED'}
            iconColor="white"
            style={{ backgroundColor: (item.status === 'IDLE' || item.status === 'PAUSED') ? '#6200ee' : '#e0e0e0' }}
            onPress={() => console.log("Start", item.bot_id)} 
        />
        <IconButton 
            icon="stop" 
            disabled={item.status !== 'FOCUSING' && item.status !== 'BREAK'}
            onPress={() => console.log("Stop", item.bot_id)} 
        />
      </Card.Actions> */}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 15,
    // backgroundColor: AppColors.surface,
    overflow: 'hidden'
  },
  content: { marginTop: -4 },
  statusBadge: {
    // backgroundColor: AppColors.background,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: { color: '#757575' },
  syncText: {
    marginTop: 8,
    fontSize: 9,
    color: '#9e9e9e',
    textAlign: 'right',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: 'white',
  }
});

export default BotCard;