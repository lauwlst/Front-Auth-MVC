import { useState } from "react"
import { AuthService } from "../../services/auth.service"

export const Register = () => {
    // Estados del formulario y estados de carga y error (UI)
    const [form, setForm] = useState ({ nombre:'', email:'', edad:'', password:''})
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [ok, setOk] = useState(null)

    // Gestión de los inputs del formulario
    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({...prev, [name]: value}))
    }

    //Validación de los campos del formulario antes de llamar a la API
    const validate = () => {
        if(!form.nombre.trim()) return 'El nombre es obligatorio'
        if(!form.email.includes('@')) return 'Introduce un email válido'
        if(!form.password || form.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres'
        if(form.edad && Number.isNaN(Number(form.edad))) return 'La edad debe ser numérica'
        return null
    }

    // Envío del formulario - coger los datos y llamar a la API
    const onSubmit = async (e) => {
        e.preventDefault() // evita la recarga después del submit
        setError(null) // limpiamos los mensajes de error y de ok
        setOk(null)

        const validateForm = validate() // comprueba errores del formulario con la validación
        if(validateForm) {setError(validateForm); return} // si hay error lo setea, si no no hace nada

        setLoading(true) // empieza la llamada a la API
        try {
            // cogemos el payload, lo que nos da el usuario
            const payload = {
                nombre: form.nombre.trim(),
                email: form.email.trim().toLowerCase(),
                password: form.password,
                ...AuthService(form.edad ? {edad: Number(form.edad)} : {})
            }

            // llamo a la API
            const data = await AuthService.register(payload);
            console.log('Respuesta Register 😀', data);
            setOk('Registro completado 👌¡Ya puedes hacer logion!')
        } catch (err) {
            setError(err.message || 'Error en el registro 💀')
        } finally {
            setLoading(false) // termina el proceso de llamada a la API
        }
        }
    

    // Template de la página Register
  return (
       <section className="card">
            <h2>REGISTRO</h2>
            <form onSubmit={onSubmit}>
                <div className="field">
                    <label htmlFor="nombre">Nombre</label>
                    <input id="nombre" name="nombre" value={form.nombre} onChange={onChange} autoComplete="name" />
                </div>
                <div className="field">
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" value={form.email} onChange={onChange} autoComplete="email" />
                </div>
                <div className="field">
                    <label htmlFor="edad">Edad (opcional)</label>
                    <input id="edad" name="edad" value={form.edad} onChange={onChange} inputMode="numeric" />
                </div>
                <div className="field">
                    <label htmlFor="password">Contraseña</label>
                    <input id="password" type="password" name="password" value={form.password} onChange={onChange} autoComplete="new-password" />
                </div>

                {error && <div role="alert" style={{color: 'red'}} className="error">{error}</div>}
                {ok && <div role="status" style={{color: 'green'}}>{ok}</div>}

                <div className="row" style={{justifyContent:'flex-end'}}>
                    <button type="button" className="btn outline" onClick={()=>setForm({nombre:'',email:'',edad:'',password:''})}>Limpiar</button>
                    <button className="btn" disabled={loading}>{loading ? 'Creando...' : 'Registrarme'}</button>
                </div>
            </form>
        </section>
  )
}


