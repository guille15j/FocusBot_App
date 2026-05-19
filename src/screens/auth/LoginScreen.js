import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useContext, useMemo, useEffect } from 'react';
import {
  View,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  ScrollView,
  Text as RNText,
} from 'react-native';
import { TextInput, Button, Text, Divider as PaperDivider } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import { getColors, getglobalStyles } from '../../theme/theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { AuthService } from '../../api/apiService';
import BotIcon from '../../components/BotIcon';

import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();

/* ---------------------------
   Helper: cargar script GIS dinámicamente (funciona en Expo web)
   --------------------------- */
const loadGoogleScript = (src = 'https://accounts.google.com/gsi/client') => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('No window'));
    if (window.google && window.google.accounts && window.google.accounts.id) {
      return resolve(window.google);
    }
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (window.google && window.google.accounts && window.google.accounts.id) return resolve(window.google);
      existing.addEventListener('load', () => {
        if (window.google && window.google.accounts && window.google.accounts.id) resolve(window.google);
        else reject(new Error('Google script cargado pero window.google no disponible'));
      });
      existing.addEventListener('error', () => reject(new Error('Error cargando script Google')));
      return;
    }
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.defer = true;
    s.onload = () => {
      if (window.google && window.google.accounts && window.google.accounts.id) resolve(window.google);
      else reject(new Error('Google script cargado pero window.google no disponible'));
    };
    s.onerror = () => reject(new Error('Error cargando script Google'));
    document.head.appendChild(s);
  });
};

/* ---------------------------
   Componente para móvil (usa expo-auth-session)
   - Se define como componente separado para evitar hooks condicionales
   - Rellena los client IDs móviles con los tuyos
   --------------------------- */
function MobileGoogleButton({ onStart, onToken, onError }) {
  // require dinámico para que no falle en web bundling
  const Google = require('expo-auth-session/providers/google');
  const AuthSession = require('expo-auth-session');

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: '767551510601-m46aklgg3tsrhr64viqd9pcpi8rbr4bb.apps.googleusercontent.com',
    iosClientId: '767551510601-m46aklgg3tsrhr64viqd9pcpi8rbr4bb.apps.googleusercontent.com',
    // expoClientId: 'TU_EXPO_CLIENT_ID.apps.googleusercontent.com', // opcional si usas Expo Go
    responseType: 'id_token',
    // redirectUri: AuthSession.makeRedirectUri({ scheme: 'focusapp' }), // opcional si usas custom scheme
  });

  useEffect(() => {
    if (!response) return;
    if (response.type === 'success') {
      const token = response.authentication?.idToken || response.params?.id_token;
      if (token) onToken(token);
      else onError(new Error('No se obtuvo id_token'));
    } else if (response.type === 'error' || response.type === 'dismiss' || response.type === 'cancel') {
      onError(new Error('Autenticación cancelada o fallida'));
    }
  }, [response]);

  return (
    <Button
      mode="outlined"
      icon="google"
      onPress={() => {
        onStart();
        promptAsync({ useProxy: true, showInRecents: true }).catch(err => onError(err));
      }}
    >
      Continuar con Google
    </Button>
  );
}

/* ---------------------------
   LoginScreen principal
   --------------------------- */
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

  // Client ID web (asegúrate de exponerlo en Expo como EXPO_PUBLIC_GOOGLE_CLIENT_ID)
  const googleClientId =
    process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ||
    '767551510601-m46aklgg3tsrhr64viqd9pcpi8rbr4bb.apps.googleusercontent.com';

  /* ---------------------------
     Inicializar GIS en web (carga dinámica del script)
     --------------------------- */
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    let mounted = true;
    const init = async () => {
      try {
        await loadGoogleScript();
        if (!mounted) return;
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: manejarGISResponse,
          auto_select: false,
        });
        // opcional: renderizar botón nativo en un contenedor si quieres
        // window.google.accounts.id.renderButton(document.getElementById("g_id_signin"), { theme: "outline", size: "large" });
        console.log('Google Identity Services inicializado');
      } catch (err) {
        console.warn('No se pudo cargar Google Identity Services:', err.message);
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, [googleClientId]);

  /* ---------------------------
     Callback GIS (web)
     --------------------------- */
  const manejarGISResponse = async (response) => {
    const credential = response?.credential;
    if (!credential) {
      setLoading(false);
      return;
    }
    await manejarLoginGoogle(credential);
  };

  const promptGIS = () => {
    if (Platform.OS !== 'web') return;
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      Alert.alert('Error', 'Google Identity Services no está cargado. Intenta recargar la página.');
      return;
    }
    setLoading(true);
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        setLoading(false);
      }
    });
  };

  /* ---------------------------
     Manejar token (común web/móvil)
     --------------------------- */
  const manejarLoginGoogle = async (token) => {
    setLoading(true);
    try {
      const res = await AuthService.googleLogin(token);
      if (res && res.token) {
        await signIn(res.token);
      } else {
        Alert.alert('Error', 'Error en validación: ' + (res?.message || 'Token inválido'));
      }
    } catch (err) {
      Alert.alert('Error', 'Error de conexión con el backend');
    } finally {
      setLoading(false);
    }
  };

  /* ---------------------------
     Callbacks para MobileGoogleButton
     --------------------------- */
  const onMobileTokenStart = () => setLoading(true);
  const onMobileTokenReceived = (token) => manejarLoginGoogle(token);
  const onMobileError = (err) => {
    setLoading(false);
    Alert.alert('Error', err?.message || 'Autenticación móvil fallida');
  };

  /* ---------------------------
     Login tradicional
     --------------------------- */
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
    <LinearGradient colors={[colors.background, colors.primary, colors.background]} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <KeyboardAvoidingView style={isWeb ? globalStyles.authContainer_web : globalStyles.authContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
              <RNText style={{ marginHorizontal: 12, color: colors.textLight, fontSize: 12, fontWeight: '600' }}>o</RNText>
              <PaperDivider style={{ flex: 1 }} />
            </View>

            {/* Botón Google: web usa GIS, móvil usa MobileGoogleButton */}
            {Platform.OS === 'web' ? (
              <Button
                mode="outlined"
                icon="google"
                onPress={promptGIS}
                disabled={loading}
                style={[globalStyles.buttonOutline, { marginTop: 0 }]}
                contentStyle={{ paddingVertical: 2 }}
              >
                Continuar con Google
              </Button>
            ) : (
              <MobileGoogleButton onStart={onMobileTokenStart} onToken={onMobileTokenReceived} onError={onMobileError} />
            )}

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
