import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { AppColors } from '../theme/theme';

export default function BottomNav({ navigation }) {
  // Obtención de la navegación actual
  const currentRouteName = useNavigationState((state) => {
    if (!state || !state.routes) return 'Home';
    const route = state.routes[state.index];
    return route?.name || 'Home';
  });
  
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
    <View style={styles.bottomBar}>
      {navItems.map((item) => {
        //Determinar si esta pestaña es la activa
        const isActive = currentRouteName === item.name;
        
        return (
          <TouchableOpacity
            key={item.name}
            onPress={() => handleNavigation(item.name)}
            style={styles.navBtn}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isActive ? item.icon : item.iconOutline}
              size={24} 
              color={isActive ? AppColors.primary : AppColors.placeholder}
            />
            
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

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
});