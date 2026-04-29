import React, { useState, useMemo } from 'react';
import {
  View,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useColorScheme
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface
} from 'react-native-paper';
import { getColors, getglobalStyles } from '../../theme/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';

export default function RegisterScreen({ navigation }) {
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();
  
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [birthdate, setBirthdate] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const notificar = (mensaje) => {
  if (Platform.OS === 'web') {
      // En web usamos el alert nativo del navegador
      window.alert(mensaje);
    } else {
      // En móviles usamos el componente de React Native
      Alert.alert('Atención', mensaje);
    }
};

  const validarFormulario = () => {
    if (!firstName.trim()) {
      notificar('El nombre es obligatorio');
      return false;
    }
    if (!lastName.trim()) {
      notificar('Los apellidos son obligatorios');
      return false;
    }
    if (!nickname.trim()) {
      notificar('El nombre de usuario es obligatorio');
      return false;
    }
    if (!email.trim()) {
      notificar('El email es obligatorio');
      return false;
    }
    if (!email.includes('@') || !email.includes('.')) {
      notificar('Introduce un email válido');
      return false;
    }
    if (!password) {
      notificar('La contraseña es obligatoria');
      return false;
    }
    if (password.length < 6) {
      notificar('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (password !== confirmPassword) {
      notificar('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const ejecutarRegistro = async () => {
    console.log('hola');

    if (!validarFormulario()) {
      console.log('Error de validacion');
      return;
    }
    setLoading(true);
    
    try {
      // Simulación de registro exitoso (sin token)

      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(true)
      // Navegar a la pantalla de verificación con el email
      // navigation.replace('Verify');
      navigation.navigate('Verify', { email: email.toLowerCase().trim() });
      
    } catch (error) {
      console.error('Error en registro:', error);
      Alert.alert('Error de registro', 'No se pudo completar el registro');
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
        enabled={Platform.OS !== 'web'}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        >
          <View style={globalStyles.form} elevation={4}>
            
            <View style={globalStyles.logoContainer}>
              <View style={globalStyles.logoContainer_name}>
                <Text style={globalStyles.logo_focus}>Focus</Text>
                <Text style={globalStyles.logo_bot}>.Bot</Text>
              </View>
              <Text style={globalStyles.logoSubtitle}>Create Account</Text>
            </View>
            
            <TextInput
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              mode="outlined"
              style={globalStyles.input}
              outlineStyle={{ borderRadius: 30 }}
              left={<TextInput.Icon icon="account" />}
            />
            
            <TextInput
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              mode="outlined"
              style={globalStyles.input}
              outlineStyle={{ borderRadius: 30 }}
              left={<TextInput.Icon icon="account-group" />}
            />
            
            <TextInput
              label="Nickname"
              value={nickname}
              onChangeText={setNickname}
              mode="outlined"
              autoCapitalize="none"
              style={globalStyles.input}
              outlineStyle={{ borderRadius: 30 }}
              left={<TextInput.Icon icon="at" />}
            />
            
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={globalStyles.input}
              outlineStyle={{ borderRadius: 30 }}
              left={<TextInput.Icon icon="email" />}
            />
            
            <TextInput
              label="Password"
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
            
            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              style={globalStyles.input}
              outlineStyle={{ borderRadius: 30 }}
              left={<TextInput.Icon icon="lock-check" />}
              right={
                <TextInput.Icon 
                  icon={showConfirmPassword ? 'eye-off' : 'eye'} 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
            />
            
            <TextInput
              label="Birthdate (YYYY-MM-DD)"
              value={birthdate}
              onChangeText={setBirthdate}
              mode="outlined"
              placeholder="1990-01-01"
              style={globalStyles.input}
              outlineStyle={{ borderRadius: 30 }}
              left={<TextInput.Icon icon="calendar" />}
            />
            
            <View style={globalStyles.botonera}>
              <Button
                mode="contained"
                onPress={ejecutarRegistro}
                loading={loading}
                disabled={loading}
                style={[globalStyles.button, { flex: 1 }]}
                labelStyle={{ fontSize: 16, fontWeight: '600' }}
              >
                Register
              </Button>
              
              <Button
                mode="outlined"
                onPress={volverAlLogin}
                disabled={loading}
                style={[globalStyles.buttonOutline, { flex: 1 }]}
              >
                Cancel
              </Button>
            </View>            
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}