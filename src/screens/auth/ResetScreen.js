// ============================================================
// IMPORTS
// ============================================================

import React, { useState } from 'react';
import { 
  View, 
  Alert, 
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native';
import { 
  TextInput, 
  Button, 
  Text, 
  Surface 
} from 'react-native-paper';
import { globalStyles, AppColors } from '../../theme/theme';

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function ResetScreen({ navigation }) {
  
  // Estados
  const [identifier, setIdentifier] = useState(''); // Puede ser email o username
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // ----------------------------------------------------------
  // FUNCIÓN: ejecutarReset
  // Envía la solicitud para cambiar la contraseña
  // ----------------------------------------------------------
  const ejecutarReset = async () => {
    
    // Validación
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
      console.log("🔑 Solicitando reset de contraseña para:", identifier);
      
      // Simulamos petición al servidor
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        "✅ Contraseña actualizada", 
        "Tu contraseña ha sido cambiada correctamente.",
        [
          { 
            text: "Ir al Login", 
            onPress: () => navigation.replace('Login') 
          }
        ]
      );
      
    } catch (error) {
      console.error("❌ Error en reset:", error);
      Alert.alert("Error", "No se pudo restablecer la contraseña");
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------------
  // FUNCIÓN: volverAlLogin
  // ----------------------------------------------------------
  const volverAlLogin = () => {
    navigation.replace('Login');
  };

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------
  return (
    <KeyboardAvoidingView 
      style={globalStyles.authContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Surface style={globalStyles.card} elevation={4}>
        
        {/* ========== TÍTULO ========== */}
        <View style={globalStyles.logoContainer}>
          <Text style={[globalStyles.logo, { fontSize: 36 }]}>Focus.Bot</Text>
          <Text style={globalStyles.logoSubtitle}>Reset Password</Text>
        </View>
        
        {/* ========== FORMULARIO ========== */}
        
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
        
        {/* ========== BOTONES ========== */}
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
        
        {/* ========== LINK VOLVER ========== */}
        <TouchableOpacity onPress={volverAlLogin} style={globalStyles.linkContainer}>
          <Text style={globalStyles.link}>← Back to Login</Text>
        </TouchableOpacity>
        
      </Surface>
    </KeyboardAvoidingView>
  );
}