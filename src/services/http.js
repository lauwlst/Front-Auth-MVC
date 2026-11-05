
// ==========================================
// HTTP SERVICE
// Servicio reutilizable para conectar con la API
// ==========================================

const API_URL = import.meta.env.VITE_API_URL;

// Comprobar configuración
if (!API_URL) {
    console.error(
        'ERROR: No se ha encontrado VITE_API_URL en el archivo .env'
    );
}

// ==========================================
// PROCESAR RESPUESTAS
// ==========================================

const parse = async (res) => {
    if (res.status === 204) return null;

    const text = await res.text();

    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
};

// ==========================================
// PETICIONES HTTP
// ==========================================

export const http = async (
    path,
    {
        method = 'GET',
        body,
        token,
        headers = {}
    } = {}
) => {

    if (!API_URL) {
        throw new Error('La URL de la API no está configurada');
    }

    const url = `${API_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;

    const options = {
        method,
        headers: {
            ...(body !== undefined
                ? { 'Content-Type': 'application/json' }
                : {}),
            ...(token
                ? { Authorization: `Bearer ${token}` }
                : {}),
            ...headers
        },
        body: body !== undefined
            ? JSON.stringify(body)
            : undefined
    };

    // ==========================================
    // MOSTRAR PETICIÓN
    // ==========================================

    console.group('PETICIÓN API');

    console.log('URL:', url);
    console.log('Método:', method);

    console.log(
        'Datos enviados:',
        JSON.stringify(body, null, 2)
    );

    console.groupEnd();

    let res;

    try {
        res = await fetch(url, options);
    } catch (err) {
        console.error('ERROR DE CONEXIÓN:', err);

        throw new Error(
            'No se pudo conectar con el servidor. Comprueba tu conexión.'
        );
    }

    // ==========================================
    // LEER RESPUESTA
    // ==========================================

    const data = await parse(res);

    // ==========================================
    // GESTIONAR ERRORES
    // ==========================================

    if (!res.ok) {

        console.group('ERROR BACKEND');

        console.log('Estado HTTP:', res.status);
        console.log('Estado:', res.statusText);
        console.log('URL:', url);

        console.log(
            'RESPUESTA COMPLETA:',
            JSON.stringify(data, null, 2)
        );

        console.log('Objeto recibido:', data);

        console.groupEnd();

        const message =
            typeof data === 'string'
                ? data
                : data?.message ||
                  data?.err ||
                  data?.error ||
                  `Error ${res.status}`;

        throw new Error(message);
    }

    // ==========================================
    // RESPUESTA CORRECTA
    // ==========================================

    console.group('RESPUESTA API');

    console.log('Estado HTTP:', res.status);

    console.log(
        'Datos recibidos:',
        JSON.stringify(data, null, 2)
    );

    console.groupEnd();

    return data;
};