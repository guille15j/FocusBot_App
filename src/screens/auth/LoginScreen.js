import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useContext, useMemo } from 'react';
import { View, Alert, TouchableOpacity, KeyboardAvoidingView, Platform, useColorScheme } from 'react-native';
import { TextInput, Button, Text, Surface } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import { authStorage } from '../../core/authStorage';
import { getColors, getglobalStyles } from '../../theme/theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

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
      Alert.alert("Atención", "Por favor, introduce tu email/usuario y contraseña");
      return;
    }
    setLoading(true);
    try {
      console.log("Intentando login con:", email);
      await new Promise(resolve => setTimeout(resolve, 1000));
      const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake-jwt-token-12345";
      const fakeUser = {
        id: 1,
        first_name: "Usuario",
        last_name: "Demo",
        nickname: email.split('@')[0],
        email: email,
        profile_img: "",
      };
      await authStorage.saveToken(fakeToken);
      await authStorage.saveUser(fakeUser);
      signIn(fakeToken, fakeUser);
      Alert.alert("¡Bienvenido!", `Hola ${fakeUser.first_name}!`);
    } catch (error) {
      console.error("Error en login:", error);
      Alert.alert("Error de acceso", "No se pudo iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoading(false);
    }
  };

  const irARegistro = () => navigation.replace('Register');
  const irAReset = () => navigation.navigate('Reset');

  return (
    <LinearGradient colors={[colors.background, colors.primary]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <KeyboardAvoidingView style={isWeb ? globalStyles.authContainer_web : globalStyles.authContainer} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={globalStyles.form} elevation={4}>
          <View style={globalStyles.logoContainer}>
            <View style={globalStyles.logoContainer_name}>
              <Text style={globalStyles.logo_focus}>Focus</Text>
              <Text style={globalStyles.logo_bot}>.Bot</Text>
            </View>
            <Text style={globalStyles.logoSubtitle}>Deep in your Focus</Text>
          </View>
          <TextInput label="Email o Usuario" value={email} onChangeText={setEmail} mode="outlined" keyboardType="email-address" autoCapitalize="none" style={globalStyles.input} outlineStyle={{ borderRadius: 30 }} left={<TextInput.Icon icon="account" />} />
          <TextInput label="Contraseña" value={password} onChangeText={setPassword} mode="outlined" secureTextEntry={!showPassword} style={globalStyles.input} outlineStyle={{ borderRadius: 30 }} left={<TextInput.Icon icon="lock" />} right={<TextInput.Icon icon={showPassword ? "eye-off" : "eye"} onPress={() => setShowPassword(!showPassword)} />} />
          <TouchableOpacity onPress={irAReset} style={{ alignSelf: 'center' }}>
            <Text style={[globalStyles.link, { fontSize: 14 }]}>Recuperar Contraseña</Text>
          </TouchableOpacity>
          <View style={globalStyles.botonera}>
            <Button mode="contained" onPress={ejecutarLogin} loading={loading} disabled={loading} style={[globalStyles.button, { flex: 1 }]} labelStyle={{ fontSize: 16, fontWeight: '600' }}>Sign in</Button>
            <Button mode="outlined" onPress={irARegistro} disabled={loading} style={[globalStyles.buttonOutline, { flex: 1 }]} labelStyle={{ fontSize: 16 }}>Sign up</Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}