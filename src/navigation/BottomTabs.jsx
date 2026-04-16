// ============================================================
// IMPORTS
// ============================================================

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '../theme/theme';

// ============================================================
// COMPONENTE: Barra de navegación inferior personalizada
// ============================================================

export default function BottomNav({ navigation }) {
  
  // Definimos los items de la barra de navegación
  const navItems = [
    { name: 'Home', label: 'Inicio', icon: 'home', iconOutline: 'home-outline' },
    { name: 'Activities', label: 'Actividad', icon: 'calendar', iconOutline: 'calendar-outline' },
    { name: 'Records', label: 'Historial', icon: 'time', iconOutline: 'time-outline' },
    { name: 'Profile', label: 'Perfil', icon: 'person', iconOutline: 'person-outline' },
  ];

  // NOTA: Por ahora solo tenemos HomeScreen, las otras pantallas se agregarán después
  // Por eso, al hacer clic en otras opciones, mostramos un mensaje en consola

  const handleNavigation = (screenName) => {
    console.log(`📱 Navegando a: ${screenName}`);
    
    // Si la pantalla existe, navegamos
    // Si no, mostramos un mensaje (por ahora)
    if (screenName === 'Home') {
      navigation?.navigate(screenName);
    } else {
      console.log(`⚠️ Pantalla "${screenName}" aún no implementada`);
    }
  };

  return (
    <View style={styles.bottomBar}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.name}
          onPress={() => handleNavigation(item.name)}
          style={styles.navBtn}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={item.iconOutline} 
            size={24} 
            color={AppColors.placeholder} 
          />
          <Text style={styles.navBtnText}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

// ============================================================
// ESTILOS
// ============================================================

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 8,
  },
  navBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  navBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: AppColors.textLight,
    marginTop: 4,
  },
});