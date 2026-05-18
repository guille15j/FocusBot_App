import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useContext, useMemo, useEffect } from 'react';
import { View, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, useColorScheme, ScrollView } from 'react-native'; 
import { TextInput, Button, Text, Divider as PaperDivider } from 'react-native-paper'; 
import { AuthContext } from '../../context/AuthContext';
import { getColors, getglobalStyles } from '../../theme/theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { AuthService } from '../../api/apiService';
import BotIcon from '../../components/BotIcon';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';

// Maneja la finalización de la sesión de autenticación en la web
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn } = useContext(AuthContext);

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId:      process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
    iosClientId:      '767551510601-m46aklgg3tsrhr64viqd9pcpi8rbr4bb.apps.googleusercontent.com',
    androidClientId:  '767551510601-m46aklgg3tsrhr64viqd9pcpi8rbr4bb.apps.googleusercontent.com',
    
    responseType: Platform.OS === 'web' ? 'code' : 'id_token',

    redirectUri: Platform.OS === 'web' 
      ? window.location.origin 
      : AuthSession.makeRedirectUri({ scheme: 'focusapp' }),
  });

  // FLUJO 1: Listener estándar de Expo (Móviles y entornos locales estables)
  useEffect(() => {    
    if (response?.type === 'success') {
      const token = response.authentication?.idToken || response.params?.id_token || response.params?.code;
      if (token) {
        manejarLoginGoogle(token);
      } else {
        setLoading(false);
      }
    } else if (response?.type === 'error' || response?.type === 'cancel') {
      setLoading(false);
    }
  }, [response]);

  // FLUJO 2: EFECTO DE RESCATE EXCLUSIVO PARA WEB (VERCEL) 
  // Captura de forma manual tanto parámetros '?' como hashes '#' si la app se recarga
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    let tokenEncontrado = null;

    // Variante A: Intentar leer '?code=' o '?id_token=' de la URL
    if (window.location.search) {
      const urlParams = new URLSearchParams(window.location.search);
      tokenEncontrado = urlParams.get('code') || urlParams.get('id_token') || urlParams.get('access_token');
    }

    // Variante B: Si no se halló arriba, intentar desestructurar el hash '#'
    if (!tokenEncontrado && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const hashParams = new URLSearchParams(hash);
      tokenEncontrado = hashParams.get('id_token') || hashParams.get('access_token') || hashParams.get('code');
    }

    // Si capturamos cualquier credencial válida de Google directamente desde la URL de Vercel
    if (tokenEncontrado) {
      console.log("¡Credencial de Google rescatada manualmente desde Vercel!:", tokenEncontrado);
      
      // Limpiamos estéticamente la barra del navegador para remover los tokens expuestos
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Ejecutamos el inicio de sesión mandando el parámetro rescatado
      manejarLoginGoogle(tokenEncontrado);
    }
  }, []);

  const manejarLoginGoogle = async (token) => {
    setLoading(true);
    try {
      const res = await AuthService.googleLogin(token);
      if (res.token) {
        await signIn(res.token);
      } else {
        Alert.alert("Error", "Error en validación: " + (res.message || "Token/Código inválido"));
      }
    } catch (err) {
      Alert.alert("Error", "Error de conexión con el backend");
    } finally {
      setLoading(false);
    }
  };

  const ejecutarLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atención', 'Por favor, introduce tu email/usuario y contraseña');
      return;
    }
    setLoading(true);
    try {
      const response = await AuthService.login(email, password);
      if (response && response.token) {
        await signIn(response.token, response.user);
      }
    } catch (error) {
      Alert.alert('Error de acceso', error.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  const irARegistro = () => navigation.replace('Register');
  const irAReset = () => navigation.navigate('Reset');

  return (
    <LinearGradient colors={[colors.background, colors.primary,colors.background]} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <KeyboardAvoidingView style={isWeb ? globalStyles.authContainer_web : globalStyles.authContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <View style={globalStyles.form} elevation={4}>
            
            <View style={globalStyles.logoContainer}>
              <BotIcon size={100} state='IDLE' loading={loading}/>
              <View style={globalStyles.logoContainer_name}>
                <Text style={globalStyles.logo_focus}>Focus</Text>
                <Text style={globalStyles.logo_bot}>.Bot</Text>
              </View>
              <Text style={globalStyles.logoSubtitle}>Deep in your Focus</Text>
            </View>

            <TextInput label="Email o Usuario" value={email} onChangeText={setEmail} mode="outlined" autoCapitalize="none" style={globalStyles.input} outlineStyle={{ borderRadius: 30 }} left={<TextInput.Icon icon="account" />} />
            <TextInput label="Contraseña" value={password} onChangeText={setPassword} mode="outlined" secureTextEntry={!showPassword} style={globalStyles.input} outlineStyle={{ borderRadius: 30 }} left={<TextInput.Icon icon="lock" />} right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(!showPassword)} />} />
            
            <TouchableOpacity onPress={irAReset} style={globalStyles.linkContainer}>
              <Text style={[globalStyles.link, { fontSize: 14 }]}>¿Has olvidado la contraseña?</Text>
            </TouchableOpacity>

            <Button 
              icon="login" 
              mode="contained" 
              onPress={ejecutarLogin} 
              loading={loading} 
              disabled={loading} 
              style={globalStyles.button} 
              buttonColor={colors.primary} 
              textColor={colors.background} 
              labelStyle={{ fontSize: 16, fontWeight: '600' }}
            >
              Iniciar sesión
            </Button>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
              <PaperDivider style={{ flex: 1 }} />
              <Text style={{ marginHorizontal: 12, color: colors.textLight, fontSize: 12, fontWeight: '600' }}>o</Text>
              <PaperDivider style={{ flex: 1 }} />
            </View>

            <Button
              mode="outlined" 
              icon="google"
              onPress={() => {
                setLoading(true);
                // Ejecución nativa/web optimizada con ventana emergente
                promptAsync(Platform.OS === 'web' ? { windowFeatures: { width: 500, height: 600 } } : {});
              }}
              disabled={!request || loading}
              style={[globalStyles.buttonOutline, {marginTop: 0}]}
              contentStyle={{ paddingVertical: 2 }}
            >
              Continuar con Google
            </Button>

             <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
              <Text style={{ color: colors.textLight, fontSize: 14 }}>¿No tienes una cuenta? </Text>
              <TouchableOpacity onPress={irARegistro}>
                <Text style={[globalStyles.link, { fontSize: 14 }]}>Regístrate</Text>
              </TouchableOpacity>
            </View>
              
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}