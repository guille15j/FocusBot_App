import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AppColors } from '../theme/theme';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';

export default function BottomNav({ navigation }) {
  const currentRouteName = useNavigationState((state) => {
    if (!state || !state.routes) return 'Home';
    const route = state.routes[state.index];
    return route?.name || 'Home';
  });

  const { isWeb } = useResponsiveLayout();
  
  const { width } = Dimensions.get('window');
  const isLargeScreen = width >= 768;
  const useSidebar = isWeb && isLargeScreen;
  
  const navItems = [    
    { name: 'Records', icon: 'clock-outline', iconOutline: 'clock-outline' },
    { name: 'Activities', icon: 'calendar', iconOutline: 'calendar-outline' },
    { name: 'Home', icon: 'home', iconOutline: 'home-outline' },
    { name: 'Bots', icon: 'robot', iconOutline: 'robot-outline' },
    { name: 'Profile', icon: 'account', iconOutline: 'account-outline' },
  ];

  const handleNavigation = (screenName) => {
    console.log(`Navegando a: ${screenName}`);

    switch (screenName) {
      case 'Home':
        navigation?.navigate('Home');
        break;
      case 'Activities':
        navigation?.navigate('Activities');
        break;
      case 'Records':
        navigation?.navigate('Records');
        break;
      case 'Bots':
        navigation?.navigate('Bots');
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
              <MaterialCommunityIcons 
                name={isActive ? item.icon : item.iconOutline}
                size={useSidebar ? 28 : 24} 
                color={isActive ? AppColors.primary : AppColors.placeholder}
              />
              
              {useSidebar && isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
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
    backgroundColor: AppColors.surface,
    paddingTop: 80,
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