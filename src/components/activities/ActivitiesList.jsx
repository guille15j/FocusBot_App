import React, { useMemo } from 'react';
import { View, StyleSheet, FlatList, useColorScheme, Platform } from 'react-native';
import { Divider, Surface, Text, Icon } from 'react-native-paper';
import { getColors } from '../../theme/theme';
import ActivityListTile from './ActivityListTile';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

const ActivitiesList = ({ activities = [], onActivityPress, globalStyles }) => {
  const scheme = useColorScheme();
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const { isWeb, platform } = useResponsiveLayout();

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
            <View style={{ padding: 50, alignItems: 'center',}}>
              <Icon source="robot-happy" size={50} color={colors.placeholder}/>
              <Text variant="bodyLarge" style={{ color: colors.placeholder, textAlign: 'center' }}>
                No hay actividades.{"\n"}¡Crea la primera pulsando el botón +!
              </Text>
            </View>
          }
        />
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    alignItems: 'center',
    // marginVertical: 10,
    marginHorizontal: 16,
  },
  surfaceList: {
    width: '100%',
    borderRadius: 33,
    overflow: 'hidden',
    
    height: '100%',
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