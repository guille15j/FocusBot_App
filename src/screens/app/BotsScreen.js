import React, { useMemo, useState, useContext } from 'react';
import { View, useColorScheme, ScrollView, useWindowDimensions, RefreshControl } from 'react-native';
import { Text, SegmentedButtons, ActivityIndicator, Surface, IconButton } from 'react-native-paper';

import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { getColors, getglobalStyles } from '../../theme/theme'

import GridBots from '../../components/bots/BotsGrid';
import CustomAnimatedFAB from '../../components/common/CustomAnimatedFAB';
import LinkBotModal from '../../components/bots/LinkBotModal';
import EditBotModal from '../../components/bots/EditBotModal';

import { BotContext } from '../../context/BotContext';

export default function BotsPage() {
  const scheme = useColorScheme();
  const { isWeb, platform } = useResponsiveLayout();
  const { width: windowWidth } = useWindowDimensions();
  
  const CARD_WIDTH = isWeb ? windowWidth * 0.5 : windowWidth * 0.85;
  const SPACING = 10;
  const FULL_ITEM_WIDTH = CARD_WIDTH + SPACING;
  
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);
  const AppColors = useMemo(() => getColors(scheme), [scheme]);
  
  // Extraemos todo lo necesario del contexto de Bots
  const { bots, loading, refresh, linkNewBot, updateBot, deleteBot } = useContext(BotContext);
  const [value, setValue] = React.useState('IDLE'); 
  const [label, setLabel] = useState('Esperando');
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedBot, setSelectedBot] = useState(null);
  const [isExtended, setIsExtended] = useState(true);

  const buttons = [
    { value: 'IDLE', label: 'Esperando' },
    { value: 'OFFLINE', label: 'Apagado' },
    { value: 'FOCUSING', label: 'Ocupado' },
  ];

  // Esto evita re-filtrar en cada renderizado si los datos o el valor no cambian
  const filteredBots = useMemo(() => {
    return bots.filter(bot => bot.status === value);
  }, [bots, value]);

  const handleFabPress = () => {
    setLinkModalVisible(true);
  };
  
  const onScroll = ({ nativeEvent }) => {
    const currentScrollOffset = nativeEvent.contentOffset.y;
    setIsExtended(currentScrollOffset <= 0);
  };

  const handleChange = (newValue) => {
    setValue(newValue);

    const btn = buttons.find(b => b.value === newValue);
    setLabel(btn?.label ?? '');
  };

  return (
    <ScreenWrapper withScroll={false}>
      <View style={isWeb ? globalStyles.container_web : globalStyles.container_movil}>
        <Text style={[globalStyles.tituloPagina, { marginTop: 20 }]}>Mis Bots</Text>
        <SegmentedButtons
          value={value}
          onValueChange={handleChange}
          style={{ marginHorizontal: 20, marginVertical: 15 }}
          buttons={buttons}
        />

          {loading ? (
            <ActivityIndicator style={{ marginTop: 20 }} color={colors.primary} />
          ):(
            <ScrollView 
              onScroll={onScroll} scrollEventThrottle={16} 
              style={{ flex: 1 }} // para que fucnione bn el fab custom debe de ocuapr todo lo posible
              contentContainerStyle={{ paddingBottom: isWeb ? 10 : (platform === 'ios' ? 40 : 65 )}}
              refreshControl={
                <RefreshControl 
                  refreshing={loading} 
                  onRefresh= {refresh}
                  colors={[colors.primary]} 
                  tintColor={colors.primary}
                />
              }
            >

                {filteredBots.length === 0 ? (
                  <View style={{  alignItems: 'center'}}>
                    <View style={[globalStyles.card, {width : FULL_ITEM_WIDTH}]}>
                      <View style={[{ backgroundColor: AppColors.surface, alignItems: 'center', }]}>
                        <IconButton icon="robot-off" size={40} iconColor={AppColors.placeholder} />
                        <Text style={{ color: AppColors.placeholder, textAlign: 'center', paddingHorizontal: 20 }}>
                          No hay ningún FocusBot {label.toLowerCase()}.
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <GridBots 
                    numColumns={isWeb ? 5 : 1} 
                    data={filteredBots} 
                    AppColors={colors} 
                    globalStyles={globalStyles} 
                    onPress={(bot) => {
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
          onPress={handleFabPress}
          isExtended={isExtended}
        />

        <LinkBotModal 
          visible={linkModalVisible}
          onDismiss={() => setLinkModalVisible(false)}
          onLink={linkNewBot}
        />
        
        <EditBotModal 
          visible={editModalVisible}
          bot={selectedBot}           // Pasamos el bot que guardamos en el paso anterior
          onDismiss={() => {
            setEditModalVisible(false);
            setSelectedBot(null);     // Limpiamos al cerrar
          }}
          onUpdate={updateBot}        // Función que viene del contexto
          onDelete={deleteBot}        // Función que viene del contexto
        />

      </View>
    </ScreenWrapper>
  );
}