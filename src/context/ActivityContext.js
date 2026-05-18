import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { ActivityService } from '../api/apiService';
import { AuthContext } from './AuthContext';

export const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchActivities = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const data = await ActivityService.getActivities();
            setActivities(Array.isArray(data) ? data : (data.activities || []));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // 1. CREAR: Al recibir el 200, insertamos el objeto construido en el array
    const addFullActivity = async (payload, selectedBot) => {
        setLoading(true);
        try {
            // Crear el Tipo
            const typeData = {
                name_type: payload.config.name_type,
                work_duration: parseInt(payload.config.work_duration, 10) || 0,
                short_break: parseInt(payload.config.short_break, 10) || 0,
                long_break: parseInt(payload.config.long_break, 10) || 0,
                cycles_before_long: parseInt(payload.config.cycles_before_long, 10) || 0
            };
            //esperamos respuesta
            const typeResponse = await ActivityService.createType(typeData);

            //Crear la Actividad
            const activityPayload = {
                type_id: typeResponse.id,
                bot_id: payload.bot_id,
                title: payload.title,
                category: payload.category,
                init_date: payload.init_date,
                end_date: payload.end_date,
                extra_data: payload.extra_data || {}
            };
            const response = await ActivityService.createActivity(activityPayload);

            if (response) {
                //si la respuesta existe es porque es correcta porque sino el fucnion fetch APi lanza error
                //Actuializamos antres de que tengamos que esperar a que se recarge la app por si sola para merjorar el feedback a los usuarios
            }

            // Sincronizamos el estado de React sin llamar a la API
            // setActivities(prev => [newActivity, ...prev]);
            
            return response;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // 2. EDITAR: Buscamos en el array local y cambiamos los campos al recibir 200
    const updateActivity = async (id, updatedData) => {
        try {
            await ActivityService.updateActivity(id, updatedData);
            
            // Editamos el contexto localmente de forma inmediata
            setActivities(prev => prev.map(act => 
                act.activity_id === id 
                    ? { ...act, ...updatedData } 
                    : act
            ));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // 3. ELIMINAR: Filtramos el array local al recibir 200
    const deleteActivity = async (id) => {
        try {
            await ActivityService.deleteActivity(id);
            
            // Borramos del contexto localmente de forma inmediata
            setActivities(prev => prev.filter(act => act.activity_id !== id));
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    useEffect(() => {
        fetchActivities();
    }, [fetchActivities]);

    return (
        <ActivityContext.Provider value={{ 
            activities, 
            loading, 
            error, 
            addFullActivity, 
            updateActivity, 
            deleteActivity, 
            fetchActivities 
        }}>
            {children}
        </ActivityContext.Provider>
    );
};