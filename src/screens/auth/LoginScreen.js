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
} from 'react-native';
import { TextInput, Button, Text, Divider as PaperDivider } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import { getColors, getglobalStyles } from '../../theme/theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { AuthService } from '../../api/apiService';
import BotIcon from '../../components/BotIcon';
import GoogleWebButton from '../../components/GoogleWebButton';

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';


// SOLO en móvil
if (Platform.OS !== 'web') {
  WebBrowser.maybeCompleteAuthSession();
}

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

  // Redirect fijo en Web, dinámico en móvil
  const redirectUri =
    Platform.OS === 'web'
      ? 'https://focus-bot-app-web.vercel.app'
      : AuthSession.makeRedirectUri({ scheme: 'focusapp' });

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '767551510601-m46aklgg3tsrhr64viqd9pcpi8rbr4bb.apps.googleusercontent.com',
    iosClientId: '767551510601-m46aklgg3tsrhr64viqd9pcpi8rbr4bb.apps.googleusercontent.com',
    androidClientId: '767551510601-m46aklgg3tsrhr64viqd9pcpi8rbr4bb.apps.googleusercontent.com',
    responseType: 'id_token',
    scopes: ['openid', 'profile', 'email'],
    redirectUri,
  });

  useEffect(() => {
    console.log('Response recibido:', response);

    if (response?.type === 'success') {
      const idToken =
        response.authentication?.idToken || // móvil
        response.params?.id_token;          // web

      if (!idToken) {
        console.log('No se recibió idToken');
        setLoading(false);
        return;
      }

      manejarLoginGoogle(idToken);
    } else if (
      response?.type === 'error' ||
      response?.type === 'cancel' ||
      response?.type === 'dismiss'
    ) {
      console.log('Login cancelado o bloqueado:', response?.type);
      setLoading(false);
    }
  }, [response]);

  const manejarLoginGoogle = async (token) => {
    setLoading(true);
    try {
      const res = await AuthService.googleLoggin(token);
      if (res.token) {
        await signIn(res.token);
      } else {
        Alert.alert('Error', res.message || 'Token inválido');
      }
    } catch (err) {
      Alert.alert('Error', 'Error de conexión con el backend');
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

  const handleGooglePress = () => {
    if (!request || loading) return;

    if (Platform.OS === 'web') {
      // 🔥 Web: redirección en la misma pestaña (NO popup)
      promptAsync({ useProxy: false, redirectUri });
    } else {
      // 🔥 Móvil: popup normal
      promptAsync();
    }
  };

  const irARegistro = () => navigation.replace('Register');
  const irAReset = () => navigation.navigate('Reset');

  return (
    <LinearGradient
      colors={[colors.background, colors.primary, colors.background]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={isWeb ? globalStyles.authContainer_web : globalStyles.authContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
              left={<TextInput.Icon icon="account" />}
            />

            <TextInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              style={globalStyles.input}
              outlineStyle={{ borderRadius: 30 }}
              left={<TextInput.Icon icon="lock" />}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
            />

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

            {Platform.OS === 'web' ? (
              <GoogleWebButton
                nSuccess={(token, user) => signIn(token, user)}
                colors={colors}
                globalStyles={globalStyles}
              />
            ) : (
              <Button
                mode="outlined"
                icon="google"
                onPress={handleGooglePress} // solo móvil
                disabled={!request || loading}
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
                marginTop: 16,
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
