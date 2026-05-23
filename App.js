import React, { useState, useEffect, useRef } from 'react';
import { View, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { authStorage } from './src/core/authStorage';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { BotProvider } from './src/context/BotContext';
import { ToastProvider } from './src/context/ToastContext';
import { ActivityProvider } from './src/context/ActivityContext';
import { ConfirmProvider } from './src/context/ConfirmContext';

import { getAppTheme } from './src/theme/theme';

import LoadingScreen from './src/screens/auth/LoadingScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import ResetScreen from './src/screens/auth/ResetScreen';
import VerifyScreen from './src/screens/auth/VerifyScreen';

import HomeScreen from './src/screens/app/HomeScreen';
import ActivitiesScreen from './src/screens/app/ActivitiesScreen';
import CreateActivityScreen from './src/screens/app/CreateActivityScreen';
import BotsPage from './src/screens/app/BotsScreen';
import ProfileScreen from './src/screens/app/ProfileScreen';
import HistoricalRecords from './src/screens/app/HistoricalScreen';

import BottomNav from './src/navigation/BottomTabs';

const Stack = createStackNavigator();

// Componente interno que decide qué pantallas mostrar basándose en el TOKEN
const AppNavigator = () => {
  const { user } = React.useContext(AuthContext); // solo para detectar cambios de sesión
  const [token, setToken] = useState(null);
  const [loadingToken, setLoadingToken] = useState(true);
  const [navReady, setNavReady] = useState(false);
  const navigationRef = useRef();
  const scheme = useColorScheme();
  const theme = getAppTheme(scheme);

  // Cargar el token del almacenamiento al iniciar y cuando cambie el usuario (login/logout)
  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await authStorage.getToken();
        setToken(storedToken);
      } catch (error) {
        console.error("Error leyendo token:", error);
        setToken(null);
      } finally {
        setLoadingToken(false);
      }
    };
    loadToken();
  }, [user]); // Dependencia en 'user' para refrescar cuando se inicia/cierra sesión

  // Controlar la barra de navegación inferior
  useEffect(() => {
    if (token) {
      const timer = setTimeout(() => setNavReady(true), 300);
      return () => clearTimeout(timer);
    } else {
      setNavReady(false);
    }
  }, [token]);

  if (loadingToken) {
    return <LoadingScreen />;
  }

  const isAuthenticated = token !== null;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <NavigationContainer ref={navigationRef}>
        {!isAuthenticated ? (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Reset" component={ResetScreen} />
            <Stack.Screen name="Verify" component={VerifyScreen} />
          </Stack.Navigator>
        ) : (
          <BotProvider>
            <ActivityProvider>
              <View style={{ flex: 1 }}>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                  <Stack.Screen name="Home" component={HomeScreen} />
                  <Stack.Screen name="Activities" component={ActivitiesScreen} />
                  <Stack.Screen name="CreateActivity" component={CreateActivityScreen} />
                  <Stack.Screen name="Bots" component={BotsPage} />
                  <Stack.Screen name="Profile" component={ProfileScreen} />
                  <Stack.Screen name="Records" component={HistoricalRecords} />
                </Stack.Navigator>
              </View>
              {navReady && (
                <View style={{ backgroundColor: theme.colors.surface }}>
                  <BottomNav navigation={navigationRef.current} />
                </View>
              )}
            </ActivityProvider>
          </BotProvider>
        )}
      </NavigationContainer>
    </View>
  );
};

// Componente raíz
export default function App() {
  const scheme = useColorScheme();
  const theme = getAppTheme(scheme);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <ConfirmProvider>
          <ToastProvider>
            <AuthProvider>
              <AppNavigator />
            </AuthProvider>
          </ToastProvider>
        </ConfirmProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}