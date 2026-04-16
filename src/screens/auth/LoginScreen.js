// ============================================================
// IMPORTS
// ============================================================

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

// Importamos el almacenamiento para guardar token/usuario
import { authStorage } from '../../core/authStorage';

// Importamos estilos globales y colores
import { globalStyles, AppColors } from '../../theme/theme';

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export default function LoginScreen({ navigation }) {
  
  // ----------------------------------------------------------
  // ESTADOS - Variables que cambian con la interacción del usuario
  // ----------------------------------------------------------
  
  // email: guarda lo que el usuario escribe en el campo email/username
  const [email, setEmail] = useState('');
  
  // password: guarda la contraseña
  const [password, setPassword] = useState('');
  
  // loading: true = mostramos spinner, false = mostramos botón normal
  const [loading, setLoading] = useState(false);
  
  // showPassword: true = se ve la contraseña, false = se oculta con puntitos
  const [showPassword, setShowPassword] = useState(false);

  // ----------------------------------------------------------
  // CONTEXTO - Obtenemos la función signIn del contexto global
  // ----------------------------------------------------------
  const { signIn } = useContext(AuthContext);

  // ----------------------------------------------------------
  // FUNCIÓN: ejecutarLogin
  // Se ejecuta cuando el usuario presiona "Sign in"
  // ----------------------------------------------------------
  const ejecutarLogin = async () => {
    
    // 1. VALIDACIÓN - Verificamos que los campos no estén vacíos
    if (!email.trim() || !password.trim()) {
      Alert.alert(
        "Atención", 
        "Por favor, introduce tu email/usuario y contraseña"
      );
      return; // Salimos de la función, no continuamos
    }

    // 2. ACTIVAMOS EL LOADING
    setLoading(true);
    
    try {
      // 3. SIMULAMOS UNA PETICIÓN AL SERVIDOR
      // En una app real, aquí harías un fetch a tu API
      console.log("🔐 Intentando login con:", email);
      
      // Simulamos un delay de 1 segundo (como si esperáramos al servidor)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Datos falsos para la demo
      const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake-jwt-token-12345";
      const fakeUser = {
        id: 1,
        first_name: "Usuario",
        last_name: "Demo",
        nickname: email.split('@')[0], // Usamos la parte antes del @ como nickname
        email: email,
        profile_img: "",
      };
      
      console.log("✅ Login exitoso!");
      
      // 4. GUARDAMOS EL TOKEN Y USUARIO EN EL ALMACENAMIENTO LOCAL
      await authStorage.saveToken(fakeToken);
      await authStorage.saveUser(fakeUser);
      
      // 5. NOTIFICAMOS AL CONTEXTO GLOBAL QUE HAY SESIÓN INICIADA
      // Esto hará que App.js cambie de pantallas de auth a Home
      signIn(fakeToken, fakeUser);
      
      // 6. MOSTRAMOS MENSAJE DE ÉXITO
      Alert.alert("¡Bienvenido!", `Hola ${fakeUser.first_name}!`);
      
    } catch (error) {
      // Si algo sale mal, mostramos el error
      console.error("❌ Error en login:", error);
      Alert.alert(
        "Error de acceso", 
        "No se pudo iniciar sesión. Verifica tus credenciales."
      );
    } finally {
      // 7. DESACTIVAMOS EL LOADING (se ejecuta siempre, con éxito o error)
      setLoading(false);
    }
  };

  // ----------------------------------------------------------
  // FUNCIÓN: irARegistro
  // Navega a la pantalla de registro
  // ----------------------------------------------------------
  const irARegistro = () => {
    navigation.replace('Register'); // replace evita que puedas volver atrás
  };

  // ----------------------------------------------------------
  // FUNCIÓN: irAReset
  // Navega a la pantalla de recuperar contraseña
  // ----------------------------------------------------------
  const irAReset = () => {
    navigation.navigate('Reset');
  };

  // ----------------------------------------------------------
  // RENDER - Lo que se dibuja en pantalla
  // ----------------------------------------------------------
  
  return (
    // KeyboardAvoidingView: Empuja el contenido hacia arriba cuando aparece el teclado
    <KeyboardAvoidingView 
      style={globalStyles.authContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      
      {/* Surface: Crea una tarjeta con sombra elegante */}
      <Surface style={globalStyles.card} elevation={4}>
        
        {/* ========== LOGO Y TÍTULO ========== */}
        <View style={globalStyles.logoContainer}>
          <Text style={globalStyles.logo}>Focus.Bot</Text>
          <Text style={globalStyles.logoSubtitle}>Deep in your Focus</Text>
        </View>
        
        {/* ========== FORMULARIO ========== */}
        
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
        
        {/* ========== LINK "OLVIDÉ CONTRASEÑA" ========== */}
        <TouchableOpacity onPress={irAReset} style={{ alignSelf: 'flex-end' }}>
          <Text style={[globalStyles.link, { fontSize: 14 }]}>
            ¿Olvidaste tu contraseña?
          </Text>
        </TouchableOpacity>
        
        {/* ========== BOTONES ========== */}
        <View style={globalStyles.botonera}>
          
          {/* Botón principal: INICIAR SESIÓN */}
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
          
          {/* Botón secundario: REGISTRARSE */}
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
        
      </Surface>
      
    </KeyboardAvoidingView>
  );
}