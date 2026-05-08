const API_URL = 'http://83.36.5.17:5000/';

import { authStorage } from '../core/authStorage';

async function fetchApi(endpoint, method = 'GET', body = null) {
    const token = await authStorage.getToken();
    const url = API_URL + endpoint;

    const headers = {
        'Content-Type': 'application/json',
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
        const data = await respuesta.json().catch(() => null);

        if (!respuesta.ok) {
            console.error(`Status: ${respuesta.status} en la URL: ${url}`);
            const errorData = await respuesta.json().catch(() => ({ message: "Error no JSON" }));
            throw new Error(errorData.message || `Error ${respuesta.status}`);
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
    verify: (email, code) => fetchApi('auth/verify', 'POST', { email, code }),
    resendCode: (email) => fetchApi('auth/resend-code', 'POST', { email }),
    resetPassword: (data) => fetchApi('auth/reset-password', 'POST', data),

};

export const UserService = {
    getUser: () => fetchApi('users/user', 'GET'),
    updateUser: (userData) => fetchApi('users/user', 'PATCH', userData),
}

export const BotService = {
    getBots: () => fetchApi('bots/', 'GET'),
    linkBot: (mac_address, custom_name) => fetchApi('bots/link', 'POST', { mac_address, custom_name }),
    editBot: (botId, data) => fetchApi(`bots/${botId}`, 'PATCH', data),
    deleteBot: (botId) => fetchApi(`bots/${botId}`, 'DELETE'),
};

export const ActivityService = {
    getActivities: () => fetchApi('activities/', 'GET'),
    createActivity: (activityData) => fetchApi('activities/', 'POST', activityData),
    updateState: (activityId, newState) => fetchApi(`activities/${activityId}/state`, 'PATCH', { state: newState }),
};

export const HistoryService = {
    getRecords: () => fetchApi('history/', 'GET'),
    calculateRecord: (init_date, end_date) => fetchApi('history/', 'POST', { init_date_range: init_date, end_date_range: end_date }),
};