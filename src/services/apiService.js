const API_URL = 'http://192.168.1.38:5000/';

async function fetchApi(endpoint, method = 'GET', body = null, token = null) {
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