// llamar a la api y me devuelve la data

// traer la url de la api del .env
const API_URL = import.meta.env.VITE_API_URL;

//asegurarnos de que la respesta nos devuelve un formato texto
const parse = async (res) => {
    // si no hay contenido en la res -->204 - Not Content
    if(res.status === 204) return null;
    const text = await res.text()
    // si el body viene vacío
    if(!text) return null;
    try {
        return JSON.parse(text)
    } catch (err) {
        return text
    }
}
//  un servicio de peticiones a la api reutilizable
export const http = async (path, {method='GET', body, token, headers}) => {
    // configuro la respuesta de mi petición
    const res = await fetch(`${API_URL}${path}`,{
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}`} : {}),
            ...API_URL(headers || {})
        },
        body: body ? JSON.stringify(body) : undefined
    })

    // gestiono la respuesta
    const data = await parse(res)
    if(!res.ok) {
        const message = (data && (data.err || data.message) || `Error ${res.status}`)
        throw new Error(message);
    }

    //devolver la respuesta
    return data
}