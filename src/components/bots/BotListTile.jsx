import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Avatar, Text } from 'react-native-paper';

const BotTile = ({ item, onPress, AppColors }) => {
  const obtenerConfiguracion = (status) => {
    switch (status) {
      case 'IDLE':
      case 'FINISHED':
        return { color: '#4CAF50', icon: 'robot-happy' };
      case 'FOCUSING':
      case 'BOOTING':
      case 'CONFIGURING':
        return { color: '#2196F3', icon: 'robot' };
      case 'PAUSED':
      case 'BREAK':
        return { color: '#FF9800', icon: 'robot-vacuum' };
      case 'ERROR':
      case 'OFFLINE':
        return { color: '#F44336', icon: 'robot-dead' };
      default:
        return { color: '#757575', icon: 'robot-off' };
    }
  };

  const config = obtenerConfiguracion(item.status);
  // console.log(Object.keys(item), Object.values(item));


  return (
    <List.Item
      title={item.name}
      titleStyle={styles.title}
      description={`${item.mac} \nStatus: ${item.status}`}
      descriptionNumberOfLines={2}
      left={props => (
        <Avatar.Icon 
          {...props} 
          icon={config.icon} 
          size={48} 
          style={{ backgroundColor: AppColors.primary}} 
          color={AppColors.background}
        />
      )}
      right={props => (
        <View style={styles.rightContainer}>
          <Text variant="labelSmall" style={styles.timeText}>
            {item.last_sync ? item.last_sync.split('T')[1].substring(0, 5) : ' '}
          </Text>
          <List.Icon {...props} icon="chevron-right" />
        </View>
      )}
      onPress={() => onPress && onPress(item)}
      style={[styles.listItem, {backgroundColor: AppColors.surface}]}
    />
  );
};

const styles = StyleSheet.create({
  listItem: {
    paddingVertical: 8,
    padding: 16,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  rightContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  timeText: {
    marginBottom: 4,
  },
});

export default BotTile;