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
import {AuthService} from '../../api/apiService';

export default function VerifyScreen({ navigation, route = 'coreo' }) {
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
      // 1. Llamada al servicio (asegúrate de que en AuthService envías 'codigo: code')
      const response = await AuthService.verify(email, code);

      // 2. Corregido el typo 'resposne'
      if (response && response.token) {
        Alert.alert('¡Bienvenido!', 'Cuenta Verificada con éxito');

        // 3. Corregido signUp -> signIn (que es lo que extraes del Contexto)
        await signIn(response.token, response.user);
      } else {
        Alert.alert('Verificado', 'Cuenta Verificada con éxito. Ya puedes iniciar sesión');
        navigation.navigate('Login');
      }
      
    } catch (error) {
      // Aquí el error.message ya funcionará bien con el fetchApi corregido
      Alert.alert('Error de verificación', error.message || 'Código incorrecto o expirado');
    } finally {
      setLoading(false);
    }
  };

  const reenviarCodigo = async () => {
    setLoading(true);
    try {
      await AuthService.resendCode(email);
      Alert.alert('Enviado', 'Se ha enviado un nuevo código a tu correo.');
    } catch (error) {
      Alert.alert('Error', error.message || 'No se pudo reenviar el código');
    } finally {
      setLoading(false);
    }
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
              buttonColor={colors.primary} textColor={colors.background}
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