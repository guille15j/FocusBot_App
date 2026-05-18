import React, { useMemo, useState, useContext } from 'react';
import { View, useColorScheme, ScrollView, RefreshControl, StyleSheet } from 'react-native';
import { Text, SegmentedButtons, ActivityIndicator, IconButton, Surface } from 'react-native-paper';

import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { getColors, getglobalStyles } from '../../theme/theme';

import GridBots from '../../components/bots/BotsGrid';
import CustomAnimatedFAB from '../../components/common/CustomAnimatedFAB';
import LinkBotModal from '../../components/bots/LinkBotModal';
import EditBotModal from '../../components/bots/EditBotModal';

import { BotContext } from '../../context/BotContext';

export default function BotsPage() {
  const scheme = useColorScheme();
  const { isWeb, platform } = useResponsiveLayout();
  
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);
  
  const { bots, loading, refresh, linkNewBot, updateBot, deleteBot } = useContext(BotContext);
  
  const [value, setValue] = useState('IDLE'); 
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedBot, setSelectedBot] = useState(null);
  const [isExtended, setIsExtended] = useState(true);

  // Paleta de colores para los estados del texto, icono y fondo activo
  const ESTADOS_COLORES = {
    IDLE: '#4CAF50',      // Verde Disponible
    FOCUSING: '#9C27B0',  // Morado Enfocado
    OFFLINE: '#757575',   // Gris Desconectado
  };

  // Configuración de los botones con bordes neutros constantes
  const buttons = [
    { 
      value: 'IDLE', 
      label: 'Disponible', 
      icon: 'robot-happy',
      checkedColor: ESTADOS_COLORES.IDLE,
      style: value === 'IDLE' ? { backgroundColor: ESTADOS_COLORES.IDLE + '12' } : {}
    },
    { 
      value: 'FOCUSING', 
      label: 'Enfocado', 
      icon: 'robot-angry',
      checkedColor: ESTADOS_COLORES.FOCUSING,
      style: value === 'FOCUSING' ? { backgroundColor: ESTADOS_COLORES.FOCUSING + '12' } : {}
    },
    { 
      value: 'OFFLINE', 
      label: 'Desconectado', 
      icon: 'robot-off',
      checkedColor: ESTADOS_COLORES.OFFLINE,
      style: value === 'OFFLINE' ? { backgroundColor: ESTADOS_COLORES.OFFLINE + '12' } : {}
    },
  ];

  const currentLabel = useMemo(() => {
    const btn = buttons.find(b => b.value === value);
    return btn ? btn.label.toLowerCase() : 'disponible';
  }, [value]);

  const filteredBots = useMemo(() => {
    const safeBots = Array.isArray(bots) ? bots : [];
    return safeBots.filter(bot => bot.status === value);
  }, [bots, value]);

  const onScroll = ({ nativeEvent }) => {
    const currentScrollOffset = nativeEvent.contentOffset.y;
    setIsExtended(currentScrollOffset <= 0);
  };

  return (
    <ScreenWrapper withScroll={false}>
      <View style={isWeb ? globalStyles.container_web : globalStyles.container_movil}>
        <Text style={[globalStyles.tituloPagina, styles.pageTitle]}>Mis Bots</Text>
        
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          style={styles.segmentedButtons}
          buttons={buttons}
          theme={{
            colors: {
              // Elimina el contenedor rosa que viene por defecto en la librería
              secondaryContainer: 'transparent', 
              // Fuerza a que la línea exterior y divisoria use el borde constante del tema
              outline: colors.border || 'rgba(0,0,0,0.12)'
            }
          }}
        />

        {loading ? (
          <ActivityIndicator style={styles.loader} color={colors.primary} />
        ) : (
          <ScrollView 
            onScroll={onScroll} 
            scrollEventThrottle={16} 
            style={styles.scrollContainer}
            contentContainerStyle={{ 
              paddingBottom: isWeb ? 20 : (platform === 'ios' ? 50 : 75) 
            }}
            refreshControl={
              <RefreshControl 
                refreshing={loading} 
                onRefresh={refresh}
                colors={[colors.primary]} 
                tintColor={colors.primary}
              />
            }
          >
            {filteredBots.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Surface style={[styles.emptyCard, { backgroundColor: colors.surface }]}>
                  <IconButton icon="robot-off" size={48} iconColor={colors.placeholder} />
                  <Text style={[styles.emptyText, { color: colors.placeholder }]}>
                    No hay ningún FocusBot {currentLabel} en este momento.
                  </Text>
                </Surface>
              </View>
            ) : (
              <GridBots 
                numColumns={isWeb ? 5 : 2} 
                data={filteredBots} 
                AppColors={colors} 
                onClick={(bot) => {
                  setSelectedBot(bot);     
                  setEditModalVisible(true); 
                }}
              />
            )}
          </ScrollView>
        )}
        
        <CustomAnimatedFAB 
          icon="plus"
          label="Añadir bot"
          onPress={() => setLinkModalVisible(true)}
          isExtended={isExtended}
        />

        <LinkBotModal 
          visible={linkModalVisible}
          onDismiss={() => setLinkModalVisible(false)}
          onLink={linkNewBot}
        />
        
        <EditBotModal 
          visible={editModalVisible}
          bot={selectedBot}
          onDismiss={() => {
            setEditModalVisible(false);
            setSelectedBot(null);
          }}
          onUpdate={updateBot}
          onDelete={deleteBot}
        />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  pageTitle: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  segmentedButtons: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  loader: {
    marginTop: 40,
  },
  scrollContainer: {
    flex: 1,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  emptyCard: {
    width: '100%',
    maxWidth: 400,
    padding: 30,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dotted',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.12)',
    elevation: 0,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    paddingHorizontal: 16,
  },
});