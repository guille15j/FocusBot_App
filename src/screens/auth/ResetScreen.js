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

export default function ResetScreen({ navigation }) {
  const scheme = useColorScheme();
  const { isWeb } = useResponsiveLayout();
  
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
      Alert.alert("Error", "Introduce tu email o nombre de usuario");
      return;
    }
    if (!newPassword) {
      Alert.alert("Error", "Introduce la nueva contraseña");
      return;
    }
    if (newPassword.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    
    try {
      console.log("Solicitando reset de contraseña para:", identifier);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        "Contraseña actualizada", 
        "Tu contraseña ha sido cambiada correctamente.",
        [
          { 
            text: "Ir al Login", 
            onPress: () => navigation.replace('Login') 
          }
        ]
      );
      
    } catch (error) {
      console.error("Error en reset:", error);
      Alert.alert("Error", "No se pudo restablecer la contraseña");
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