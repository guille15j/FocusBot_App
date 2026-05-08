import { useState, useCallback, useEffect } from 'react';
import { HistoryService } from '../api/apiService';

export const useHistory = () => {
    const [history, setHistory] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchHistory = useCallback(async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            // data suele estructurarse como { logs: [...], summary: {...} }
            const data = await HistoryService.getHistory(filters);
            setHistory(data.logs || []);
            setStats(data.summary || null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    // Solo cargamos al montar el componente, sin intervalos automáticos
    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    // Selector para transformar datos para gráficas (ej: VictoryChart o similares)
    const getChartData = useCallback(() => {
        return history.map(item => ({
            date: new Date(item.end_time).toLocaleDateString(),
            duration: item.duration_minutes,
            activity: item.activity_name
        }));
    }, [history]);

    return {
        history,
        stats,
        loading,
        error,
        refresh: fetchHistory, // Permite al usuario hacer "Pull to refresh"
        getChartData
    };
};