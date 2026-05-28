import React, { useState, useMemo } from 'react';
import { View, KeyboardAvoidingView, Platform, useColorScheme} from 'react-native';
import { TextInput, Button,Text, HelperText} from 'react-native-paper';
import { getColors, getglobalStyles } from '../../theme/theme';
import { LinearGradient } from "expo-linear-gradient";
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';
import { AuthService } from '../../api/apiService';
import { useToast } from '../../context/ToastContext';


export default function ResetScreen({ navigation }) {
  const scheme = useColorScheme();
  const showToast = useToast();
  const { isWeb, platform } = useResponsiveLayout();
  
  const colors = useMemo(() => getColors(scheme), [scheme]);
  const globalStyles = useMemo(() => getglobalStyles(scheme, isWeb), [scheme, isWeb]);
  
  const [identifier, setIdentifier] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validarFormulario = () => {
    const nuevosErrores = {};
    if (!identifier.trim()) nuevosErrores.identifier = 'El email o usuario es obligatorio';
    if (!newPassword) {
      nuevosErrores.newPassword = 'La nueva contraseña es obligatoria';
    } else if (newPassword.length < 6) {
      nuevosErrores.newPassword = 'La contraseña debe tener al menos 6 caracteres';
    }
    if (!confirmPassword) {
      nuevosErrores.confirmPassword = 'Confirma tu nueva contraseña';
    } else if (newPassword !== confirmPassword) {
      nuevosErrores.confirmPassword = 'Las contraseñas no coinciden';
    }
    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleChange = (setter, field) => (text) => {
    setter(text);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const ejecutarReset = async () => {
    setSubmitted(true);
    if (!validarFormulario()) {
      showToast('Revisa los campos marcados en rojo', 'error');
      return;
    }

    setLoading(true);
    
    try {
      await AuthService.resetPassword({
        identifier: identifier.trim(),
        password: newPassword
      });

      showToast("Contraseña actualizada correctamente", 'success');
      navigation.replace('Login');
      
    } catch (error) {
      console.error("Error en reset:", error);
      showToast(error.message || "No se pudo restablecer la contraseña", 'error');
    } finally {
      setLoading(false);
    }
  };

  const volverAlLogin = () => {
    navigation.replace('Login');
  };

  return (
    <LinearGradient colors={[colors.background, colors.primary, colors.background]} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
    
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
            <Text style={globalStyles.logoSubtitle}>Restablecer contraseña</Text>
          </View>
          
          <TextInput
            label="Email o Usuario"
            value={identifier}
            onChangeText={handleChange(setIdentifier, 'identifier')}
            mode="outlined"
            autoCapitalize="none"
            style={globalStyles.input}
            outlineStyle={{ borderRadius: 30 }}
            left={<TextInput.Icon icon="account" />}
            error={!!errors.identifier}
          />
          {errors.identifier ? <HelperText type="error" visible={true}>{errors.identifier}</HelperText> : null}
          
          <TextInput
            label="Nueva contraseña"
            value={newPassword}
            onChangeText={handleChange(setNewPassword, 'newPassword')}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={globalStyles.input}
            outlineStyle={{ borderRadius: 30 }}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon 
                icon={showPassword ? "eye-off" : "eye"} 
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            error={!!errors.newPassword}
          />
          {errors.newPassword ? <HelperText type="error" visible={true}>{errors.newPassword}</HelperText> : null}
          
          <TextInput
            label="Confirmar nueva contraseña"
            value={confirmPassword}
            onChangeText={handleChange(setConfirmPassword, 'confirmPassword')}
            mode="outlined"
            secureTextEntry={!showConfirmPassword}
            style={globalStyles.input}
            outlineStyle={{ borderRadius: 30 }}
            left={<TextInput.Icon icon="lock-check" />}
            right={
              <TextInput.Icon 
                icon={showConfirmPassword ? "eye-off" : "eye"} 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
            error={!!errors.confirmPassword}
          />
          {errors.confirmPassword ? <HelperText type="error" visible={true}>{errors.confirmPassword}</HelperText> : null}

          <View style={globalStyles.botonera}>
            <Button
              mode="contained"
              onPress={ejecutarReset}
              loading={loading}
              disabled={loading}
              buttonColor={colors.primary} textColor={colors.background}
              style={[globalStyles.button, { flex: 1 }]}
              labelStyle={{ fontSize: 16 }}
            >
              Restablecer
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
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}