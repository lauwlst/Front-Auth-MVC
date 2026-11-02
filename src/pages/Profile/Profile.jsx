import { useEffect, useState } from "react"
import { useAuth } from '../../contexts/AuthContext'

export const Profile = () => {
    const { user, profile } = useAuth()
    const [hasUser, setHasUser] = useState(user)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!hasUser) {
            profile().then(setHasUser).catch(err => setError(err.message))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Datos a mostrar: el usuario del contexto o el que devolvió profile()
    const current = user || hasUser

    return (
        <section className="card">
            <h2>PERFIL DEL USUARIO</h2>

            {error && <div className="error">{error}</div>}

            {!error && !current && <p className="muted">Cargando...</p>}

            {current && (
                <ul>
                    {Object.entries(current)
                        .filter(([k]) => k !== 'password')
                        .map(([k, v]) => <li key={k}><strong>{k}:</strong> {String(v)}</li>)
                    }
                </ul>
            )}
        </section>
    )
}