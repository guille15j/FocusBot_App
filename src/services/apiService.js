const API_URL = 'http://192.168.1.38:5000/';

import aut_storage from './auth_storage'

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
        const data = await respuesta.json();

        if (!respuesta.ok) {
            const errorText = await respuesta.text();
            throw new Error(`Error ${respuesta.status} en la petición: ${respuesta.statusText} - ${errorText}`);
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

export const BotService = {
    getBots: () => fetchApi('bot/bots','GET',null),
    linkBot: (mac, name) => fetchApi('bot/pair', 'POST', {mac_address: mac, custom_name: name}),
};