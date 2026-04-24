import React, { useMemo, useState } from 'react';
import { View, useColorScheme,ScrollView } from 'react-native';
import { Text, SegmentedButtons } from 'react-native-paper';

import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { getColors, getglobalStyles } from '../../theme/theme'

import GridBots from '../../components/bots/BotsGrid';
import CustomAnimatedFAB from '../../components/common/CustomAnimatedFAB';
import LinkBotModal from '../../components/bots/LinkBotModal';
import EditBotModal from '../../components/bots/EditBotModal';

export default function BotsPage() {
  const scheme = useColorScheme();
  const { isWeb, platform } = useResponsiveLayout();
  
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);
  
  const [value, setValue] = React.useState('IDLE'); // Valor del segmented button

  const handleFabPress = () => {
    setLinkModalVisible(true);
  };
  
  const [linkModalVisible, setLinkModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedBot, setSelectedBot] = useState(null);

  const [isExtended, setIsExtended] = useState(true);
  const onScroll = ({ nativeEvent }) => {
    const currentScrollOffset = nativeEvent.contentOffset.y;
    setIsExtended(currentScrollOffset <= 0);
  };

  const botsData = [
    { bot_id: "BOT001", name: "FocusBot Alpha", ssid: "FocusNet_Alpha", mac_address: "00:1A:7D:DA:71:13", status: "IDLE", version: "1.2.3", last_sync: "2026-04-17T19:45:00" },
    { bot_id: "BOT002", name: "FocusBot Beta", ssid: "FocusNet_Beta", mac_address: "00:1A:7D:DA:71:14", status: "OFFLINE", version: "1.2.3", last_sync: "2026-04-17T19:50:00" },
    { bot_id: "BOT003", name: "FocusBot Gamma", ssid: "FocusNet_Gamma", mac_address: "00:1A:7D:DA:71:15", status: "FOCUSING", version: "1.2.3", last_sync: "2026-04-17T19:55:00" },
  ];

  // 1. CAMBIO: useMemo para filtrar bots según el valor del SegmentedButtons
  // Esto evita re-filtrar en cada renderizado si los datos o el valor no cambian
  const filteredBots = useMemo(() => {
    
    const targetStatus = value;
    
    // 3. CAMBIO: Si no hay mapeo (no debería pasar), mostrar todos
    if (!targetStatus) return botsData;
    
    // 4. CAMBIO: Filtrado optimizado con filter
    return botsData.filter(bot => bot.status === targetStatus);
  }, [botsData, value]); // Solo se recalcula cuando cambian los bots o el valor

  return (
    <ScreenWrapper withScroll={false}>
      <View style={isWeb ? globalStyles.container_web : globalStyles.container_movil}>
        <Text style={[globalStyles.tituloPagina, { marginTop: 20 }]}>Bots Registrados</Text>
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          style={{ marginHorizontal: 20, marginVertical: 15 }}
          buttons={[
            { value: 'IDLE', label: 'Esperando' },      // Muestra bots en estado IDLE
            { value: 'OFFLINE', label: 'Apagados' },    // Muestra bots en estado OFFLINE
            { value: 'FOCUSING', label: 'Ocupados' },   // Muestra bots en estado FOCUSING
          ]}
        />
        <ScrollView 
          onScroll={onScroll} scrollEventThrottle={16} 
          style={{ flex: 1 }} // para que fucnione bn el fab custom debe de ocuapr todo lo posible
          contentContainerStyle={{ paddingBottom: isWeb ? 10 : (platform === 'ios' ? 40 : 65 )}}>
            <GridBots numColumns={isWeb ? 5 : 1} data={filteredBots} AppColors={colors} globalStyles={globalStyles} 
              onPress={(bot) => {
                setSelectedBot(bot);
                setEditModalVisible(true);
              }}
            />
          </ScrollView>
        
        <CustomAnimatedFAB 
          icon="plus"
          label="Añadir bot"
          onPress={handleFabPress}
          isExtended={isExtended}
        />

        <LinkBotModal 
          visible={linkModalVisible}
          onDismiss={() => setLinkModalVisible(false)}
        />
        
        <EditBotModal 
          visible={editModalVisible}
          onDismiss={() => setEditModalVisible(false)}
          colors={colors}
          isWeb={isWeb}
          bot={selectedBot}
        />

      </View>
    </ScreenWrapper>
  );
}