import React, { createContext, useState, useEffect } from 'react';
import { authStorage } from '../core/authStorage';

export const AuthContext = createContext({});

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
            // IMPORTANTE: Esto actualiza el Header y todas las pantallas al instante
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