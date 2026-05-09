import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useContext, useMemo } from 'react';
import { View, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, useColorScheme, ScrollView, Animated } from 'react-native';
import { TextInput, Button, Text, Surface, Divider } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import { authStorage } from '../../core/authStorage';
import { getColors, getglobalStyles } from '../../theme/theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import {AuthService} from '../../api/apiService';

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

  const ejecutarLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Atención', 'Por favor, introduce tu email/usuario y contraseña');
      return;
    }

    setLoading(true);

    try {
      const response = await AuthService.login(email,password);
      
      if (response && response.token){
        await signIn(response.token, response.user);
      }

    } catch (error) {
      Alert.alert('Error de acceso', error.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  const ejecutarGoogleLogin = () => {
    // Simulación de login con Google (solo maquetación)
    console.log('Botón de Google presionado. Próximamente: integración OAuth2.');
    Alert.alert('Google Login', 'La autenticación con Google estará disponible próximamente.');
  };

  const irARegistro = () => navigation.replace('Register');
  const irAReset = () => navigation.navigate('Reset');

  return (
    <LinearGradient colors={[colors.background, colors.primary]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <KeyboardAvoidingView style={isWeb ? globalStyles.authContainer_web : globalStyles.authContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <View style={globalStyles.form} elevation={4}>
            <View style={globalStyles.logoContainer}>
              <View style={globalStyles.logoContainer_name}>
                <Text style={globalStyles.logo_focus}>Focus</Text>
                <Text style={globalStyles.logo_bot}>.Bot</Text>
              </View>
              <Text style={globalStyles.logoSubtitle}>Deep in your Focus</Text>
            </View>
            <TextInput label="Email o Usuario" value={email} onChangeText={setEmail} mode="outlined" keyboardType="email-address" autoCapitalize="none" style={globalStyles.input} outlineStyle={{ borderRadius: 30 }} left={<TextInput.Icon icon="account" />} />
            <TextInput label="Contraseña" value={password} onChangeText={setPassword} mode="outlined" secureTextEntry={!showPassword} style={globalStyles.input} outlineStyle={{ borderRadius: 30 }} left={<TextInput.Icon icon="lock" />} right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(!showPassword)} />} />
            <TouchableOpacity onPress={irAReset} style={globalStyles.linkContainer}>
              <Text style={[globalStyles.link, { fontSize: 14 }]}>¿Has olvidado la contraseña?</Text>
            </TouchableOpacity>
            <View style={globalStyles.botonera}>
              <Button mode="contained" onPress={ejecutarLogin} loading={loading} disabled={loading} style={[globalStyles.button, { flex: 1 }]} buttonColor={colors.primary} textColor={colors.background} labelStyle={{ fontSize: 16, fontWeight: '600' }}>Sign in</Button>
              <Button mode="outlined" onPress={irARegistro} disabled={loading} style={[globalStyles.buttonOutline, { flex: 1 }]} labelStyle={{ fontSize: 16 }}>Sign up</Button>
            </View>

            {/* Separador visual */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
              <Divider style={{ flex: 1 }} />
              <Text style={{ marginHorizontal: 12, color: colors.textLight, fontSize: 12, fontWeight: '600' }}>o</Text>
              <Divider style={{ flex: 1 }} />
            </View>

            {/* Botón de Google */}
            <Button
              mode="outlined"
              onPress={ejecutarGoogleLogin}
              disabled={loading}
              icon="google"
              style={[
                globalStyles.buttonOutline,
                { borderColor: colors.textLight, borderWidth: 1.5 }
              ]}
              labelStyle={{ fontSize: 14, fontWeight: '600', color: colors.text }}
              contentStyle={{ paddingVertical: 6 }}
            >
              Continuar con Google
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}