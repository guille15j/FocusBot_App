import React from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Chip, Avatar, Text } from 'react-native-paper';
// import { AppColors } from '../../theme/theme';

const BotTile = ({ item, onPress, AppColors }) => {
  // Configuramos el color y el icono según el estado del Bot
  const obtenerConfiguracion = (status) => {
    switch (status) {
      case 'IDLE':
      case 'FINISHED':
        return { color: '#4CAF50', icon: 'robot-happy' }; // Verde
      case 'FOCUSING':
      case 'BOOTING':
      case 'CONFIGURING':
        return { color: '#2196F3', icon: 'robot' };      // Azul
      case 'PAUSED':
      case 'BREAK':
        return { color: '#FF9800', icon: 'robot-vacuum' }; // Naranja
      case 'ERROR':
      case 'OFFLINE':
        return { color: '#F44336', icon: 'robot-dead' };   // Rojo
      default:
        return { color: '#757575', icon: 'robot-off' };    // Gris
    }
  };

  const config = obtenerConfiguracion(item.status);

  return (
    <List.Item
      title={item.name}
      titleStyle={styles.title}
      description={`ID: ${item.bot_id} • v${item.version}\nStatus: ${item.status}`}
      descriptionNumberOfLines={2}
      
      // Icono de la izquierda con el color del estado
      left={props => (
        <Avatar.Icon 
          {...props} 
          icon={config.icon} 
          size={48} 
          style={{ backgroundColor: AppColors.primary}} 
          color= {AppColors.background}
        />
      )}
      
      // Contenido de la derecha (Hora y flecha)
      right={props => (
        <View style={styles.rightContainer}>
          <Text variant="labelSmall" style={styles.timeText}>
            {item.last_sync ? item.last_sync.split('T')[1].substring(0, 5) : '--:--'}
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
    // backgroundColor: 'white',
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
    // color: '#999',
    marginBottom: 4,
  },
});

export default BotTile;