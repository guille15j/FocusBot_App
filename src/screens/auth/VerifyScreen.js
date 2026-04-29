import React, { useState, useContext, useMemo } from 'react';
import {
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
} from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import { getColors, getglobalStyles } from '../../theme/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

export default function VerifyScreen({ navigation, route }) {
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);

  const { signIn } = useContext(AuthContext);

  // El email viene como parámetro desde RegisterScreen
  const email = route?.params?.email || '';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const ejecutarVerificacion = async () => {
    if (!code.trim() || code.length !== 6) {
      Alert.alert('Error', 'Introduce el código de 6 dígitos.');
      return;
    }

    setLoading(true);
    try {
      // Simulación de verificación exitosa
      console.log('Verificando código:', code, 'para email:', email);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Datos simulados de la respuesta del backend
      const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake-jwt-token-verificado';
      const fakeUser = {
        id: 2,
        first_name: 'Usuario',
        last_name: 'Verificado',
        nickname: email.split('@')[0],
        email: email,
      };

      // Llamamos al contexto de autenticación para guardar sesión
      signIn(fakeToken, fakeUser);

      Alert.alert('¡Verificación exitosa!', 'Tu cuenta ha sido activada.');
    } catch (error) {
      console.error('Error en verificación:', error);
      Alert.alert('Error', 'Código inválido o expirado.');
    } finally {
      setLoading(false);
    }
  };

  const reenviarCodigo = () => {
    // Simulación de reenvío
    console.log('Reenviando código a:', email);
    Alert.alert('Código reenviado', 'Revisa tu bandeja de entrada.');
  };

  const volverAlLogin = () => {
    navigation.replace('Login');
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={isWeb ? globalStyles.authContainer_web : globalStyles.authContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={globalStyles.form} elevation={4}>
          <View style={globalStyles.logoContainer}>
            <View style={globalStyles.logoContainer_name}>
              <Text style={globalStyles.logo_focus}>Focus</Text>
              <Text style={globalStyles.logo_bot}>.Bot</Text>
            </View>
            <Text style={globalStyles.logoSubtitle}>Verificar cuenta</Text>
          </View>

          <Text style={{ textAlign: 'center', marginBottom: 20, color: colors.textLight }}>
            Hemos enviado un código de 6 dígitos a{'\n'}{email}
          </Text>

          <TextInput
            label="Código de verificación"
            value={code}
            onChangeText={(text) => setCode(text.replace(/[^0-9]/g, ''))}
            mode="outlined"
            keyboardType="number-pad"
            maxLength={6}
            style={globalStyles.input}
            outlineStyle={{ borderRadius: 30 }}
            left={<TextInput.Icon icon="shield-check" />}
          />

          <View style={globalStyles.botonera}>
            <Button
              mode="contained"
              onPress={ejecutarVerificacion}
              loading={loading}
              disabled={loading}
              style={[globalStyles.button, { flex: 1 }]}
              labelStyle={{ fontSize: 16, fontWeight: '600' }}
            >
              Verificar
            </Button>
            <Button
              mode="outlined"
              onPress={volverAlLogin}
              disabled={loading}
              style={[globalStyles.buttonOutline, { flex: 1 }]}
            >
              Cancelar
            </Button>
          </View>

          <Button
            mode="text"
            onPress={reenviarCodigo}
            disabled={loading}
            style={{ marginTop: 12 }}
            labelStyle={{ color: colors.primary, fontWeight: '600' }}
          >
            Reenviar código
          </Button>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}