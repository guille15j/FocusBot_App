import React, { useMemo } from 'react';
import { View, useColorScheme } from 'react-native';
import { Text, SegmentedButtons } from 'react-native-paper';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { getColors, getglobalStyles } from '../../theme/theme';
import GridBots from '../../components/bots/BotsGrid';

export default function BotsPage() {
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();
  
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);
  
  const [value, setValue] = React.useState('IDLE');

  const botsData = [
    { bot_id: "BOT001", name: "FocusBot Alpha", ssid: "FocusNet_Alpha", mac_address: "00:1A:7D:DA:71:13", status: "IDLE", version: "1.2.3", last_sync: "2026-04-17T19:45:00" },
    { bot_id: "BOT002", name: "FocusBot Beta", ssid: "FocusNet_Beta", mac_address: "00:1A:7D:DA:71:14", status: "OFFLINE", version: "1.2.3", last_sync: "2026-04-17T19:50:00" },
    { bot_id: "BOT003", name: "FocusBot Gamma", ssid: "FocusNet_Gamma", mac_address: "00:1A:7D:DA:71:15", status: "FOCUSING", version: "1.2.3", last_sync: "2026-04-17T19:55:00" },
  ];

  return (
    <ScreenWrapper withScroll={true}>
      <View style={isWeb ? globalStyles.container_web : globalStyles.container_movil}>
        <Text style={[globalStyles.tituloPagina, { marginTop: 20 }]}>Bots Registrados</Text>
        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          style={{ marginHorizontal: 20, marginVertical: 15 }}
          buttons={[
            { value: 'IDLE', label: 'Esperando' },
            { value: 'SLEEP', label: 'Apagados' },
            { value: 'FOCUSSED', label: 'Ocupados' },
          ]}
        />
        <GridBots numColumns={2} data={botsData} AppColors={colors} globalStyles={globalStyles} />
      </View>
    </ScreenWrapper>
  );
}