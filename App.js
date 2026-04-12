import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'; // Añadidos
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider, ActivityIndicator, Avatar, IconButton } from 'react-native-paper';
import { authStorage } from './src/services/authStorage';
import { AuthContext } from './src/services/AuthContext';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { AppColors, theme } from './src/theme/theme';

// Importación de las Pantallas
// Pantallas de LOG
import LoginScreen from './src/screens/log/LoginScreen';
import RegisterScreen from './src/screens/log/RegisterScreen';
import ResetScreen from './src/screens/log/ResetScreen';

// Pantalla Principal
import HomeScreen from './src/screens/HomeScreen'; 

// Pantallas de BOTS
import BotsPage from './src/screens/bots/BotsPage';
import LinkBotScreen from './src/screens/bots/LinkBotScreen';

// Pantallas de ACTIVIDADES
import Activities from './src/screens/activities/Activities';

// Pantallas de RECORDS
import HistoricalRecords from './src/screens/records/HistoricalRecords';

// Pantallas de PROFILE (Opcional para el futuro)
import ProfilePage from './src/screens/profile/ProfilePage';

import UserHeader from './src/components/UserHeader';
import BottomNav from './src/components/BottomNav';

const Stack = createStackNavigator();

export default function App() {
  
  // funcionalidades que encargadas de controlar el acceso al token
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);

  const navigationRef = React.useRef();

  const authActions = useMemo(() => ({
    signIn: (token, userData) => {setUserToken(token);setUser(userData);},
    signOut: async () => {
      await authStorage.deleteToken();
      await authStorage.deleteUser();
      setUser(null);
      setUserToken(null);
    },
    userToken, user,
  }), [userToken, user]);

  useEffect(() => {
      const bootstrapAsync = async () =>{
        const token = await authStorage.getToken();
        const user = await authStorage.getUser();

        setUserToken(token);
        setUser(user);

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
        {userToken && <UserHeader user={user} />}
        <NavigationContainer ref={navigationRef} style = {{backgroundColor : AppColors.background}}>
          <Stack.Navigator>
            {userToken == null ? (
              // STACK DE AUTENTICACIÓN
              <>
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Reset" component={ResetScreen} options={{ headerShown: false }} />
              </>
            ) : (
              // STACK DE LA APLICACIÓN
              <>
                {/* Home es la pantalla por defecto */}
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                
                {/* Pantalla de listado de Bots */}
                <Stack.Screen name="BotPage" component={BotsPage} options={{ headerShown: false }} />
                
                {/* Pantalla de Actividades */}
                <Stack.Screen name="Activities" component={Activities} options={{ headerShown: false }} />
                
                {/* Pantalla de Historial */}
                <Stack.Screen name="Records" component={HistoricalRecords} options={{ headerShown: false }} />

                {/* Pantallas secundarias (Navegación interna) */}
                <Stack.Screen name="LinkBot" component={LinkBotScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Profile" component={ProfilePage} options={{ headerShown: false }} />
              </>
            )}
          </Stack.Navigator>

          {userToken && (
            <BottomNav navigation={navigationRef.current} />
          )}
        </NavigationContainer>
        
      </PaperProvider>
    </SafeAreaProvider>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  // Estilos Barra Superior
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
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ff0000',
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