import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import BotCard from './BotCard';

const GridBots = ({ data, numColumns = 2, AppColors, onClick }) => {
  // Forzar un mínimo de 2 columnas para mantener la estructura de rejilla visual
  const columns = numColumns <= 1 ? 2 : numColumns;

  return (
    <FlatList
      style={styles.container}
      data={data}
      renderItem={({ item }) => (
        <View style={[styles.cardWrapper, { width: `${100 / columns}%` }]}>
          <BotCard 
            item={item} 
            AppColors={AppColors} 
            onClick={onClick}
          />
        </View>
      )}
      keyExtractor={(item, index) => item?.bot_id?.toString() || `grid-bot-${index}`}
      numColumns={columns}
      columnWrapperStyle={styles.columnWrapper}
      contentContainerStyle={styles.contentContainer}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 8,
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 4,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
  cardWrapper: {
    padding: 6, // Controla la separación exacta y uniforme entre las tarjetas de la rejilla
  },
});

export default GridBots;