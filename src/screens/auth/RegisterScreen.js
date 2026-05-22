import React, { useState, useMemo } from 'react';
import {
  View,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Surface,
  HelperText, 
} from 'react-native-paper';
import { getColors, getglobalStyles } from '../../theme/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { AuthService } from '../../api/apiService';
import { useToast } from '../../context/ToastContext';

export default function RegisterScreen({ navigation }) {
  const scheme = useColorScheme();
  const showToast = useToast();
  const { isWeb, platform } = useResponsiveLayout();

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

  // Estado para los mensajes de error
  const [errors, setErrors] = useState({});

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!firstName.trim()) nuevosErrores.firstName = 'El nombre es obligatorio';
    if (!lastName.trim()) nuevosErrores.lastName = 'Los apellidos son obligatorios';
    if (!nickname.trim()) nuevosErrores.nickname = 'El nombre de usuario es obligatorio';
    if (!email.trim()) {
      nuevosErrores.email = 'El email es obligatorio';
    } else if (!email.includes('@') || !email.includes('.')) {
      nuevosErrores.email = 'Introduce un email válido';
    }
    if (!password) {
      nuevosErrores.password = 'La contraseña es obligatoria';
    } else if (password.length < 6) {
      nuevosErrores.password = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!confirmPassword) {
      nuevosErrores.confirmPassword = 'Confirma tu contraseña';
    } else if (password !== confirmPassword) {
      nuevosErrores.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Borra el error de un campo al empezar a escribir
  const handleChange = (setter, field) => (text) => {
    setter(text);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const ejecutarRegistro = async () => {
    if (!validarFormulario()) return;

    setLoading(true);

    try {
      const userData = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        nickname: nickname.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        birth_date: birthdate, // Validado por tu DatePicker (YYYY-MM-DD)
        // timezone se omite intencionadamente para usar el default del server
      };

      // IMPORTANTE: Asegúrate de que AuthService.register esté recibiendo esto
      const response = await AuthService.register(userData);

      Alert.alert('Éxito', 'Usuario registrado. Revisa tu correo para el código de verificación.');
      navigation.navigate('Verify', { email: email.toLowerCase() });
    } catch (error) {
      console.log("Detalle del error 422:", error);
      Alert.alert('Error de registro', error.message || 'No se pudo completar el registro');
    } finally {
      setLoading(false);
    }
  };

  const volverAlLogin = () => {
    navigation.replace('Login');
  };

  return (
    <LinearGradient
      colors={[colors.background, colors.primary,colors.background]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={isWeb ? globalStyles.authContainer_web : globalStyles.authContainer}
        behavior={platform === 'ios' ? 'padding' : 'height'}
        enabled={!isWeb}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={globalStyles.form} elevation={4}>
            <View style={globalStyles.logoContainer}>
              <View style={globalStyles.logoContainer_name}>
                <Text style={globalStyles.logo_focus}>Focus</Text>
                <Text style={globalStyles.logo_bot}>.Bot</Text>
              </View>
              <Text style={globalStyles.logoSubtitle}>Create Account</Text>
            </View>

            {/* First Name */}
            <TextInput
              label="First Name"
              value={firstName}
              onChangeText={handleChange(setFirstName, 'firstName')}
              mode="outlined"
              style={globalStyles.input}
              outlineStyle={{ borderRadius: 30 }}
              left={<TextInput.Icon icon="account" />}
              error={!!errors.firstName}
            />
            <HelperText type="error" visible={!!errors.firstName}>
              {errors.firstName}
            </HelperText>

            {/* Last Name */}
            <TextInput
              label="Last Name"
              value={lastName}
              onChangeText={handleChange(setLastName, 'lastName')}
              mode="outlined"
              style={globalStyles.input}
              outlineStyle={{ borderRadius: 30 }}
              left={<TextInput.Icon icon="account-group" />}
              error={!!errors.lastName}
            />
            <HelperText type="error" visible={!!errors.lastName}>
              {errors.lastName}
            </HelperText>

            {/* Nickname */}
            <TextInput
              label="Nickname"
              value={nickname}
              onChangeText={handleChange(setNickname, 'nickname')}
              mode="outlined"
              autoCapitalize="none"
              style={globalStyles.input}
              outlineStyle={{ borderRadius: 30 }}
              left={<TextInput.Icon icon="at" />}
              error={!!errors.nickname}
            />
            <HelperText type="error" visible={!!errors.nickname}>
              {errors.nickname}
            </HelperText>

            {/* Email */}
            <TextInput
              label="Email"
              value={email}
              onChangeText={handleChange(setEmail, 'email')}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              style={globalStyles.input}
              outlineStyle={{ borderRadius: 30 }}
              left={<TextInput.Icon icon="email" />}
              error={!!errors.email}
            />
            <HelperText type="error" visible={!!errors.email}>
              {errors.email}
            </HelperText>

            {/* Password */}
            <TextInput
              label="Password"
              value={password}
              onChangeText={handleChange(setPassword, 'password')}
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
              error={!!errors.password}
            />
            <HelperText type="error" visible={!!errors.password}>
              {errors.password}
            </HelperText>

            {/* Confirm Password */}
            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={handleChange(setConfirmPassword, 'confirmPassword')}
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
              error={!!errors.confirmPassword}
            />
            <HelperText type="error" visible={!!errors.confirmPassword}>
              {errors.confirmPassword}
            </HelperText>

            {/* Birthdate */}
            <TextInput
              label="Birthdate (YYYY-MM-DD)"
              value={birthdate}
              onChangeText={handleChange(setBirthdate, 'birthdate')}
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
                buttonColor={colors.primary} textColor={colors.background}
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