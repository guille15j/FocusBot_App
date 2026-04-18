import React, { useContext } from 'react';
import { View, StyleSheet, SafeAreaView, Platform } from 'react-native'; // ← Añadir SafeAreaView y Platform
import { Avatar, Text, Button } from 'react-native-paper';
import { AppColors } from '../../theme/theme';
import { AuthContext } from '../../context/AuthContext';
import { globalStyles } from '../../theme/theme';

const UserHeader = ({ user }) => {
  if (!user) return null;

  const { signOut } = useContext(AuthContext);

  const ejecutarLogout = async () => {
    await signOut();
    console.log("Sesión cerrada");
  };

  return (
    <SafeAreaView edges={['top']} style={styles.topBarContainer}>
      <View style={styles.userContainer}>
        <Avatar.Icon 
          size={40} 
          icon="account" 
          style={{ backgroundColor: AppColors.primary }} 
          color="white" 
        />
        <Text style={styles.userName}>
          {user.first_name} {user.last_name}
        </Text>

        <Button
                mode="outlined"
                onPress={ejecutarLogout}
                icon="logout"
              >
                Cerrar Sesión
              </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topBarContainer: {
    backgroundColor: AppColors.surface,
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
    padding: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    color: AppColors.text,
    marginLeft: 16
  },
});

export default UserHeader;