import React, { createContext, useState, useEffect } from 'react';
import { authStorage } from '../core/authStorage';

export const AuthContext = createContext({});

// Es una "nube de datos" que flota sobre toda tu aplicación. Sin el contexto, si quieres 
// saber quién es el usuario en la pantalla de "Ajustes", tendrías que pasar la información 
// del usuario de padre a hijo (prop drilling) por cada pantalla, lo cual es un caos.

// Propósito: Permite que cualquier componente, sin importar qué tan profundo esté en el 
// árbol, acceda a los datos del usuario (user), al estado de carga (isLoading) y a las 
// funciones de sesión (signIn, signOut) de forma directa.

// Sincronización: Cuando llamas a signIn, el contexto actualiza el estado global y, 
// automáticamente, todos los componentes que escuchan ese contexto (como tu UserHeader en 
// HomeScreen.js) se repintan con los nuevos datos.

// Persistencia: En el useEffect de tu archivo, el contexto se encarga de preguntar a 
// authStorage si hay un usuario guardado en el teléfono al abrir la app, para que no 
// tenga que loguearse cada vez.

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Cargar usuario al iniciar la App
    useEffect(() => {
        const loadStorageData = async () => {
            try {
                const savedUser = await authStorage.getUser();
                if (savedUser) {
                    setUser(savedUser);
                }
            } catch (e) {
                console.error("Error cargando datos del storage", e);
            } finally {
                setIsLoading(false);
            }
        };
        loadStorageData();
    }, []);

    const signIn = async (token, userData) => {
        try {
            await authStorage.saveToken(token);
            await authStorage.saveUser(userData);
            console.log("DENTRO DEL SIGNIN - ...USERDATA",...userData);
            setUser({ ...userData }); 
        } catch (e) {
            console.error("Error al iniciar sesión:", e);
        }
    };

    const signOut = async () => {
        await authStorage.removeToken();
        await authStorage.removeUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};