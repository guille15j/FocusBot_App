import React, { useContext, useMemo, useState, useCallback } from 'react';
import { View, StyleSheet, useColorScheme, ScrollView, RefreshControl, Platform } from 'react-native'; 
import { useIsFocused } from '@react-navigation/native';
import { Text, FAB, Portal, ActivityIndicator } from 'react-native-paper';

import { getColors, getglobalStyles } from '../../theme/theme';

import UserHeader         from '../../components/common/UserHeader';
import BotCarousel        from '../../components/bots/BotCarrusel';
import ActivitiesList     from '../../components/activities/ActivitiesList';
import LinkBotModal       from '../../components/bots/LinkBotModal';
import { ScreenWrapper }  from '../../components/layout/ScreenWrapper';
import {BottomNav}        from '../../navigation/BottomTabs'

//CUSTOM HOOKS
import { useResponsiveLayout }  from '../../hooks/useResponsiveLayout';

//CONTEXTOS
import { AuthContext }  from '../../context/AuthContext';
import { BotContext }   from '../../context/BotContext';
import { ActivityContext }  from '../../context/ActivityContext';
import { useToast } from '../../context/ToastContext';

export default function HomeScreen({ navigation }) {
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const showToast = useToast();
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);

  const { user, signOut } = useContext(AuthContext);
  
  const { bots, loading: loadingBots, linkNewBot, refresh: refreshBots } = useContext(BotContext);
  const { activities, loading: loadingActs, refresh: refreshActs } = useContext(ActivityContext);

  const isFocused = useIsFocused();
  const [open, setOpen] = React.useState(false);
  
  const isRefreshing = loadingBots || loadingActs;

  const onRefresh = useCallback(async () => {
    
    showToast("HomeScreen: Refrescando datos de API...");
    console.log("HomeScreen: Refrescando datos de API...");
    try {
      // Ejecutamos ambas peticiones al servidor en paralelo
      await Promise.all([
        refreshBots ? refreshBots() : Promise.resolve(),
        refreshActs ? refreshActs() : Promise.resolve()
      ]);
    } catch (error) {
      console.error("Error al sincronizar con la API en Home:", error);
    }
  }, [refreshBots, refreshActs]);

  const recentActivities = useMemo(() => {
    if (Array.isArray(activities)) {
      return activities.slice(0, 10);
    }
    return [];
  }, [activities]);

  const ejecutarLogout = async () => {
    await signOut();
    console.log("Sesión cerrada");
  };

  return (
    <ScreenWrapper withScroll={false}>
      <View style={isWeb ? globalStyles.container_web : globalStyles.container_movil}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl 
              refreshing={isRefreshing} 
              onRefresh={onRefresh} 
              colors={[colors.primary]} 
              tintColor={colors.primary}
            />
          }
        >
          {!isWeb && 
            <UserHeader user={user || { 
              first_name: 'Nombre', 
              last_name: 'Apellido', 
              email: 'invitado@focusbot.com' }}  navigation={navigation}
            />
          }
          <View style={{ paddingBottom: isWeb ? 10 : 80 }}>
            {isWeb && <UserHeader user={user || { first_name: 'Nombre', last_name: 'Apellido', email: 'invitado@focusbot.com' }} />}
            
            <BotCarousel 
              bots={bots} 
              onAddPress={() => setLinkModalVisible(true)}
              onBotPress={(bot) => console.log("Seleccionado:", bot.name)}
              globalStyles={globalStyles}
              addProp = {true}
            />

            <Text variant="titleLarge" style={{textAlign: 'center', marginVertical:  8, color: colors.text,}}>
              Actividades Recientes
            </Text>

            {/* Spinner central solo si no hay datos y está cargando */}
            {isRefreshing && activities.length === 0 ? (
              <ActivityIndicator animating={true} color={colors.primary} style={{ marginVertical: 20 }} />
            ) : (
              <ActivitiesList 
                activities={recentActivities} 
                onActivityPress={(activity) => navigation.navigate('Activities')}
                globalStyles={globalStyles} 
              />
            )}
          </View>

          <LinkBotModal 
            visible={linkModalVisible}
            onDismiss={() => setLinkModalVisible(false)}
            onLink={linkNewBot}
          />
        </ScrollView>

      </View>
      <Portal>
        <FAB.Group
          open={open}
          visible={isFocused}
          icon={open ? 'close' : 'plus'}
          actions={[
            {
              icon: 'robot',
              label: 'Nuevo Bot',
              onPress: () => setLinkModalVisible(true),
              style: { backgroundColor: colors.secondary,},
              color: colors.background,
            },
            {
              icon: 'calendar',
              label: 'Nueva Actividad',
              onPress: () => navigation.navigate('CreateActivity'),
              style: { backgroundColor: colors.secondary, marginBottom: isWeb ? 10: 100 },
              color: colors.background,
              labelStyle: {marginBottom: isWeb ? 10: 100 }
            },
          ]}
          onStateChange={({ open }) => setOpen(open)}
          fabStyle={
            { 
            backgroundColor: open ? colors.placeholder : colors.primary,
            bottom: isWeb ? 20 : 100,
            }
          }
          color={colors.background}
          backdropColor="rgba(0,0,0,0.5)"
        />
      </Portal>

      {/* <BottomNav navigation={navigationRef.current} /> */}

    </ScreenWrapper>
  );
}