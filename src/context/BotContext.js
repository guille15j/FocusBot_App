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
            // Forzamos que si la API devuelve algo extraño, se guarde un array vacío
            setBots(Array.isArray(data) ? data : []);
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
        setLoading(true);
        try {
            const newBot = await BotService.linkBot(macAddress, name);
            setBots(prev => [...prev, newBot]);
            return newBot;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
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