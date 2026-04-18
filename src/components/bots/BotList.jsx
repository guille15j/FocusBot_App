import React from 'react';
import { FlatList, StyleSheet, Text, View, Divider } from 'react-native';
import BotListTile from './BotListTile';
import { globalStyles, AppColors } from '../../theme/theme';
import {Dimensions } from 'react-native';
import BotTile from './BotListTile';

const screenWidth = Dimensions.get('window').width;

const ListaBots = ({ data , colors }) => {
  
  const renderItems = ({ item }) => (
    <BotTile item={item} AppColors ={colors} onPress={console.log("h")}/>
  );

return (
  <View style={styles.container}>
    <Text variant="headlineMedium" style={styles.titulo}>Actividades</Text>

    <FlatList
      style = {{backgroundColor: colors.surface}}
      data={data}
      renderItem= {renderItems}
      keyExtractor={(item, index) => item.bot_id?.toString() ?? index.toString()}
      ItemSeparatorComponent={Divider}
    />
  </View>
);

};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    // backgroundColor: AppColors.accent, 
    padding: 5, 
    // width: screenWidth - 50
  },
  titulo: { textAlign: 'center', marginBottom: 20 },
  listado :{padding: 50}
});

export default ListaBots;