import React, { useState, useMemo } from 'react';
import { 
  View, 
  Alert, 
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  useColorScheme
} from 'react-native';
import { 
  TextInput, 
  Button, 
  Text, 
  Surface 
} from 'react-native-paper';
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

  const ejecutarReset = async () => {
    if (!identifier.trim()) {
      showToast("Introduce tu email o nombre de usuario",'error');
      return;
    }
    if (!newPassword) {
      showToast( "Introduce la nueva contraseña",'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast("La contraseña debe tener al menos 6 caracteres",'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Las contraseñas no coinciden",'error');
      return;
    }

    setLoading(true);
    
    try {
      
      const response = await AuthService.resetPassword({
        identifier: identifier.trim(),
        password: newPassword
      });
      
      // Alert.alert(
      //   "Contraseña actualizada", 
      //   "Tu contraseña ha sido cambiada correctamente.",
      //   [
      //     { 
      //       text: "Iniciar Sesión", 
      //       onPress: () => navigation.replace('Login') 
      //     }
      //   ]
      // );

      showToast("Contraseña actualizada", 'success');

      navigation.replace('Login')
      
    } catch (error) {
      console.error("Error en reset:", error);
      showToast( error.message || "No se pudo restablecer la contraseña",'error');
    } finally {
      setLoading(false);
    }
  };

  const volverAlLogin = () => {
    navigation.replace('Login');
  };

  return (
        <LinearGradient colors={[colors.background, colors.primary,colors.background]} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
    
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
            <Text style={globalStyles.logoSubtitle}>Reset Password</Text>
          </View>
          
          <TextInput
            label="Email o Username"
            value={identifier}
            onChangeText={setIdentifier}
            mode="outlined"
            autoCapitalize="none"
            style={globalStyles.input}
            outlineStyle={{ borderRadius: 30 }}
            left={<TextInput.Icon icon="account" />}
          />
          
          <TextInput
            label="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
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
          />
          
          <TextInput
            label="Confirm New Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
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
          />

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
              Reset
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
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}