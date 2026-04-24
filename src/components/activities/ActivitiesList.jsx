import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, useColorScheme, Platform } from 'react-native';
import { Divider, Surface, Text } from 'react-native-paper';
import { getColors } from '../../theme/theme';
import ActivityListTile from './ActivityListTile';

const ActivitiesList = ({ activities = [], onActivityPress, globalStyles }) => {
  const scheme = useColorScheme();
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const isWeb = Platform.OS === 'web';

  const renderItem = ({ item }) => (
    <ActivityListTile 
      item={item} 
      AppColors={colors} 
      onInfoPress={onActivityPress}
    />
  );

  return (
    <View style={styles.mainContainer}>
      <Surface 
        style={[
          styles.surfaceList, 
          isWeb && styles.webWidth,
          { backgroundColor: colors.surface + 80 }
        ]} 
        elevation={1}
      >
        <FlatList
          data={activities}
          keyExtractor={(item) => item.activity_id.toString()}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <Divider style={styles.divider} />}
          scrollEnabled={false}
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
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20
  },
  surfaceList: {
    width: '100%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  webWidth: {},
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