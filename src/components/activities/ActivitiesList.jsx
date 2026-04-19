import React from 'react';
import { View, StyleSheet, FlatList, useColorScheme, Platform } from 'react-native';
import { Divider, Surface, Text } from 'react-native-paper';
import { updateAppColors } from '../../theme/theme';
import ActivityListTile from './ActivityListTile';

const ActivitiesList = ({ activities = [], onActivityPress, globalStyles }) => {
  const scheme = useColorScheme();
  const AppColors = updateAppColors(scheme);
  const isWeb = Platform.OS === 'web';

  const renderItem = ({ item }) => (
    <ActivityListTile 
      item={item} 
      AppColors={AppColors} 
      onInfoPress={onActivityPress}
    />
  );

  return (
    <View style={styles.mainContainer}>
      <Surface 
        style={[
          styles.surfaceList, 
          isWeb && styles.webWidth,
          { backgroundColor: AppColors.surface }
        ]} 
        elevation={1}
      >
        <FlatList
          data={activities}
          keyExtractor={(item) => item.activity_id.toString()}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider style={styles.divider} />}
          scrollEnabled={!isWeb} // En web suele controlarlo el scroll general
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay actividades registradas</Text>
          }
        />
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    // width: '100%',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20
  },
  surfaceList: {
    width: '100%', // Un poco de margen en móvil
    borderRadius: 15,
    overflow: 'hidden',
  },
  webWidth: {
    // width: '60%', // Más estrecho en web para no estirar los textos
    // maxWidth: 800,
  },
  listContent: {
    paddingVertical: 8,
  },
  divider: {
    marginHorizontal: 16,
    height: 1,
    opacity: 0.5,
  },
  emptyText: {
    textAlign: 'center',
    padding: 20,
    opacity: 0.6,
  }
});

export default ActivitiesList;