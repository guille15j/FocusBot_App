import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider, ActivityIndicator } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';



// Importaciones locales
import { authStorage } from './src/core/authStorage';
import { AuthContext } from './src/context/AuthContext';
import { globalStyles, CombinedDefaultTheme as theme } from './src/theme/theme';

// Pantallas
// auth
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import ResetScreen from './src/screens/auth/ResetScreen';

// app
import HomeScreen from './src/screens/app/HomeScreen';
import ActivitiesScreen from './src/screens/app/ActivitiesScreen';
import BotsPage from './src/screens/app/BotsScreen';
import ProfileScreen from './src/screens/app/ProfileScreen';
import HistoricalRecords from './src/screens/app/HistoricalScreen';

// Navegación
import BottomNav from './src/navigation/BottomTabs';
import { useResponsiveLayout } from './src/hooks/useResponsiveLayout';

// Configuración del Navegador =======================================================
// Creamos un "stack" de navegación
const Stack = createStackNavigator();


export default function App() {
  
  const { isWeb } = useResponsiveLayout();

  // Estados =========================================================================
  // loading: true = estamos cargando, false = ya terminó de cargar
  const [loading, setLoading] = useState(true);
  
  // userToken: null = no hay sesión, "token" = hay sesión iniciada
  const [userToken, setUserToken] = useState(null);
  
  // user: null o objeto con los datos del usuario
  const [user, setUser] = useState(null);

  // Referencia al navegador - Nos permite navegar desde cualquier parte de la app
  const navigationRef = React.useRef();

  // Funciones de autenticacion =====================================================
  // useMemo memoriza el objeto para que no se cree de nuevo en cada render
  const authActions = useMemo(() => ({
    
    // Función para INICIAR SESIÓN
    // Recibe el token y los datos del usuario
    signIn: (token, userData) => {
      console.log("Iniciando sesión con token:", token);
      setUserToken(token);    // Guardamos el token en el estado
      setUser(userData);      // Guardamos los datos del usuario
    },

    // Función para CERRAR SESIÓN
    signOut: async () => {
      console.log("Cerrando sesión...");
      await authStorage.deleteToken();   // Borramos el token del almacenamiento
      await authStorage.deleteUser();    // Borramos los datos del usuario
      setUser(null);       // Limpiamos el estado del usuario
      setUserToken(null);  // Limpiamos el estado del token
    },

    // Exponemos los estados para que otros componentes puedan leerlos
    userToken,
    user,
  }), [userToken, user]); // Dependencias: se recalcula si cambia userToken o user

  useEffect(() => {
    // Función que verifica si hay una sesión guardada
    const verificarSesionGuardada = async () => {
      console.log("Verificando si hay sesión guardada...");
      
      // Intentamos obtener el token guardado
      const token = await authStorage.getToken();
      
      // Intentamos obtener los datos del usuario guardados
      const userData = await authStorage.getUser();
      
      if (token) {
        console.log("Sesión encontrada. Token:", token);
      } else {
        console.log("No hay sesion guardada");
      }
      
      // Actualizamos los estados con lo que encontramos
      setUserToken(token);
      setUser(userData);
      
      // Terminó la carga inicial
      setLoading(false);
    };
    
    verificarSesionGuardada();
  }, []); // Array vacío = solo se ejecuta una vez al montar

  // Pantalla de carga
  if (loading) {
    return (
      <PaperProvider theme={theme}>
        {/* ActivityIndicator es el circulito que gira */}
        <ActivityIndicator 
          animating={true} 
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} 
          size="large" 
          color={theme.colors.primary}
        />
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
                <Stack.Screen name="Bots" component={BotsPage} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="Records" component={HistoricalRecords} />
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
