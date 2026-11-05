import { useState } from "react"
import { AuthService } from "../../services/auth.service"

export const Register = () => {

    // Estados del formulario
    const [form, setForm] = useState({
        nombre: '',
        email: '',
        edad: '',
        password: ''
    })

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [ok, setOk] = useState(null)

    // Gestión de los inputs
    const onChange = (e) => {
        const { name, value } = e.target

        setForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    // Validación del formulario
    const validate = () => {
        if (!form.nombre.trim()) {
            return 'El nombre es obligatorio'
        }

        if (!form.email.includes('@')) {
            return 'Introduce un email válido'
        }

        if (!form.password || form.password.length < 6) {
            return 'La contraseña debe tener al menos 6 caracteres'
        }

        if (form.edad && Number.isNaN(Number(form.edad))) {
            return 'La edad debe ser numérica'
        }

        if (form.edad && Number(form.edad) <= 0) {
            return 'La edad debe ser mayor que cero'
        }

        return null
    }

    // Envío del formulario
    const onSubmit = async (e) => {
        e.preventDefault()

        setError(null)
        setOk(null)

        // Validamos los datos
        const validateForm = validate()

        if (validateForm) {
            setError(validateForm)
            return
        }

        setLoading(true)

        try {
            // Construimos el payload
            const payload = {
                nombre: form.nombre.trim(),
                email: form.email.trim().toLowerCase(),
                password: form.password,
                ...(form.edad
                    ? { edad: Number(form.edad) }
                    : {})
            }

            // Llamamos al servicio de registro
            const data = await AuthService.register(payload)

            console.log('Respuesta Register 😀', data)

            setOk('¡Registro completado! Ya puedes iniciar sesión.')

            // Limpiamos el formulario
            setForm({
                nombre: '',
                email: '',
                edad: '',
                password: ''
            })

        } catch (err) {
            console.error('Error en el registro:', err)

            setError(err.message || 'Error en el registro 💀')

        } finally {
            setLoading(false)
        }
    }

    // Limpiar formulario
    const onClear = () => {
        setForm({
            nombre: '',
            email: '',
            edad: '',
            password: ''
        })

        setError(null)
        setOk(null)
    }

    // Renderizado
    return (
        <section className="card">

            <h2>REGISTRO</h2>

            <form onSubmit={onSubmit} className="space-y">

                <div className="field">
                    <label htmlFor="nombre">Nombre</label>

                    <input
                        id="nombre"
                        name="nombre"
                        value={form.nombre}
                        onChange={onChange}
                        autoComplete="name"
                        required
                    />
                </div>

                <div className="field">
                    <label htmlFor="email">Email</label>

                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={onChange}
                        autoComplete="email"
                        required
                    />
                </div>

                <div className="field">
                    <label htmlFor="edad">Edad (opcional)</label>

                    <input
                        id="edad"
                        type="number"
                        name="edad"
                        value={form.edad}
                        onChange={onChange}
                        inputMode="numeric"
                        min="1"
                    />
                </div>

                <div className="field">
                    <label htmlFor="password">Contraseña</label>

                    <input
                        id="password"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={onChange}
                        autoComplete="new-password"
                        minLength={6}
                        required
                    />
                </div>

                {error && (
                    <div
                        role="alert"
                        className="error"
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
                        type="button"
                        className="btn outline"
                        onClick={onClear}
                        disabled={loading}
                    >
                        Limpiar
                    </button>

                    <button
                        type="submit"
                        className="btn"
                        disabled={loading}
                    >
                        {loading ? 'Creando...' : 'Registrarme'}
                    </button>

                </div>

            </form>

        </section>
    )
}