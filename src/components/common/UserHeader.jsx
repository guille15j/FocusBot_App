import React, { useContext, useMemo } from 'react';
import { View, StyleSheet, Platform, useColorScheme } from 'react-native'; 
import { Avatar, Text, Button, IconButton } from 'react-native-paper';
import { getColors } from '../../theme/theme';
import { AuthContext } from '../../context/AuthContext';

const UserHeader = ({ user }) => {
  const scheme = useColorScheme();
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const isWeb = Platform.OS === 'web';
  const { signOut } = useContext(AuthContext);

  if (!user) return null;

  const ejecutarLogout = async () => {
    await signOut();
    console.log("Sesión cerrada");
  };

  const styles = getStyles(colors);

  return (
    <View style={styles.topBarContainer}>
      <View style={styles.userContainer}>
        {!isWeb && (
          <>
            <Avatar.Image size={60} source={require('../../assets/avatar.png')} />
            <View>
              <Text style={styles.userName}>{user.first_name} {user.last_name}</Text>
              <Text style={styles.userDetail}>{user.email || user.user_id}</Text>
            </View>
            <View style={{ flex: 1 }} />
            <IconButton mode="contained" icon="logout" size={20} onPress={ejecutarLogout} iconColor={colors.primary} />
          </>
        )}
        {isWeb && (
          <View style={{ flexDirection: 'row', alignItems: 'center', margin: 20 }}>
            <Avatar.Image size={100} source={require('../../assets/avatar.png')} />
            <View>
              <Text style={styles.userTittle}>¡Hola de nuevo!</Text>
              <Text style={styles.userName}>{user.first_name} {user.last_name}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const getStyles = (colors) => StyleSheet.create({
  topBarContainer: {
    backgroundColor: Platform.OS === 'web' ? 'transparent' : colors.surface,
    borderRadius: Platform.OS === 'web' ? 0 : 60,
    marginHorizontal: Platform.OS === 'web' ? 0 : 10,
    elevation: Platform.OS === 'web' ? 0 : 5,
    shadowColor: Platform.OS === 'web' ? 'transparent' : '#000',
    shadowOffset: Platform.OS === 'web' ? { width: 0, height: 0 } : { width: 0, height: 3 },
    shadowOpacity: Platform.OS === 'web' ? 0 : 0.25,
    shadowRadius: Platform.OS === 'web' ? 0 : 4,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    paddingVertical: 5,
  },
  userTittle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.primary,
    marginLeft: 16
  },
  userName: {
    fontSize: 20,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 16
  },
  userDetail: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.placeholder,
    marginLeft: 16,
    maxWidth: 200,
  },
});

export default UserHeader;