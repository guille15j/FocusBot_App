import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'; // Añadidos
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider, ActivityIndicator, Avatar } from 'react-native-paper';
import { authStorage } from './src/services/authStorage';
import { AuthContext } from './src/services/AuthContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { AppColors, theme } from './src/theme/theme';

// Importación de las Pantallas
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen'; 
import LinkBotScreen from './src/screens/LinkBotScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ResetScreen from './src/screens/ResetScreen';

const Stack = createStackNavigator();

const UserHeader = () => (
  // SafeAreaView asegura que el contenido no se pegue al notch/status bar
  <SafeAreaView edges={['top']} style={styles.topBarContainer}>
    <View style={styles.userContainer}>
      <Avatar.Icon 
        size={40} 
        icon="account" // Icono de persona de react-native-paper
        style={theme.avatarCircle} 
        color="white" // Color del icono
      />
      <Text style={styles.userName}>Juan Pérez</Text>
    </View>
  </SafeAreaView>
);

const BottomNav = ({ navigation }) => (
  <View style={styles.bottomBar}>
    <TouchableOpacity onPress={() => navigation?.navigate('Home')} style={styles.navBtn}>
      <Text>Inicio</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => navigation?.navigate('LinkBot')} style={styles.navBtn}>
      <Text>LinkBot</Text>
    </TouchableOpacity>
  </View>
);

export default function App() {
  
  // funcionalidades que encargadas de controlar el acceso al token
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const navigationRef = React.useRef();

  const authActions = useMemo(() => ({
    signIn: (token) => setUserToken(token),
    signOut: async () => {
      await authStorage.deleteToken();
      setUserToken(null);
    },
    userToken,
  }), [userToken]);

  useEffect(() => {
      const bootstrapAsync = async () =>{
        const token = await authStorage.getToken();
        setUserToken(token);
        setLoading(false);
      };
      bootstrapAsync();
    }, []
  );

  if (loading) {
    return <ActivityIndicator animating={true} style={{ flex: 1 }} size="large" />;
  }

  return (
    <AuthContext.Provider value={authActions}>
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        {userToken && <UserHeader />}
        <NavigationContainer style = {{backgroundColor : AppColors.background}}>
          <Stack.Navigator>
            {userToken == null ? (
              // No existe un token ==> mostramos el login
              <>
                <Stack.Screen 
                  name="Login" 
                  component={LoginScreen} 
                  options={{ headerShown: false }} // Ocultamos la barra superior en el login
                />

                <Stack.Screen 
                  name="Register" 
                  component={RegisterScreen} 
                  options={{ headerShown: false }} // Ocultamos la barra superior en el login
                />

                <Stack.Screen 
                  name="Reset" 
                  component={ResetScreen} 
                  options={{ headerShown: false }} // Ocultamos la barra superior en el login
                />
              </>
            ) : (
              //En este caso si que existe asique pasamos direcatamente al screen de home
             <>
                <Stack.Screen 
                  name="Home" 
                  component={HomeScreen} 
                  options={{ headerShown: false  }} 
                />
                <Stack.Screen 
                  name="LinkBot" 
                  component={LinkBotScreen} 
                  options={{ headerShown: false  }} 
                />
             </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
        {userToken && (
              <BottomNav navigation={navigationRef.current} />
        )}
      </PaperProvider>
    </SafeAreaProvider>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  // Estilos Barra Superior
  topBarContainer: {
    backgroundColor: AppColors.secondary,
    borderBottomEndRadius: 16,
    borderBottomStartRadius: 16,
    elevation: 2,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingBottom: 10
  },
  userName: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 10,
    color: '#333',
    marginLeft: 16
  },

  // Estilos Barra Inferior
  bottomBarContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  bottomBar: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  navBtn: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnText: {
    fontWeight: '500',
    color: '#6200ee',
  }
});