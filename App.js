import React, { useState, useEffect, useMemo } from 'react';
import { View, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider, ActivityIndicator } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { authStorage } from './src/core/authStorage';
import { AuthContext } from './src/context/AuthContext';
import { getAppTheme } from './src/theme/theme';

import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import ResetScreen from './src/screens/auth/ResetScreen';

import HomeScreen from './src/screens/app/HomeScreen';
import ActivitiesScreen from './src/screens/app/ActivitiesScreen';
import CreateActivityScreen from './src/screens/app/CreateActivityScreen';
import BotsPage from './src/screens/app/BotsScreen';
import ProfileScreen from './src/screens/app/ProfileScreen';
import HistoricalRecords from './src/screens/app/HistoricalScreen';

import BottomNav from './src/navigation/BottomTabs';

import { useResponsiveLayout } from './src/hooks/useResponsiveLayout';

const Stack = createStackNavigator();

export default function App() {
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();
  const theme = useMemo(() => getAppTheme(scheme), [scheme]);

  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const navigationRef = React.useRef();

  const authActions = useMemo(() => ({
    signIn: (token, userData) => {
      console.log("Iniciando sesión con token:", token);
      setUserToken(token);
      setUser(userData);
    },
    signOut: async () => {
      console.log("Cerrando sesión...");
      await authStorage.deleteToken();
      await authStorage.deleteUser();
      setUser(null);
      setUserToken(null);
    },
    userToken,
    user,
  }), [userToken, user]);

  useEffect(() => {
    const verificarSesionGuardada = async () => {
      console.log("Verificando si hay sesión guardada...");
      const token = await authStorage.getToken();
      const userData = await authStorage.getUser();
      if (token) console.log("Sesión encontrada. Token:", token);
      else console.log("No hay sesion guardada");
      setUserToken(token);
      setUser(userData);
      setLoading(false);
    };
    verificarSesionGuardada();
  }, []);

  if (loading) {
    return (
      <PaperProvider theme={theme}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator animating={true} size="large" color={theme.colors.primary} />
        </View>
      </PaperProvider>
    );
  }

  return (
    <AuthContext.Provider value={authActions}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>         
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {userToken == null ? (
                <>
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="Register" component={RegisterScreen} />
                  <Stack.Screen name="Reset" component={ResetScreen} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="Activities" component={ActivitiesScreen} />
                  <Stack.Screen name="CreateActivity" component={CreateActivityScreen} />
                  <Stack.Screen name="Bots" component={BotsPage} />
                  <Stack.Screen name="Profile" component={ProfileScreen} />
                  <Stack.Screen name="Records" component={HistoricalRecords} />
                </>
              )}
            </Stack.Navigator>
            {userToken && navigationRef.current && <BottomNav navigation={navigationRef.current} />}
          </NavigationContainer>
        </PaperProvider>
      </SafeAreaProvider>
    </AuthContext.Provider>
  );
}