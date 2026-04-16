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
      console.log('Usuario guardado');
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