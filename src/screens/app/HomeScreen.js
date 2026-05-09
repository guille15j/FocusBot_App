import React, { useContext, useMemo, useState } from 'react';
import { View, StyleSheet, useColorScheme } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Text, FAB, Portal, ActivityIndicator } from 'react-native-paper';

import { getColors, getglobalStyles } from '../../theme/theme';

import UserHeader         from '../../components/common/UserHeader';
import BotCarousel        from '../../components/bots/BotCarrusel';
import ActivitiesList     from '../../components/activities/ActivitiesList';
import LinkBotModal       from '../../components/bots/LinkBotModal';
import { ScreenWrapper }  from '../../components/layout/ScreenWrapper';

//CUSTOM HOOKS
import { useActivities }        from '../../hooks/useActivities';
import { useResponsiveLayout }  from '../../hooks/useResponsiveLayout';

//CONTEXTOS
import { AuthContext }  from '../../context/AuthContext';
import { BotContext }   from '../../context/BotContext';

export default function HomeScreen({ navigation }) {
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);

  const { user, signOut } = useContext(AuthContext);
   const { bots, loading: loadingBots, linkNewBot, updateBot, deleteBot } = useContext(BotContext);

  const isFocused = useIsFocused();
  const [open, setOpen] = React.useState(false);

  // Llamamos al hook con autoRefresh activo cada 60 segundos
  const { activities, loading } = useActivities(true, 60000);
  

  // Seleccionamos solo las 10 actividades más recientes para no saturar la pantalla de informacion irrelevante
  const recentActivities = useMemo(() => {
    if (Array.isArray(activities)) {
      return activities.slice(0, 10);
    }
    // Si no es un array (está cargando o hubo error), devolvemos array vacío
    return [];
  }, [activities]);

  const ejecutarLogout = async () => {
    await signOut();
    console.log("Sesión cerrada");
  };

  return (
    <ScreenWrapper withScroll={true}>
      <View style={isWeb ? globalStyles.container_web : globalStyles.container_movil}>
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
            // bots = {BOTS_DATA}
            onAddPress={() => console.log("Añadir nuevo bot")}
            onBotPress={(bot) => console.log("Seleccionado:", bot.name)}
            globalStyles={globalStyles}
            addProp = {true}
          />
          <Text variant="titleLarge" style={{textAlign: 'center', marginVertical:  8, color: colors.text,}}>
            Actividades Recientes
          </Text>
          {loading && activities.length === 0 ? (
            <ActivityIndicator animating={true} color={colors.primary} style={{ marginVertical: 20 }} />
          ) : (
            <ActivitiesList 
              activities={recentActivities} 
              // Navegamos a la pantalla principal de actividades al pulsar
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
    </ScreenWrapper>
  );
}