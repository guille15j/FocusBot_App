// AsyncStorage es como el localStorage del navegador pero para apps móviles
// Permite guardar datos en el teléfono que persisten aunque cierres la app
import AsyncStorage from '@react-native-async-storage/async-storage';

// El @ es una convención para indicar que es una clave de nuestra app
const TOKEN_KEY = '@focusbot_token';   // Clave para guardar el token JWT
const USER_KEY = '@focusbot_user';     // Clave para guardar los datos del usuario

export const authStorage = {
  
  // Guardar token
  saveToken: async (token) => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, token);
      console.log('Token guardado');
    } catch (error) {
      console.error('Error guardando token:', error);
    }
  },

  // Guardar usuario
  saveUser: async (user) => {
    try {
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
      console.log('Usuario guardado', user);

    } catch (error) {
      console.error('Error guardando usuario:', error);
    }
  },

  // Obtener token
  getToken: async () => {
    try {
      return await AsyncStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Error obteniendo token:', error);
      return null;
    }
  },

  // Obtener usuario
  getUser: async () => {
    try {
      const data = await AsyncStorage.getItem(USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      return null;
    }
  },

  // Eliminar token
  deleteToken: async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      console.log('Token eliminado');
    } catch (error) {
      console.error('Error eliminando token:', error);
    }
  },

  // Función para verificar si un token JWT está caducado
  isTokenExpired : (token) => {
    if (!token) return true;
    try {
      // Los JWT tienen 3 partes separadas por puntos. La segunda parte (index 1) contiene los datos (payload)
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      
      // Decodificamos el texto Base64 a un JSON plano
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );

      const { exp } = JSON.parse(jsonPayload);
      
      // El campo 'exp' viene en segundos. Lo comparamos con la hora actual en segundos.
      const currentTime = Math.floor(Date.now() / 1000);
      return exp < currentTime; // Devuelve true si la hora de expiración ya pasó
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return true; // Si el token está corrupto o mal formado, lo tratamos como caducado
    }
  },

  // Eliminar usuario
  deleteUser: async () => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
      console.log('Usuario eliminado');
    } catch (error) {
      console.error('Error eliminando usuario:', error);
    }
  }
};