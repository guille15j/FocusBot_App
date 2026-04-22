import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import BotCard from './BotCard';

const GridBots = ({ data, numColumns, AppColors, globalStyles }) => {
  return (
    <FlatList
      style={[
        styles.container, 
        { backgroundColor: AppColors.surface }
      ]}
      data={data}
      renderItem={({ item }) => <BotCard item={item} AppColors={AppColors} globalStyles={globalStyles} />}
      keyExtractor={item => item.bot_id}
      numColumns={numColumns}
      columnWrapperStyle={numColumns > 1 ? styles.columnWrapper : undefined}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    maxHeight: 500,
    margin: 16,
    borderRadius: 16,
    flex: 1,
    flexGrow: 1
  },
  columnWrapper: {
    justifyContent: 'space-between'
  }
});

export default GridBots;