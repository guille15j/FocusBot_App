// ============================================================
// IMPORTS
// ============================================================

import React, { useState, useContext } from 'react';
import { 
  View, 
  Alert, 
  ScrollView,           // Para hacer scroll cuando hay muchos campos
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
import { AuthContext } from '../../context/AuthContext';
import { authStorage } from '../../core/authStorage';
import { globalStyles, AppColors } from '../../theme/theme';

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function RegisterScreen({ navigation }) {
  
  // ----------------------------------------------------------
  // ESTADOS PARA CADA CAMPO DEL FORMULARIO
  // ----------------------------------------------------------
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

  const { signIn } = useContext(AuthContext);

  // ----------------------------------------------------------
  // FUNCIÓN: validarFormulario
  // Verifica que todos los campos cumplan los requisitos
  // ----------------------------------------------------------
  const validarFormulario = () => {
    if (!firstName.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return false;
    }
    if (!lastName.trim()) {
      Alert.alert("Error", "Los apellidos son obligatorios");
      return false;
    }
    if (!nickname.trim()) {
      Alert.alert("Error", "El nombre de usuario es obligatorio");
      return false;
    }
    if (!email.trim()) {
      Alert.alert("Error", "El email es obligatorio");
      return false;
    }
    // Validación básica de email
    if (!email.includes('@') || !email.includes('.')) {
      Alert.alert("Error", "Introduce un email válido");
      return false;
    }
    if (!password) {
      Alert.alert("Error", "La contraseña es obligatoria");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Error", "La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return false;
    }
    return true;
  };

  // ----------------------------------------------------------
  // FUNCIÓN: ejecutarRegistro
  // Se ejecuta al presionar "Register"
  // ----------------------------------------------------------
  const ejecutarRegistro = async () => {
    
    // 1. Validar formulario
    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    
    try {
      console.log("📝 Registrando usuario:", email);
      
      // Simulamos delay de servidor
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos que enviaríamos al backend
      const userData = {
        first_name: firstName,
        last_name: lastName,
        nickname: nickname,
        email: email.toLowerCase().trim(),
        birth_date: birthdate || null,
        password: password,
      };
      
      console.log("📦 Datos enviados:", userData);
      
      // Simulamos respuesta exitosa del servidor
      const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake-register-token-67890";
      const fakeUser = {
        id: 2,
        first_name: firstName,
        last_name: lastName,
        nickname: nickname,
        email: email,
      };
      
      // Guardar token y usuario
      await authStorage.saveToken(fakeToken);
      await authStorage.saveUser(fakeUser);
      
      // Notificar al contexto global
      signIn(fakeToken, fakeUser);
      
      Alert.alert("¡Registro exitoso!", `Bienvenido/a ${firstName}!`);
      
    } catch (error) {
      console.error("❌ Error en registro:", error);
      Alert.alert("Error de registro", "No se pudo completar el registro");
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
      {/* ScrollView permite hacer scroll si el formulario es muy largo */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      >
        <Surface style={globalStyles.card} elevation={4}>
          
          {/* ========== TÍTULO ========== */}
          <View style={globalStyles.logoContainer}>
            <Text style={[globalStyles.logo, { fontSize: 36 }]}>Focus.Bot</Text>
            <Text style={globalStyles.logoSubtitle}>Create Account</Text>
          </View>
          
          {/* ========== FORMULARIO ========== */}
          
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
                icon={showPassword ? "eye-off" : "eye"} 
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
                icon={showConfirmPassword ? "eye-off" : "eye"} 
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
          
          {/* ========== BOTONES ========== */}
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
          
          {/* ========== LINK PARA VOLVER ========== */}
          <TouchableOpacity onPress={volverAlLogin} style={globalStyles.linkContainer}>
            <Text style={globalStyles.link}>Already have an account? Sign in</Text>
          </TouchableOpacity>
          
        </Surface>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}