const API_URL = process.env.EXPO_PUBLIC_API_URL;
const X_API_KEY = process.env.EXPO_PUBLIC_X_API_KEY;
const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

import { authStorage } from '../core/authStorage';

async function fetchApi(endpoint, method = 'GET', body = null) {
    const token = await authStorage.getToken();
    const url = API_URL + endpoint;

    const headers = {
        'Content-Type': 'application/json',
        'X-API-Key': X_API_KEY
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    const options = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const respuesta = await fetch(url, options);
        
        // Leemos el cuerpo UNA SOLA VEZ
        const data = await respuesta.json().catch(() => null);

        if (!respuesta.ok) {
            // El servidor devolvió un error (400, 422, 500, etc.)
            // Mostramos el mensaje que viene del backend o el status si no hay mensaje
            const mensajeError =  data?.error  || data?.message ||`Error ${respuesta.status}`;
            console.error(`Error en ${url}:`, mensajeError);
            throw new Error(mensajeError);
        }

        return data;

    } catch (error) {
        throw error;
    }
}

// Agrupaciones de endpoints por "objetos" para mayor control y legibilidad
export const AuthService = {
    // Nombre_Func : (parametros) => fetchApi(Configuracion),
    login: (identifier, password) => fetchApi('auth/login', 'POST', { identifier, password }),
    register: (userData) => fetchApi('auth/register', 'POST', userData),
    verify: (email, codigo) => fetchApi('auth/verify', 'POST', { email, codigo }),
    resendCode: (email) => fetchApi('auth/resend-code', 'POST', { email }),
    resetPassword: (data) => fetchApi('auth/change/password', 'POST', data),
    googleLoggin: (googleToken) => fetchApi('auth/google', 'POST',googleToken),

};

export const UserService = {
    getUser: () => fetchApi('users/user', 'GET'),
    updateUser: (userData) => fetchApi('users/update', 'PATCH', userData),
}

export const BotService = {
    getBots: () => fetchApi('bot/getByUser', 'GET'),
    linkBot: (mac_address, custom_name) => fetchApi('bot/pair', 'POST', { mac_address, custom_name }),
    editBot: (botId, data) => fetchApi(`bot/${botId}`, 'PATCH', data),
    deleteBot: (botId) => fetchApi(`bot/${botId}`, 'DELETE'),
};

export const ActivityService = {
    // Actividades
    getActivities: () => fetchApi('activities/', 'GET'),    
    getActivity: (activityId) => fetchApi(`activities/${activityId}`, 'GET'),    
    createActivity: (activityData) => fetchApi('activities/activity', 'POST', activityData),    
    updateActivity: (activityId, data) => fetchApi(`activities/${activityId}`, 'PATCH', data),    
    deleteActivity: (activityId) => fetchApi(`activities/${activityId}`, 'DELETE'),

    // Tipos de Actividad
    getTypes: () => fetchApi('activities/type', 'GET'),    
    createType: (typeData) => fetchApi('activities/type', 'POST', typeData),    
    updateType: (typeId, data) => fetchApi(`activities/type/${typeId}`, 'PATCH', data),    
    deleteType: (typeId) => fetchApi(`activities/type/${typeId}`, 'DELETE'),
};

export const HistoryService = {
    getRecords: () => fetchApi('history/', 'GET'),
    getRecordById: (recordId) => fetchApi(`history/${recordId}`, 'GET'),
    calculateRecord: (init_date, end_date) => 
        fetchApi('history/calculate', 'POST', { 
            init_date_range: init_date, 
            end_date_range: end_date 
        }),
    getWeeklyDashboard: () => fetchApi('history/weekly-dashboard', 'GET'),
};