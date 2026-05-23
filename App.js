import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

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

// Componente que maneja la navegación según el usuario autenticado
const AppNavigator = () => {
  const { user, isLoading } = useContext(AuthContext);
  const [navReady, setNavReady] = useState(false);
  const navigationRef = useRef();
  const scheme = useColorScheme();
  const theme = getAppTheme(scheme);

  // Cuando el usuario está autenticado, activamos la navegación inferior
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => setNavReady(true), 300);
      return () => clearTimeout(timer);
    } else {
      setNavReady(false);
    }
  }, [user]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <NavigationContainer ref={navigationRef}>
        <BotProvider>
          <ActivityProvider>
            <View style={{ flex: 1 }}>
              <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!user ? (
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

            {user && navReady && (
              <View style={{ backgroundColor: theme.colors.surface }}>
                <BottomNav navigation={navigationRef.current} />
              </View>
            )}
          </ActivityProvider>
        </BotProvider>
      </NavigationContainer>
    </View>
  );
};

// Componente principal
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