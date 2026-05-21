import React, { createContext, useContext, useEffect } from 'react';
import { useActivities } from '../hooks/useActivities';
import { AuthContext } from './AuthContext';

export const ActivityContext = createContext();

export const ActivityProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const activitiesData = useActivities(false); //NUEVO

    useEffect(() => {
        if (user) {
            activitiesData.refresh();
        }
    }, [user]);

    return (
        <ActivityContext.Provider value={{
            activities: activitiesData.activities,
            loading: activitiesData.loading,
            error: activitiesData.error,
            addFullActivity: activitiesData.addActivity,
            updateActivity: activitiesData.updateActivity,
            deleteActivity: activitiesData.deleteActivity,
            fetchActivities: activitiesData.refresh,
            createType: activitiesData.createType
        }}>
            {children}
        </ActivityContext.Provider>
    );
};