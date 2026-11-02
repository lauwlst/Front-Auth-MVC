import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { storage } from '../utils/storage'
import { AuthService } from '../services/auth.service'

// Crear el contexto
const AuthContext = createContext(null)

// Crear la función que va a proveer ese contexto
export const AuthProvider = ({ children }) => {
    // Coge token y user de lo que haya guardado en el localStorage
    const [token, setToken] = useState(() => storage.get('token'))
    const [user, setUser] = useState(() => storage.get('user'))

    // Si token o user cambian, se guardan (o se borran) en el localStorage
    useEffect(() => {
        if (token) storage.set('token', token)
        else storage.remove('token')
    }, [token])

    useEffect(() => {
        if (user) storage.set('user', user)
        else storage.remove('user')
    }, [user])

    // Función login
    const login = useCallback(async (email, password) => {
        const data = await AuthService.login({ email, password })
        const tokenLogin = data.token ?? data?.data?.token
        const userLogin = data.user ?? data?.data?.user ?? data?.data

        if (!tokenLogin) throw new Error("El servidor de backend no ha devuelto el token")

        setToken(tokenLogin)
        setUser(userLogin ?? null)

        return { token: tokenLogin, user: userLogin }
    }, [])

    // Función logout
    const logout = useCallback(() => {
        setToken(null)
        setUser(null)
        storage.remove('token')
        storage.remove('user')
    }, [])

    // Función de llamar al profile
    const profile = useCallback(async () => {
        if (!token) return null
        const profileData = await AuthService.profile(token)
        setUser(profileData)
        return profileData
    }, [token])

    return (
        <AuthContext.Provider value={{ token, user, login, logout, profile }}>
            {children}
        </AuthContext.Provider>
    )
}

// Función para usar el contexto
export const useAuth = () => {
    const ctx = useContext(AuthContext)
    return ctx
}