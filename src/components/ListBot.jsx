import React from 'react';
import { FlatList, View, StyleSheet, Dimensions } from 'react-native';
import { List, Divider, Text } from 'react-native-paper';
import BotTile from './BotListTile';
import { AppColors } from '../theme/theme';

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
        renderItem={renderItem} 
        keyExtractor={item => item.id}
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
    width: screenWidth - 50
  },
  titulo: { textAlign: 'center', marginBottom: 20 },
  listado :{padding: 50}
});

export default ListaBots;