import { useState, useCallback, useEffect, useRef } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { ActivityService } from '../api/apiService';

export const useActivities = (autoRefresh = false, intervalMs = 15 * 60 * 1000) => {
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
            await ActivityService.updateActivity(activityId, { state: newState });
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
            throw err; // lanzamos apra que la pagina renderizce el toast
        }
    };

    const addActivity = async (activityData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await ActivityService.createActivity(activityData);
            // Refrescamos la lista completa para tener todos los campos
            await fetchActivities(true);
            return response;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Error al crear';
            setError(errorMessage);
            throw errorMessage; 
        } finally {
            setLoading(false);
        }
    };

    const updateActivity = async (activityId, data) => {
        try {
           const response = await ActivityService.updateActivity(activityId, data);
            await fetchActivities(true);
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const createType = async (typeData) => {
        try {
            const response = await ActivityService.createType(typeData);
            return response; 
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    return {
        activities,
        loading,
        error,
        refresh: () => fetchActivities(true),
        updateActivityState,
        deleteActivity,
        updateActivity,
        addActivity,
        createType,     

    };
};