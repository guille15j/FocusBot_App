import React, { useContext } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Dimensions, useColorScheme } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { Drawer, IconButton, Surface } from 'react-native-paper';
import { updateAppColors } from '../theme/theme';
import { AuthContext } from '../context/AuthContext';

const { width } = Dimensions.get('window');
const isLargeScreen = width >= 768;

export default function BottomNav({ navigation }) {
  const scheme = useColorScheme(); 
  const AppColors = updateAppColors(scheme);
  
  const currentRouteName = useNavigationState((state) => {
    if (!state || !state.routes) return 'Home';
    const route = state.routes[state.index];
    return route?.name || 'Home';
  });

  const isWeb = Platform.OS === 'web';
  const useSidebar = isWeb && isLargeScreen;
  const { signOut } = useContext(AuthContext);

  const styles = getStyles(AppColors, useSidebar);

  let navItems = [    
    { name: 'Home', icon: 'home', iconOutline: 'home-outline' },
    { name: 'Bots', icon: 'robot', iconOutline: 'robot-outline' },
    { name: 'Activities', icon: 'calendar', iconOutline: 'calendar-outline' },
    { name: 'Records', icon: 'clock-outline', iconOutline: 'clock-outline' },
    { name: 'Profile', icon: 'account', iconOutline: 'account-outline' },
  ];

  let navItems_app = [    
    { name: 'Records', icon: 'clock-outline', iconOutline: 'clock-outline' },
    { name: 'Bots', icon: 'robot', iconOutline: 'robot-outline' },
    { name: 'Home', icon: 'home', iconOutline: 'home-outline' },
    { name: 'Activities', icon: 'calendar', iconOutline: 'calendar-outline' },
    { name: 'Profile', icon: 'account', iconOutline: 'account-outline' },
  ];

  const handleNavigation = (screenName) => {
    navigation?.navigate(screenName);
  };

  const ejecutarLogout = async () => {
    await signOut();
  };

  if (useSidebar) {
    return (
      <Surface style={styles.sidebarContainer} elevation={1}>
        {/* Espaciador superior opcional para logo o avatar */}
        <View style={styles.sidebarHeader} />

        {/* Sección Central de Navegación */}
        <View style={styles.centeredNav}>
          <Drawer.Section showDivider={false} style={styles.drawerSection}>
            {navItems.map((item) => {
              const isActive = currentRouteName === item.name;
              return (
                <Drawer.Item
                  key={item.name}
                  label={item.name} // En sidebar colapsado solo mostramos icono
                  icon={isActive ? item.icon : item.iconOutline}
                  active={isActive}
                  onPress={() => handleNavigation(item.name)}
                  style={styles.drawerItem}
                  activeColor={AppColors.background}
                  rippleColor={AppColors.primary}
                />
              );
            })}
          </Drawer.Section>
        </View>

        <View style={styles.sidebarFooter}>
          <IconButton
            icon="help"
            // mode="contained"
            // containerColor={AppColors.error}
            // iconColor="white"
            size={24}
            // onPress={ejecutarLogout}
          />
          <IconButton
            icon="logout"
            // mode="contained"
            // containerColor={AppColors.error}
            // iconColor="white"
            size={24}
            onPress={ejecutarLogout}
          />
        </View>
      </Surface>
    );
  }

  return (
    <Surface style={styles.bottomBarContainer} elevation={4}>
      <View style={styles.bottomBar}>
        {navItems_app.map((item) => {
          const isActive = currentRouteName === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              onPress={() => handleNavigation(item.name)}
              style={styles.bottomBarBtn}
              activeOpacity={0.7}
            >
              <IconButton
                icon={isActive ? item.icon : item.iconOutline}
                iconColor={isActive ? AppColors.primary : AppColors.placeholder}
                size={24}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </Surface>
  );
}

const getStyles = (AppColors, useSidebar) => StyleSheet.create({
  sidebarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 80,
    zIndex: 100,
    backgroundColor: AppColors.surface,
    flexDirection: 'column',
    justifyContent: 'space-between', // Separa Header, Centro y Footer
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: AppColors.outlineVariant || 'rgba(0,0,0,0.05)',
  },
  sidebarHeader: {
    height: 60,
  },
  centeredNav: {
    flex: 1,
    justifyContent: 'center', // Centra la navegación verticalmente
    width: '100%',
  },
  drawerSection: {
    backgroundColor: 'transparent',
  },
  drawerItem: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  sidebarFooter: {
    paddingBottom: 30,
    width: '100%',
    alignItems: 'center',
  },

  // ESTILOS MÓVIL (BOTTOM BAR)
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: AppColors.surface,
  },
  bottomBar: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 15 : 5,
  },
  bottomBarBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});