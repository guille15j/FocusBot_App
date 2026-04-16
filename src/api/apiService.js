const API_URL = 'http://88.0.69.82:5000/';

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
    login : (identifier, password) => fetchApi('auth/login', 'POST', { identifier, password }),
    register: (userData) => fetchApi('auth/register', 'POST', userData),
};

export const UserService = {
    getUSer: () => fetchApi('users/user', 'GET')
}

export const BotService = {
    getBots: () => fetchApi('bot/getByUser','GET',null),
    linkBot: (mac, name) => fetchApi('bot/pair', 'POST', {mac_address: mac, custom_name: name}),
};

export const ActivityService = {

};