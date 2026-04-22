import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import BotListTile from './BotListTile';
import { Divider } from 'react-native-paper';

const ListaBots = ({ data, colors }) => {
  
  const renderItems = ({ item }) => (
    <BotListTile item={item} AppColors={colors} onPress={() => console.log("Bot presionado")} />
  );

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.titulo}>Bots</Text>
      <FlatList
        style={{ backgroundColor: colors.surface }}
        data={data}
        renderItem={renderItems}
        keyExtractor={(item, index) => item.bot_id?.toString() ?? index.toString()}
        ItemSeparatorComponent={() => <Divider />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 5, 
  },
  titulo: { textAlign: 'center', marginBottom: 20 },
  listado: { padding: 50 }
});

export default ListaBots;