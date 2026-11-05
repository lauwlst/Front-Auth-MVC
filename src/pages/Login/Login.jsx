import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

export const Login = () => {

    const navigate = useNavigate()
    const { login } = useAuth()

    // Estados del formulario
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [ok, setOk] = useState(null)

    // Gestionar cambios en los inputs
    const onChange = (e) => {
        const { name, value } = e.target

        setForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    // Enviar formulario
    const onSubmit = async (e) => {
        e.preventDefault()

        setError(null)
        setOk(null)

        // Validaciones
        if (!form.email.trim()) {
            setError('El email es obligatorio')
            return
        }

        if (!form.email.includes('@')) {
            setError('Introduce un email válido')
            return
        }

        if (!form.password) {
            setError('La contraseña es obligatoria')
            return
        }

        setLoading(true)

        try {

            // Llamar al login del AuthContext
            const result = await login(
                form.email.trim().toLowerCase(),
                form.password
            )

            console.log('Login correcto:', result)

            setOk('¡Inicio de sesión correcto!')

            // Redirigir al perfil
            navigate('/profile')

        } catch (err) {

            console.error('Error en Login:', err)

            setError(
                err.message || 'Error al iniciar sesión'
            )

        } finally {

            setLoading(false)

        }
    }

    return (
        <section className="card">

            <h2>INICIAR SESIÓN CON CONTEXTO</h2>

            <form
                className="space-y"
                onSubmit={onSubmit}
            >

                <div className="field">

                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        autoComplete="email"
                        placeholder="Introduce tu email"
                        required
                    />

                </div>

                <div className="field">

                    <label htmlFor="password">
                        Contraseña
                    </label>

                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={onChange}
                        autoComplete="current-password"
                        placeholder="Introduce tu contraseña"
                        required
                    />

                </div>

                {error && (
                    <div
                        className="error"
                        role="alert"
                        style={{ color: 'red' }}
                    >
                        {error}
                    </div>
                )}

                {ok && (
                    <div
                        role="status"
                        style={{ color: 'green' }}
                    >
                        {ok}
                    </div>
                )}

                <div
                    className="row"
                    style={{ justifyContent: 'flex-end' }}
                >

                    <button
                        type="submit"
                        className="btn"
                        disabled={loading}
                    >
                        {loading
                            ? 'Iniciando sesión...'
                            : 'Iniciar sesión'
                        }
                    </button>

                </div>

            </form>

        </section>
    )
}
