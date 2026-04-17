import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '../theme/theme';
import {useResponsiveLayout} from '../hooks/useResponsiveLayout'

export default function BottomNav({ navigation }) {
  // Obtención de la navegación actual
  const currentRouteName = useNavigationState((state) => {
    if (!state || !state.routes) return 'Home';
    const route = state.routes[state.index];
    return route?.name || 'Home';
  });

  //Comprobaciones de sistema operativo Para cambio de estilo
  // Detectar si es Web
  const { isWeb } = useResponsiveLayout();
  
  // Para Web, detectar si es pantalla pequeña (móvil) o grande (tablet/desktop)
  const { width } = Dimensions.get('window');
  const isLargeScreen = width >= 768;
  
  // En Web: barra lateral solo en pantallas grandes
  // En móvil (Web o nativo): barra inferior
  const useSidebar = isWeb && isLargeScreen;
  
  // Definimos los items de la barra de navegación
  const navItems = [
    { name: 'Home', icon: 'home', iconOutline: 'home-outline' },
    { name: 'Activities', icon: 'star', iconOutline: 'star-outline' },
    { name: 'Records', icon: 'time', iconOutline: 'time-outline' },
    { name: 'Profile', icon: 'person', iconOutline: 'person-outline' },
  ];

  const handleNavigation = (screenName) => {
    console.log(`Navegando a: ${screenName}`);

    switch (screenName){
      case 'Home':
        navigation?.navigate('Home');
        break;
      case 'Activities':
        navigation?.navigate('Activities');
        break;
      case 'Records':
        navigation?.navigate('Records');
        break;
      case 'Profile':
        navigation?.navigate('Profile');
        break;
      default: 
        console.log(`Pantalla "${screenName}" aún no implementada`);
    }
  };

  return (
    <View style={useSidebar ? styles.sidebarContainer : styles.bottomBarContainer}>
      <View style={useSidebar ? styles.sidebar : styles.bottomBar}>
        {navItems.map((item) => {
          const isActive = currentRouteName === item.name;
          
          return (
            <TouchableOpacity
              key={item.name}
              onPress={() => handleNavigation(item.name)}
              style={useSidebar ? styles.sidebarBtn : styles.bottomBarBtn}
              activeOpacity={0.7}
            >
              <Ionicons 
                name={isActive ? item.icon : item.iconOutline}
                size={useSidebar ? 28 : 24} 
                color={isActive ? AppColors.primary : AppColors.placeholder}
              />
              
              {/* Indicador visual de activo para web */}
              {useSidebar && isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // MOVIL
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  bottomBar: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10, // Para respetar la barra inferior de navegación
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  bottomBarBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },

  // WEB
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 80,
    zIndex: 100,
    margin_right: 10
  },
  sidebar: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 80, // Espacio para el header
    paddingHorizontal: 16,
    ...Platform.select({
      web: {
        boxShadow: '2px 0px 8px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  sidebarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 4,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: '50%',
    marginTop: -12,
    width: 4,
    height: 24,
    backgroundColor: AppColors.primary,
    borderRadius: 4,
  },
});