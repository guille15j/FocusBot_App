import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { Card, Text, IconButton, Avatar } from 'react-native-paper'; 
import { globalStyles, AppColors } from '../theme/theme';
import BotCard from './BotCard';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const GridBots = ({ data,  numColumns }) => {

   return (
    <FlatList
        style={styles.container}
        data={data}
        renderItem={({ item }) => <BotCard item={item} />}
        keyExtractor={item => item.bot_id}
        numColumns={numColumns}
        columnWrapperStyle={styles.columnWrapper}
        
    />
  );
};

const styles = StyleSheet.create({
    container:{
        width: screenWidth - 50,
        padding: 10,
        maxHeight: 500,
        backgroundColor: AppColors.background,
        margin: 16,
        borderRadius: 16,
        shadowColor: AppColors.primary,
    },
});


export default GridBots;