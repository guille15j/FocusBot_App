import React from 'react';
import { FlatList, StyleSheet, Dimensions } from 'react-native';
import BotCard from './BotCard';
// import { AppColors } from '../../theme/theme';

const screenWidth = Dimensions.get('window').width;


const GridBots = ({ data,  numColumns, AppColors, globalStyles}) => {
    
    // this.AppColors = AppColors;

   return (
    <FlatList
        style={[
            styles.container, 
            { 
                backgroundColor: AppColors.surface, 
                // shadowColor: AppColors.primary 
            }
        ]}
        data={data}
        renderItem={({ item }) => <BotCard item={item} AppColors={AppColors} globalStyles={globalStyles} />}
        keyExtractor={item => item.bot_id}
        numColumns={numColumns}
        columnWrapperStyle={styles.columnWrapper}
        
    />
  );
};

const styles = StyleSheet.create({
    container:{
        // width: screenWidth - 50,
        padding: 10,
        maxHeight: 500,
        // backgroundColor: AppColors.background,
        margin: 16,
        borderRadius: 16,
        // shadowColor: AppColors.primary,
        flex:1,
        flexGrow: 1
    },
});


export default GridBots;