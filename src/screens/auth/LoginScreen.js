import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useContext } from 'react';
import { 
  View,           // Contenedor básico
  Alert,          // Para mostrar alertas
  TouchableOpacity, // Para hacer elementos clickeables
  KeyboardAvoidingView, // Para que el teclado no tape los inputs
  Platform        // Para detectar si es iOS o Android
} from 'react-native';
import { 
  TextInput,      // Campo de texto
  Button,         // Botón
  Text,           // Texto estilizado
  Surface         // Superficie con sombra
} from 'react-native-paper';

// Importamos el contexto de autenticación
import { AuthContext } from '../../context/AuthContext';
import { authStorage } from '../../core/authStorage';
import { globalStyles, AppColors } from '../../theme/theme';
import { useResponsiveLayout } from '../../hooks/useResponsiveLayout';


export default function LoginScreen({ navigation }) {

  // email: guarda lo que el usuario escribe en el campo email/username
  const [email, setEmail] = useState('');
  
  // password: guarda la contraseña
  const [password, setPassword] = useState('');
  
  // loading: true = mostramos spinner, false = mostramos botón normal
  const [loading, setLoading] = useState(false);
  
  // showPassword: true = se ve la contraseña, false = se oculta con puntitos
  const [showPassword, setShowPassword] = useState(false);

  const { signIn } = useContext(AuthContext);

  const ejecutarLogin = async () => {
    
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        "Atención", 
        "Por favor, introduce tu email/usuario y contraseña"
      );
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
        nickname: email.split('@')[0], // Usamos la parte antes del @ como nickname
        email: email,
        profile_img: "",
      };
      
      console.log("Login exitoso!");
      
      await authStorage.saveToken(fakeToken);
      await authStorage.saveUser(fakeUser);
      
      signIn(fakeToken, fakeUser);
      
      
      Alert.alert("¡Bienvenido!", `Hola ${fakeUser.first_name}!`);
      
    } catch (error) {
      console.error("Error en login:", error);
      Alert.alert(
        "Error de acceso", 
        "No se pudo iniciar sesión. Verifica tus credenciales."
      );
    } finally {
      setLoading(false);
    }
  };

  const irARegistro = () => {
    navigation.replace('Register'); // replace evita que puedas volver atrás
  };

  const irAReset = () => {
    navigation.navigate('Reset');
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
        
        <View style={globalStyles.form} elevation={4}>
          <View style={globalStyles.logoContainer}>
            <View style={globalStyles.logoContainer_name}>
              <Text style={globalStyles.logo_focus}>Focus</Text>
              <Text style={globalStyles.logo_bot}>.Bot</Text>
            </View>
            <Text style={globalStyles.logoSubtitle}>Deep in your Focus</Text>
          </View>
          
          
          {/* Campo: Email o Usuario */}
          <TextInput
            label="Email o Usuario"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"  // No pone mayúscula automáticamente
            style={globalStyles.input}
            outlineStyle={{ borderRadius: 30 }}
            left={<TextInput.Icon icon="account" />}
          />
          
          {/* Campo: Contraseña */}
          <TextInput
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword} // Oculta o muestra según showPassword
            style={globalStyles.input}
            outlineStyle={{ borderRadius: 30 }}
            left={<TextInput.Icon icon="lock" />}
            // Botón para mostrar/ocultar contraseña
            right={
              <TextInput.Icon 
                icon={showPassword ? "eye-off" : "eye"} 
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />
          
          {/* LINK "OLVIDÉ CONTRASEÑA" */}
          <TouchableOpacity onPress={irAReset} style={{ alignSelf: 'center' }}>
            <Text style={[globalStyles.link, { fontSize: 14 }]}>
              Recuperar Contraseña
            </Text>
          </TouchableOpacity>
          
          <View style={globalStyles.botonera}>
            
            <Button
              mode="contained"
              onPress={ejecutarLogin}
              loading={loading}        // Muestra spinner si loading=true
              disabled={loading}       // Deshabilita el botón si está cargando
              style={[globalStyles.button, { flex: 1 }]}
              labelStyle={{ fontSize: 16, fontWeight: '600' }}
            >
              Sign in
            </Button>
            
            <Button
              mode="outlined"
              onPress={irARegistro}
              disabled={loading}
              style={[globalStyles.buttonOutline, { flex: 1 }]}
              labelStyle={{ fontSize: 16 }}
            >
              Sign up
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
    
  );
}