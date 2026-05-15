import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider, ActivityIndicator } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { authStorage } from './src/core/authStorage';
import { AuthContext } from './src/context/AuthContext';
import { BotProvider } from './src/context/BotContext';
import { ActivityProvider } from './src/context/ActivityContext';
import { getAppTheme } from './src/theme/theme';

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
import { useResponsiveLayout } from './src/hooks/useResponsiveLayout';

const Stack = createStackNavigator();

export default function App() {
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();
  const theme = useMemo(() => getAppTheme(scheme), [scheme]);

  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [user, setUser] = useState(null);
  const [navReady, setNavReady] = useState(false);
  const navigationRef = useRef();

  const authActions = useMemo(() => ({
    signIn: async (token, userData) => {
      try {
        await authStorage.saveToken(token);
        await authStorage.saveUser(userData);
        setUserToken(token);
        setUser(userData);
        // Al hacer login manual, activamos la barra rápido
        setNavReady(true);
      } catch (e) {
        console.error("Error en el inicio de sesión:", e);
      }
    },
    signOut: async () => {
      await authStorage.deleteToken();
      await authStorage.deleteUser();
      setUser(null);
      setUserToken(null);
      setNavReady(false);
    },
    signUp: async (token, userData) => {
      try {
        await authStorage.saveToken(token);
        await authStorage.saveUser(userData);
        setUserToken(token);
        setUser(userData);
        setNavReady(true);
      } catch (e) {
        console.error("Error al registrar:", e);
      }
    },
    userToken,
    user,
  }), [userToken, user]);

  useEffect(() => {
    const verificarSesion = async () => {
      try {
        const token = await authStorage.getToken();
        const userData = await authStorage.getUser();
        
        if (token) {
          setUserToken(token);
          setUser(userData);
          // EL TRUCO: Los datos ya están en el estado, pero la barra
          // espera un momento para ganar el foco táctil.
          setTimeout(() => {
            setNavReady(true);
          }, 600);
        }
      } catch (e) {
        console.error("Error verificando sesión:", e);
      } finally {
        setLoading(false);
      }
    };

    verificarSesion();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={authActions}>
      <BotProvider>
        <ActivityProvider>
          <SafeAreaProvider>
            <PaperProvider theme={theme}>
              
              <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
                <NavigationContainer ref={navigationRef}>
                  
                  {/* CONTENEDOR FLEX: Divide la pantalla en dos bloques reales */}
                  <View style={{ flex: 1 }}>
                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                      {userToken == null ? (
                        <>
                          <Stack.Screen name="Login" component={LoginScreen} />
                          <Stack.Screen name="Register" component={RegisterScreen} />
                          <Stack.Screen name="Reset" component={ResetScreen} />
                          <Stack.Screen name="Verify" component={VerifyScreen} />
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
                  </View>

                  {/* BARRA: Hermano de layout del Navigator (evita bloqueos) */}
                  {(userToken && navReady) && (
                    <View style={{ backgroundColor: theme.colors.surface }}>
                      <BottomNav navigation={navigationRef.current} />
                    </View>
                  )}

                </NavigationContainer>
              </View>

            </PaperProvider>
          </SafeAreaProvider>
        </ActivityProvider>
      </BotProvider>
    </AuthContext.Provider>
  );
}