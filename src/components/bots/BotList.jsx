import React from 'react';
import { FlatList, StyleSheet, Text, View, Divider } from 'react-native';
import BotListTile from './BotListTile';
import { globalStyles, AppColors } from '../../theme/theme';
import {Dimensions } from 'react-native';
import BotTile from './BotListTile';

const screenWidth = Dimensions.get('window').width;

const ListaBots = ({ data }) => {
  
  const renderItem = ({ item }) => (
    <BotTile item={item}/>
  );

return (
  <View style={styles.container}>
    <Text variant="headlineMedium" style={styles.titulo}>Actividades</Text>

    <FlatList
      data={data}
      renderItem={({ item }) => (
        <BotTile item={item} onPress={console.log("h")} />
      )}
      keyExtractor={(item, index) => item.bot_id?.toString() ?? index.toString()}
      ItemSeparatorComponent={Divider}
    />
  </View>
);

};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: AppColors.accent, 
    padding: 5, 
    // width: screenWidth - 50
  },
  titulo: { textAlign: 'center', marginBottom: 20 },
  listado :{padding: 50}
});

export default ListaBots;