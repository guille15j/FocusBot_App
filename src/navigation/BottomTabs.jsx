import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Dimensions, Text, useColorScheme } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { updateAppColors } from '../theme/theme';

// Función auxiliar para detectar dimensiones (opcional, para mayor limpieza)
const { width } = Dimensions.get('window');
const isLargeScreen = width >= 768;

export default function BottomNav({ navigation }) {
  const currentRouteName = useNavigationState((state) => {
    if (!state || !state.routes) return 'Home';
    const route = state.routes[state.index];
    return route?.name || 'Home';
  });

  const scheme = useColorScheme(); 
  const AppColors = updateAppColors(scheme); // Nuestra variable de colores
  
  const isWeb = Platform.OS === 'web';
  const useSidebar = isWeb && isLargeScreen;

  // GENERAMOS LOS ESTILOS AQUÍ PARA QUE TENGAN ACCESO A AppColors
  const styles = getStyles(AppColors, useSidebar);

  let navItems = [    
    { name: 'Records', icon: 'clock-outline', iconOutline: 'clock-outline' },
    { name: 'Activities', icon: 'calendar', iconOutline: 'calendar-outline' },
    { name: 'Home', icon: 'home', iconOutline: 'home-outline' },
    { name: 'Bots', icon: 'robot', iconOutline: 'robot-outline' },
    { name: 'Profile', icon: 'account', iconOutline: 'account-outline' },
  ];

  if (isWeb) {
    navItems = [    
      { name: 'Home', icon: 'home', iconOutline: 'home-outline' },
      { name: 'Bots', icon: 'robot', iconOutline: 'robot-outline' },
      { name: 'Activities', icon: 'calendar', iconOutline: 'calendar-outline' },
      { name: 'Records', icon: 'clock-outline', iconOutline: 'clock-outline' },
      { name: 'Profile', icon: 'account', iconOutline: 'account-outline' },
    ];
  }

  const handleNavigation = (screenName) => {
    navigation?.navigate(screenName);
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
              {useSidebar && isActive && <View style={styles.activeIndicator} />}
              <MaterialCommunityIcons 
                name={isActive ? item.icon : item.iconOutline}
                size={useSidebar ? 28 : 24} 
                color={isActive ? (isWeb ? AppColors.background : AppColors.primary) : AppColors.placeholder}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ESTA FUNCIÓN PERMITE QUE LOS ESTILOS SEAN "GLOBALES" AL ARCHIVO PERO DINÁMICOS AL TEMA
const getStyles = (AppColors, useSidebar) => StyleSheet.create({
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
    backgroundColor: AppColors.surface,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 8 },
      web: { boxShadow: '0px -2px 4px rgba(0, 0, 0, 0.05)' },
    }),
  },
  bottomBarBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 80,
    zIndex: 100
  },
  sidebar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.surface,
    paddingHorizontal: 16,
    ...Platform.select({
      web: { boxShadow: '2px 0px 8px rgba(0, 0, 0, 0.05)' },
    }),
  },
  sidebarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 8,
    marginBottom: 4,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  activeIndicator: {
    position: 'absolute',
    left: -3.5,
    top: '50%',
    marginTop: -25,
    width: 50,
    height: 50,
    backgroundColor: AppColors.primary,
    borderRadius: 25,
  },
});