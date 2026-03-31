import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';

export const authStorage = {
    // Almacen del token en memoria
    saveToken: async (token) => {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, token);
        } catch (e) {
            console.error("Error al guardar el token", e);
        }
    },

    // Obtener el token
    getToken: async () => {
        try {
            return await AsyncStorage.getItem(TOKEN_KEY);
        } catch (e) {
            return null;
        }
    },

    // Borrar el token - Para cuando cerremeos sesión
    deleteToken: async () => {
        try {
            await AsyncStorage.removeItem(TOKEN_KEY);
        } catch (e) {
            console.error("Error al borrar el token", e);
        }
    }
};