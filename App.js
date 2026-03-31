import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider, ActivityIndicator } from 'react-native-paper';
import { authStorage } from './src/services/authStorage';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Importación de las Pantallas
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen'; 
import LinkBotScreen from './src/screens/LinkBotScreen';
import RegisterScreen from './src/screens/RegisterScreen';

const Stack = createStackNavigator();


export default function App() {
  
  // funcionalidades que encargadas de controlar el acceso al token
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

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
    <SafeAreaProvider>
      <PaperProvider >
        <NavigationContainer>
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
              </>
            ) : (
              //En este caso si que existe asique pasamos direcatamente al screen de home
             <>
                <Stack.Screen 
                  name="Home" 
                  component={HomeScreen} 
                  options={{ title: 'Mis FocusBots' }} 
                />
                <Stack.Screen 
                  name="LinkBot" 
                  component={LinkBotScreen} 
                  options={{ title: 'Mis FocusBots' }} 
                />
             </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}