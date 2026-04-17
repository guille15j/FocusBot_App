import React, { useState, useContext } from 'react';
import { 
  View, 
  Alert, 
  ScrollView,           
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
import { LinearGradient } from "expo-linear-gradient";
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';



export default function RegisterScreen({ navigation }) {
  
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

  const ejecutarRegistro = async () => {

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);
    
    try {
      console.log("Registrando usuario:", email);
      
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
      
      console.log("Datos enviados:", userData);
      
      // Simulamos respuesta exitosa del servidor
      const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake-register-token-67890";
      const fakeUser = {
        id: 2,
        first_name: firstName,
        last_name: lastName,
        nickname: nickname,
        email: email,
      };
      
      await authStorage.saveToken(fakeToken);
      await authStorage.saveUser(fakeUser);

      signIn(fakeToken, fakeUser);
      
      Alert.alert("¡Registro exitoso!", `Bienvenido/a ${firstName}!`);
      
    } catch (error) {
      console.error("Error en registro:", error);
      Alert.alert("Error de registro", "No se pudo completar el registro");
    } finally {
      setLoading(false);
    }
  };

  const volverAlLogin = () => {
    navigation.replace('Login');
  };
  
  const { isWeb } = useResponsiveLayout();

  return (
    <LinearGradient
          colors={[AppColors.primary, AppColors.background]}   // azul añil → blanco
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ flex: 1 }}
        >
      <KeyboardAvoidingView 
        style={isWeb ?  globalStyles.authContainer_web : globalStyles.authContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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