import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = '@auth_token';
const USER = '@user_data';

export const authStorage = {
    // Almacen del token en memoria
    saveToken: async (token) => {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, token);
        } catch (e) {
            console.error("Error al guardar el token", e);
        }
    },

    saveUer: async (user) => {
        try {
            const jsonValue = JSON.stringify(user);
            await AsyncStorage.setItem(USER, jsonValue);
        } catch (e) {
            console.error("Error al guardar el usuario", e);
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

    getUser: async () => {
        try {
            const jsonValue = await AsyncStorage.getItem(USER_KEY);
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (e) {
            console.error("Error al obtener el usuario", e);
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
    },
    deleteUser: async () => {
        try {
            await AsyncStorage.removeItem(USER);
        } catch (e) {
            console.error("Error al borrar el USER", e);
        }
    }
};