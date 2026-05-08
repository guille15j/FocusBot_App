import { useState, useCallback, useEffect, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { BotService } from '../api/apiService';

export const useBots = (autoRefresh = false, intervalMs = 45000) => {
    const [bots, setBots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isFocused = useIsFocused();
    const isFirstLoad = useRef(true);

    // Obtener bots vinculados
    const fetchBots = useCallback(async (showLoading = false) => {
        if (showLoading) setLoading(true);
        setError(null);
        try {
            const data = await BotService.getBots();
            setBots(data);
        } catch (err) {
            setError(err.message);
        } finally {
            if (showLoading) setLoading(false);
            isFirstLoad.current = false;
        }
    }, []);

    // Lógica de Polling para el estado de los bots
    // Nota: He puesto 45s por defecto ya que el estado del bot suele ser menos crítico que el de la actividad
    useEffect(() => {
        let interval;
        if (autoRefresh && isFocused) {
            interval = setInterval(() => {
                fetchBots(false); 
            }, intervalMs);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoRefresh, isFocused, fetchBots, intervalMs]);

    // Carga inicial
    useEffect(() => {
        fetchBots(true);
    }, [fetchBots]);

    // Vincular nuevo bot
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

    // Actualizar configuración del bot
    const updateBot = async (botId, updateData) => {
        try {
            const updated = await BotService.editBot(botId, updateData);
            setBots(prev => prev.map(b => b.bot_id === botId ? { ...b, ...updated } : b));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return {
        bots,
        loading,
        error,
        refresh: () => fetchBots(true),
        linkNewBot,
        updateBot
    };
};