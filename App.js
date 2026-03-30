import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Importamos nuestras pantallas
import LoginScreen from './src/screens/LoginScreen';
// Nota: Crearemos HomeScreen en el siguiente paso
import HomeScreen from './src/screens/HomeScreen'; 

const Stack = createStackNavigator();


export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider >
        <NavigationContainer>
          {/* initialRouteName define qué pantalla se ve al abrir la app */}
          <Stack.Navigator initialRouteName="Login">
            
            <Stack.Screen 
              name="Login" 
              component={LoginScreen} 
              options={{ headerShown: false }} // Ocultamos la barra superior en el login
            />
            
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ title: 'Mis FocusBots' }} 
            />

          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}