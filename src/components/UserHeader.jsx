import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Avatar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors, theme } from '../theme/theme';

const UserHeader = ({ user }) => {
  if (!user) return null;

  return (
    <SafeAreaView edges={['top']} style={styles.topBarContainer}>
      <View style={styles.userContainer}>
        <Avatar.Icon 
          size={40} 
          icon="account" 
          style={theme.avatarCircle} 
          color="white" 
        />
        <Text style={styles.userName}>
          {user.first_name} {user.last_name}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topBarContainer: {
    backgroundColor: AppColors.secondary,
    elevation: 2,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    paddingTop: Platform.OS === 'web' ? 10 : 0, // Ajuste para web
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 16
  },
});

export default UserHeader;