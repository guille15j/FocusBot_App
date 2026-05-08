import { useState, useCallback, useEffect, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { ActivityService } from '../api/apiService';

export const useActivities = (autoRefresh = false, intervalMs = 30000) => {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const isFocused = useIsFocused();
    const isFirstLoad = useRef(true);

    const fetchActivities = useCallback(async (showLoading = false) => {
        if (showLoading) setLoading(true);
        setError(null);
        try {
            const data = await ActivityService.getActivities();
            setActivities(data);
        } catch (err) {
            setError(err.message);
        } finally {
            if (showLoading) setLoading(false);
            isFirstLoad.current = false;
        }
    }, []);

    useEffect(() => {
        let interval;
        if (autoRefresh && isFocused) {
            interval = setInterval(() => {
                fetchActivities(false); 
            }, intervalMs);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoRefresh, isFocused, fetchActivities, intervalMs]);

    useEffect(() => {
        fetchActivities(true);
    }, [fetchActivities]);

    const updateActivityState = async (activityId, newState) => {
        try {
            await ActivityService.updateState(activityId, newState);
            setActivities((prev) =>
                prev.map((act) =>
                    act.activity_id === activityId ? { ...act, state: newState } : act
                )
            );
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const deleteActivity = async (activityId) => {
        try {
            // Llamamos al servicio API que ya tienes definido en apiService.js
            await ActivityService.deleteActivity(activityId);
            
            // Actualizamos el estado local de forma reactiva
            // Filtramos el array para quitar la actividad borrada sin recargar de la DB
            setActivities((prev) => prev.filter((act) => act.activity_id !== activityId));
            
        } catch (err) {
            setError(err.message);
            throw err; // Re-lanzamos para que la UI pueda mostrar un Alert si falla
        }
    };

    return {
        activities,
        loading,
        error,
        refresh: () => fetchActivities(true),
        updateActivityState,
        deleteActivity,
    };
};