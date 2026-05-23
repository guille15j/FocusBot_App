import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
  Pressable,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  HelperText,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getColors, getglobalStyles } from '../../theme/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { AuthService } from '../../api/apiService';
import { useToast } from '../../context/ToastContext';

const DateTimePicker = !Platform.isWeb
  ? require('@react-native-community/datetimepicker').default
  : null;

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
  const [birthdate, setBirthdate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  const handleChange = (setter, field) => (text) => {
    setter(text);
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const onChangeDate = (event, selectedDate) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (event.type === 'dismissed' || !selectedDate) return;
    setBirthdate(selectedDate);
    if (Platform.OS === 'ios') setShowDatePicker(false);
  };

  const ejecutarRegistro = async () => {
    if (!validarFormulario()) {
      showToast('Revisa los campos marcados en rojo', 'error');
      return;
    }
    setLoading(true);
    try {
      const userData = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        nickname: nickname.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        birth_date: formatDate(birthdate),
      };
      await AuthService.register(userData);
      showToast('Usuario registrado. Revisa tu correo para el código de verificación.', 'success');
      navigation.navigate('Verify', { email: email.toLowerCase() });
    } catch (error) {
      showToast(error.message || 'No se pudo completar el registro', 'error');
    } finally {
      setLoading(false);
    }
  };

  const volverAlLogin = () => navigation.replace('Login');
  const birthdateString = formatDate(birthdate);

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
              <Text style={globalStyles.logoSubtitle}>Crear cuenta</Text>
            </View>

            <TextInput label="Nombre" value={firstName} onChangeText={handleChange(setFirstName, 'firstName')} mode="outlined" style={globalStyles.input} outlineStyle={{ borderRadius: 30 }} left={<TextInput.Icon icon="account" />} error={!!errors.firstName} />
            {errors.firstName ? <HelperText type="error" visible={true}>{errors.firstName}</HelperText> : null}

            <TextInput label="Apellidos" value={lastName} onChangeText={handleChange(setLastName, 'lastName')} mode="outlined" style={globalStyles.input} outlineStyle={{ borderRadius: 30 }} left={<TextInput.Icon icon="account-group" />} error={!!errors.lastName} />
            {errors.lastName ? <HelperText type="error" visible={true}>{errors.lastName}</HelperText> : null}

            <TextInput label="Usuario" value={nickname} onChangeText={handleChange(setNickname, 'nickname')} mode="outlined" autoCapitalize="none" style={globalStyles.input} outlineStyle={{ borderRadius: 30 }} left={<TextInput.Icon icon="at" />} error={!!errors.nickname} />
            {errors.nickname ? <HelperText type="error" visible={true}>{errors.nickname}</HelperText> : null}

            <TextInput label="Email" value={email} onChangeText={handleChange(setEmail, 'email')} mode="outlined" keyboardType="email-address" autoCapitalize="none" style={globalStyles.input} outlineStyle={{ borderRadius: 30 }} left={<TextInput.Icon icon="email" />} error={!!errors.email} />
            {errors.email ? <HelperText type="error" visible={true}>{errors.email}</HelperText> : null}

            <TextInput label="Contraseña" value={password} onChangeText={handleChange(setPassword, 'password')} mode="outlined" secureTextEntry={!showPassword} style={globalStyles.input} outlineStyle={{ borderRadius: 30 }} left={<TextInput.Icon icon="lock" />} right={<TextInput.Icon icon={showPassword ? 'eye-off' : 'eye'} onPress={() => setShowPassword(!showPassword)} />} error={!!errors.password} />
            {errors.password ? <HelperText type="error" visible={true}>{errors.password}</HelperText> : null}

            <TextInput label="Confirmar contraseña" value={confirmPassword} onChangeText={handleChange(setConfirmPassword, 'confirmPassword')} mode="outlined" secureTextEntry={!showConfirmPassword} style={globalStyles.input} outlineStyle={{ borderRadius: 30 }} left={<TextInput.Icon icon="lock-check" />} right={<TextInput.Icon icon={showConfirmPassword ? 'eye-off' : 'eye'} onPress={() => setShowConfirmPassword(!showConfirmPassword)} />} error={!!errors.confirmPassword} />
            {errors.confirmPassword ? <HelperText type="error" visible={true}>{errors.confirmPassword}</HelperText> : null}

            {/* Fecha de nacimiento con aspecto de TextInput */}
            {isWeb ? (
              <input
                type="date"
                value={birthdateString}
                onChange={(e) => {
                  const newDate = new Date(e.target.value + 'T00:00:00');
                  if (!isNaN(newDate.getTime())) setBirthdate(newDate);
                }}
                max={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '30px',
                  border: `1px solid ${errors.birthdate ? colors.error : colors.border || 'rgba(0,0,0,0.12)'}`,
                  backgroundColor: colors.background,
                  color: colors.text,
                  fontFamily: 'inherit',
                  fontSize: '15px',
                  outline: 'none',
                  boxSizing: 'border-box',
                  marginBottom: 8,
                }}
              />
            ) : (
              <Pressable onPress={() => setShowDatePicker(true)}>
                <View pointerEvents="none">
                  <TextInput
                    label="Fecha de nacimiento"
                    value={birthdateString}
                    mode="outlined"
                    editable={false}
                    style={globalStyles.input}
                    outlineStyle={{ borderRadius: 30 }}
                    left={<TextInput.Icon icon="calendar" />}
                    error={!!errors.birthdate}
                  />
                </View>
              </Pressable>
            )}
            {errors.birthdate ? <HelperText type="error" visible={true}>{errors.birthdate}</HelperText> : null}

            {showDatePicker && DateTimePicker && (
              <DateTimePicker
                value={birthdate}
                mode="date"
                display={platform === 'ios' ? 'spinner' : 'default'}
                onChange={onChangeDate}
                maximumDate={new Date()}
              />
            )}

            <View style={globalStyles.botonera}>
              <Button mode="contained" onPress={ejecutarRegistro} loading={loading} disabled={loading} style={[globalStyles.button, { flex: 1 }]} buttonColor={colors.primary} textColor={colors.background} labelStyle={{ fontSize: 16, fontWeight: '600' }}>Registrarse</Button>
              <Button mode="outlined" onPress={volverAlLogin} disabled={loading} style={[globalStyles.buttonOutline, { flex: 1 }]}>Cancelar</Button>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}