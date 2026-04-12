import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { AppColors } from '../theme/theme';

const BottomNav = ({ navigation }) => {
  const navItems = [
    { name: 'Home', label: 'Inicio', icon: 'home' },
    { name: 'BotPage', label: 'Bots', icon: 'robot' },
    { name: 'Activities', label: 'Actividad', icon: 'clipboard-list' },
    { name: 'Records', label: 'Historial', icon: 'history' },
  ];

  return (
    <View style={styles.bottomBar}>
      {navItems.map((item) => (
        <TouchableOpacity 
          key={item.name}
          onPress={() => navigation?.navigate(item.name)} 
          style={styles.navBtn}
        >
          <IconButton icon={item.icon} size={24} iconColor={AppColors.primary} />
          <Text style={styles.navBtnText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottomBar: {
    height: 65,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    elevation: 10,
  },
  navBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#666',
    marginTop: -10,
  }
});

export default BottomNav;
