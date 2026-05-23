import React, { useState, useContext, useMemo } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  HelperText,
} from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getColors, getglobalStyles } from '../../theme/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { AuthService } from '../../api/apiService';

export default function VerifyScreen({ navigation, route }) {
  const scheme = useColorScheme();
  const showToast = useToast();
  const { isWeb, platform } = useResponsiveLayout();
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);

  const { signIn } = useContext(AuthContext);

  const email = route?.params?.email || '';

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!code.trim() || code.length !== 6) {
      nuevosErrores.code = 'El código debe tener 6 dígitos';
    }
    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (text) => {
    const soloNumeros = text.replace(/[^0-9]/g, '');
    setCode(soloNumeros);
    if (errors.code) {
      setErrors((prev) => ({ ...prev, code: undefined }));
    }
  };

  const ejecutarVerificacion = async () => {
    setSubmitted(true);
    if (!validarFormulario()) {
      showToast('Introduce el código de 6 dígitos.', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await AuthService.verify(email, code);

      if (response && response.token) {
        showToast('Cuenta verificada con éxito', 'success');
        await signIn(response.token, response.user);
      } else {
        showToast('Cuenta verificada. Ya puedes iniciar sesión', 'success');
        navigation.navigate('Login');
      }
    } catch (error) {
      showToast(error.message || 'Código incorrecto o expirado', 'error');
    } finally {
      setLoading(false);
    }
  };

  const reenviarCodigo = async () => {
    setLoading(true);
    try {
      await AuthService.resendCode(email);
      showToast('Se ha enviado un nuevo código a tu correo.', 'success');
    } catch (error) {
      showToast(error.message || 'No se pudo reenviar el código', 'error');
    } finally {
      setLoading(false);
    }
  };

  const volverAlLogin = () => {
    navigation.replace('Login');
  };

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
            onChangeText={handleChange}
            mode="outlined"
            keyboardType="number-pad"
            maxLength={6}
            style={globalStyles.input}
            outlineStyle={{ borderRadius: 30 }}
            left={<TextInput.Icon icon="shield-check" />}
            error={!!errors.code}
          />
          {errors.code ? <HelperText type="error" visible={true}>{errors.code}</HelperText> : null}

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