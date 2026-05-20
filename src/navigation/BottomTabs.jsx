import React, { useContext, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Dimensions, useColorScheme } from 'react-native';
import { useNavigationState } from '@react-navigation/native';
import { Drawer, IconButton, Surface } from 'react-native-paper';

// Rutas relativas correctas desde src/navigation/ hacia el resto de carpetas
import { getColors } from '../theme/theme';
import { AuthContext } from '../context/AuthContext';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';

const { width } = Dimensions.get('window');
const isLargeScreen = width >= 768;

export default function BottomNav({ navigation }) {
  const scheme = useColorScheme(); 
  const colors = useMemo(() => getColors(scheme), [scheme]);
  
  const currentRouteName = useNavigationState((state) => {
    if (!state || !state.routes) return 'Home';
    const route = state.routes[state.index];
    return route?.name || 'Home';
  });

  const { isWeb, platform } = useResponsiveLayout();
  const useSidebar = isWeb && isLargeScreen;
  const { signOut } = useContext(AuthContext);

  const styles = getStyles(colors, useSidebar);

  const isActivityRelated = currentRouteName === 'Activities' || currentRouteName === 'CreateActivity';

  const navItems = [    
    { name: 'Home', icon: 'home', iconOutline: 'home-outline' },
    { name: 'Bots', icon: 'robot', iconOutline: 'robot-outline' },
    { name: 'Activities', icon: 'calendar', iconOutline: 'calendar-outline' },
    { name: 'Records', icon: 'clock-outline', iconOutline: 'clock-outline' },
    { name: 'Profile', icon: 'account', iconOutline: 'account-outline' },
  ];

  const navItems_app = [    
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

  // RENDERIZADO PARA WEB (SIDEBAR LATERAL)
  if (useSidebar) {
    return (
      <Surface style={styles.sidebarContainer} elevation={1}>
        <View style={styles.sidebarHeader} />
        <View style={styles.centeredNav}>
          <Drawer.Section showDivider={false} style={styles.drawerSection}>
            {navItems.map((item) => {
              const isActive = item.name === 'Activities' ? isActivityRelated : currentRouteName === item.name;

              return (
                <Drawer.Item
                  key={item.name}
                  label={item.name}
                  icon={isActive ? item.icon : item.iconOutline}
                  active={isActive}
                  onPress={() => handleNavigation(item.name)}
                  style={styles.drawerItem}
                  activeColor={colors.background || '#ffffff'}
                  rippleColor={colors.primary}
                  theme={{
                    colors: {
                      secondaryContainer: colors.primary, 
                    }
                  }}
                />
              );
            })}
          </Drawer.Section>
        </View>
        <View style={styles.sidebarFooter}>
          <IconButton icon="help" size={24} iconColor={colors.placeholder} />
          <IconButton icon="logout" size={24} iconColor={colors.placeholder} onPress={ejecutarLogout} />
        </View>
      </Surface>
    );
  }

  // RENDERIZADO PARA MÓVIL (BARRA INFERIOR)
  return (
    <Surface style={styles.bottomBarContainer} elevation={4}>
      <View style={styles.bottomBar}>
        {navItems_app.map((item) => {
          const isActive = item.name === 'Activities' ? isActivityRelated : currentRouteName === item.name;

          return (
            <TouchableOpacity
              key={item.name}
              onPress={() => handleNavigation(item.name)}
              style={styles.bottomBarBtn}
              activeOpacity={0.7}
            >
              <View style={isActive ? styles.activeWrapper : null}>
                <IconButton
                  icon={isActive ? item.icon : item.iconOutline}
                  iconColor={isActive ? (colors.background || '#ffffff') : (colors.placeholder || '#757575')}
                  size={isActive ? 28 : 24}
                  style={isActive ? styles.iconActive : styles.iconBase}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </Surface>
  );
}

const getStyles = (colors, useSidebar) => StyleSheet.create({
  sidebarContainer: {
    position: isLargeScreen && isWeb ? 'fixed' : 'absolute',
    top: 0, 
    left: 0,
    bottom: 0,
    width: 80,
    zIndex: 100,
    backgroundColor: colors.surface,
    flexDirection: 'column',
    borderRightWidth: 1,
    borderRightColor: colors.border || 'rgba(0,0,0,0.08)',
  },
  sidebarHeader: {
    height: 60,
  },
  centeredNav: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  drawerSection: {
    backgroundColor: 'transparent',
  },
  drawerItem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignSelf: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  sidebarFooter: {
    paddingBottom: 30,
    width: '100%',
    alignItems: 'center',
    gap: 10
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border || 'rgba(0,0,0,0.05)',
  },
  bottomBar: {
    height: platform === 'ios' ? 76 : 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: platform === 'ios' ? 16 : 0,
  },
  bottomBarBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeWrapper: {
    borderRadius: 100,
    backgroundColor: 'transparent',
  },
  iconBase: {
    backgroundColor: 'transparent',
    margin: 0,
  },
  iconActive: {
    backgroundColor: colors.primary,
    borderRadius: 100,
    margin: 0,
  }
});