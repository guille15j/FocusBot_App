import React, { createContext, useState, useCallback, useEffect, useContext } from 'react';
import { BotService } from '../api/apiService';
import { AuthContext } from './AuthContext';

export const BotContext = createContext({});

export const BotProvider = ({ children }) => {
    const { user } = useContext(AuthContext); // Solo cargamos bots si hay usuario
    const [bots, setBots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Función para obtener los bots de la API
    const fetchBots = useCallback(async (showLoading = false) => {
        if (!user) return;
        if (showLoading) setLoading(true);
        try {
            const data = await BotService.getBots();
            console.log("Datos recibidos del servidor:", data);
            // Forzamos que si la API devuelve algo extraño, se guarde un array vacío
            
            const botsArray = data && Array.isArray(data.bots) 
            ? data.bots 
            : (Array.isArray(data) ? data : []);

            setBots(botsArray);
            
            console.log("Datos guardados del servidor en la aplicacion:", bots);
        } catch (err) {
            setError(err.message);
            setBots([]); // En caso de error, mantenemos el array vacío para no romper la UI
        } finally {
            if (showLoading) setLoading(false);
        }
    }, [user]);

    // Carga inicial cuando el usuario se loguea
    useEffect(() => {
        if (user) {
            fetchBots(true);
        } else {
            setBots([]); // Limpiar bots al cerrar sesión
        }
    }, [user, fetchBots]);

    // Función para vincular un nuevo bot (Global)
    const linkNewBot = async (macAddress, name) => {
        try {
            const response = await BotService.linkBot(macAddress, name);
        
            // Si el servidor responde correctamente (ej. 200 o 201)
            if (response) {
                // RECARGAMOS LA LISTA COMPLETA
                // Esto hará que el estado 'bots' se actualice y todos los componentes
                // (Carrusel, Grid, etc.) se rendericen con el nuevo bot automáticamente.
                await fetchBots(); 
                return response;
            }
        } catch (err) {
            console.error("Error vinculando el bot:", err);
            throw err;
        }
    };

    // Función para actualizar un bot (Global)
    const updateBot = async (botId, updateData) => {
        try {
            const updated = await BotService.editBot(botId, updateData);
            setBots(prev => prev.map(b => b.bot_id === botId ? { ...b, ...updated } : b));
            return updated;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // Función para eliminar un bot (Global)
    const deleteBot = async (botId) => {
        try {
            await BotService.deleteBot(botId);
            setBots(prev => prev.filter(b => b.bot_id !== botId));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return (
        <BotContext.Provider value={{ 
            bots, 
            loading, 
            error, 
            refreshBots: () => fetchBots(true),
            linkNewBot,
            updateBot,
            deleteBot
        }}>
            {children}
        </BotContext.Provider>
    );
};