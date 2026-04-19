import React from 'react';
import { View, useColorScheme, ScrollView, StyleSheet } from 'react-native';
import { Text, SegmentedButtons } from 'react-native-paper';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { getglobalStyles, updateAppColors } from '../../theme/theme';

import GridBots from '../../components/bots/BotsGrid';

export default function BotsPage() {
  const scheme = useColorScheme();
  const AppColors = updateAppColors(scheme);
  const globalStyles = getglobalStyles(scheme);
  const { isWeb } = useResponsiveLayout();
  const styles = getStyles(AppColors);

  
  const [value, setValue] = React.useState('IDLE');

  const botsData = [
  {
    bot_id: "BOT001",
    name: "FocusBot Alpha",
    ssid: "FocusNet_Alpha",
    mac_address: "00:1A:7D:DA:71:13",
    status: "IDLE",
    version: "1.2.3",
    last_sync: "2026-04-17T19:45:00",
  },
  {
    bot_id: "BOT002",
    name: "FocusBot Beta",
    ssid: "FocusNet_Beta",
    mac_address: "00:1A:7D:DA:71:14",
    status: "OFFLINE",
    version: "1.2.3",
    last_sync: "2026-04-17T19:50:00",
  },
  {
    bot_id: "BOT003",
    name: "FocusBot Beta",
    ssid: "FocusNet_Beta",
    mac_address: "00:1A:7D:DA:71:14",
    status: "FOCUSING",
    version: "1.2.3",
    last_sync: "2026-04-17T19:50:00",
  },
  {
    bot_id: "BOT004",
    name: "FocusBot Beta",
    ssid: "FocusNet_Beta",
    mac_address: "00:1A:7D:DA:71:14",
    status: "OFFLINE",
    version: "1.2.3",
    last_sync: "2026-04-17T19:50:00",
  },
  {
    bot_id: "BOT005",
    name: "FocusBot Beta",
    ssid: "FocusNet_Beta",
    mac_address: "00:1A:7D:DA:71:14",
    status: "IDLE",
    version: "1.2.3",
    last_sync: "2026-04-17T19:50:00",
  },
  ];

  return (
    <ScreenWrapper>
      <View style={(isWeb ? globalStyles.container_web : globalStyles.container_movil)}>
        <SafeAreaView style={(isWeb ? { height: '100dvh' } : { height: '100%' })}>
          
          <Text style={[globalStyles.tituloPagina, ]}>Bots Registrados</Text>
          
          <SegmentedButtons
            value={value}
            onValueChange={setValue}
            style={{marginHorizontal: 20, marginVertical: 15}}
            buttons={[
              { value: 'IDLE', label: 'Esperando' },
              {
                value: 'SLEEP',
                label: 'Apagados',
              },
              {
                value: 'FOCUSSED',
                label: 'Ocupados',
              },
            ]}
          />

          <GridBots numColumns={2} data={botsData} AppColors={AppColors} globalStyles={globalStyles}></GridBots>
          
          {/* <ScrollView>
            <Text style={{ color: AppColors.text, padding: 20 }}>Bots...</Text>
          </ScrollView> */}
        </SafeAreaView>
      </View>
    </ScreenWrapper>
  );
}

const getStyles = (AppColors) => StyleSheet.create({});