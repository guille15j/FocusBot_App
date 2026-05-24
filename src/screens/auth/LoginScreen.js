import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useContext, useMemo, useEffect } from 'react';
import {View,TouchableOpacity,KeyboardAvoidingView, Platform,useColorScheme,ScrollView, } from 'react-native';
import { TextInput, Button, Text, Divider as PaperDivider, HelperText } from 'react-native-paper';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

import { getColors, getglobalStyles } from '../../theme/theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { AuthService } from '../../api/apiService';
import BotIcon from '../../components/BotIcon';
import GoogleWebButton from '../../components/GoogleWebButton';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';

if (Platform.OS === 'web') {
  WebBrowser.maybeCompleteAuthSession();
}

export default function LoginScreen({ navigation }) {
  const scheme = useColorScheme();
  const showToast = useToast();
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const { isWeb, platform } = useResponsiveLayout();
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { signIn } = useContext(AuthContext);
  
  // Configuración de GoogleSignin para Android
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID, // ¡Es el ID de cliente de tipo WEB!
    });
  }, []); 

  // IDs de Google desde variables de entorno
  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS;
  const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID;

  // Reemplaza la declaración actual de redirectUri por esto:
  let redirectUri;
  if (isWeb) {
    // Web: usar la URL de producción o localhost según entorno
    const isLocal = typeof window !== 'undefined' && 
                    (window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1');
    redirectUri = isLocal ? 'http://localhost:19006' : 'https://focus-bot-app-web.vercel.app';
  } else {
    // Móvil: no definir redirectUri, se usará el valor por defecto basado en android.package
    redirectUri = undefined;
  }

  // En Google.useAuthRequest, pasar redirectUri solo si existe
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId,
    iosClientId,
    androidClientId,
    responseType: 'id_token',
    scopes: ['openid', 'profile', 'email'],
    ...(redirectUri && { redirectUri }), // solo incluir si redirectUri tiene valor
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken =
        response.authentication?.idToken || // móvil
        response.params?.id_token;          // web

      if (!idToken) {
        setLoading(false);
        return;
      }
      manejarLoginGoogle(idToken);
    } else if (
      response?.type === 'error' ||
      response?.type === 'cancel' ||
      response?.type === 'dismiss'
    ) {
      setLoading(false);
    }
  }, [response]);

  const manejarLoginGoogle = async (token) => {
    setLoading(true);
    try {
      const res = await AuthService.googleLoggin(token);
      if (res.token) {
        await signIn(res.token, res.user);
      } else {
        showToast(res.message || 'Token inválido', 'error');
      }
    } catch (err) {
      console.error("Error en googleLoggin:", err);
      showToast('Error de conexión con el backend', 'error');
    } finally {
      setLoading(false);
    }
  };

  

const handleGoogleSignIn = async () => {
  setLoading(true);
  
  // 1. Verificar Play Services
  try {
    const hasPlayServices = await GoogleSignin.hasPlayServices();
    Alert.alert('Debug', `Play Services disponibles: ${hasPlayServices}`);
    if (!hasPlayServices) {
      showToast('Google Play Services no disponible', 'error');
      setLoading(false);
      return;
    }
  } catch (err) {
    Alert.alert('Error Play Services', err.message);
    showToast('Error al verificar Play Services', 'error');
    setLoading(false);
    return;
  }

  // 2. Intentar iniciar sesión
  try {
    const userInfo = await GoogleSignin.signIn();
    Alert.alert('Debug', `userInfo recibido: ${JSON.stringify(userInfo, null, 2)}`);
    
    const idToken = userInfo?.data.idToken;
    if (!idToken) {
      Alert.alert('Error', 'No se recibió idToken. userInfo: ' + JSON.stringify(userInfo));
      showToast('No se pudo obtener el token de Google', 'error');
      setLoading(false);
      return;
    }
    
    // 3. Llamar al backend
    await manejarLoginGoogle(idToken);
  } catch (error) {
    // Mostrar el error completo
    let errorMsg = error.message;
    if (error.code) errorMsg += `\nCódigo: ${error.code}`;
    if (error.userInfo) errorMsg += `\nuserInfo: ${JSON.stringify(error.userInfo)}`;
    Alert.alert('Error en Google Sign-In', errorMsg);
    console.error("Error detallado:", error);
    showToast('Error al iniciar sesión con Google', 'error');
    setLoading(false);
  }
};

  const ejecutarLogin = async () => {
    setSubmitted(true);
    if (!email.trim() || !password.trim()) {
      showToast('Por favor, introduce tu email/usuario y contraseña', 'error');
      return;
    }
    setLoading(true);
    try {
      const response = await AuthService.login(email, password);
      if (response && response.token) {
        await signIn(response.token, response.user);
      }
    } catch (error) {
      showToast(error.message || 'Credenciales incorrectas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGooglePress = () => {
    if (!request || loading) return;
    if (isWeb) {
      promptAsync({ useProxy: false, redirectUri: 'https://focus-bot-app-web.vercel.app' });
    } else {
      promptAsync();
    }
  };

  const irARegistro = () => navigation.replace('Register');
  const irAReset = () => navigation.navigate('Reset');

  const showEmailError = submitted && !email.trim();
  const showPasswordError = submitted && !password.trim();

  return (
    <LinearGradient
      colors={[colors.background, colors.primary, colors.background]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={isWeb ? globalStyles.authContainer_web : globalStyles.authContainer}
        behavior={platform === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <View style={globalStyles.form} elevation={4}>
            <View style={globalStyles.logoContainer}>
              <BotIcon size={100} state="IDLE" loading={loading} />
              <View style={globalStyles.logoContainer_name}>
                <Text style={globalStyles.logo_focus}>Focus</Text>
                <Text style={globalStyles.logo_bot}>.Bot</Text>
              </View>
              <Text style={globalStyles.logoSubtitle}>Deep in your Focus</Text>
            </View>

            <TextInput
              label="Email o Usuario"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              autoCapitalize="none"
              style={globalStyles.input}
              outlineStyle={{ borderRadius: 30 }}
              outlineColor={showEmailError ? colors.error : undefined}
              left={<TextInput.Icon icon="account" />}
              error={showEmailError}
            />
            {showEmailError ? <HelperText type="error" visible={true}>El email o usuario es obligatorio</HelperText> : null}

            <TextInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              style={globalStyles.input}
              outlineStyle={{ borderRadius: 30 }}
              outlineColor={showPasswordError ? colors.error : undefined}
              left={<TextInput.Icon icon="lock" />}
              error={showPasswordError}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />
            {showPasswordError ? <HelperText type="error" visible={true}>La contraseña es obligatoria</HelperText> : null}

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
              <Text
                style={{
                  marginHorizontal: 12,
                  color: colors.textLight,
                  fontSize: 12,
                  fontWeight: '600',
                }}
              >
                o
              </Text>
              <PaperDivider style={{ flex: 1 }} />
            </View>

            {isWeb ? (
              <GoogleWebButton
                onSuccess={(token, user) => signIn(token, user)}
                colors={colors}
                globalStyles={globalStyles}
                clientId={webClientId}   
              />
            ) : (
              <Button
                mode="outlined"
                icon="google"
                onPress={handleGoogleSignIn}
                disabled={loading}
                style={[globalStyles.buttonOutline, { marginTop: 0 }]}
                contentStyle={{ paddingVertical: 2 }}
              >
                Continuar con Google
              </Button>
            )}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
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