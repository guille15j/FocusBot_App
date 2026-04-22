import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Card, Text } from 'react-native-paper';

const BotCard = ({ item, AppColors }) => {
  const estadoConfig = {
    OFFLINE:    { color: '#757575', icono: 'robot-off', animar: false },
    IDLE:       { color: '#32b100', icono: 'robot-happy', animar: false },
    FOCUSING:   { color: '#9C27B0', icono: 'robot-angry', animar: true },
  };

  const config = estadoConfig[item.status] || estadoConfig.OFFLINE;

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
              style={{ backgroundColor: config.color }} 
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

        <Text variant="bodySmall" style={styles.syncText}>
            Sincronizado a {item.last_sync ? item.last_sync.split('T')[1].substring(0, 5) : '--:--'}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    borderRadius: 15,
    overflow: 'hidden'
  },
  content: { marginTop: -4 },
  statusBadge: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  syncText: {
    marginTop: 8,
    fontSize: 12,
    color: '#9e9e9e',
    textAlign: 'right',
  },
});

export default BotCard;