import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"

export const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password:''})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [Ok, setOk ] = useState(null)

  // Gestión de los inputs del formulario
    const onChange = (e) => setForm((prev) => ({...prev, [e.target.name]: e.target.value}))
      // función que envía el formulario
    const onSubmit = async (e) => {
        e.preventDefault() 
        setError(null) 
        setOk(null)

        setLoading(true) 

        try {
            // llamamos a la función login del contexto
            await login(form.email.trim().toLowerCase(), form.password)
            navigate('/profile')
        } catch (err) {
            setError(err.message || 'Error al iniciar sesión 💀')
        } finally {
            setLoading(false) 
        }
    }

    
  return (
   <section className="card">
            <h2>INICIAR SESIÓN CON CONTEXTO</h2>
            <form className="space-y" onSubmit={onSubmit}>
                <div className="field">
                    <label>Email</label>
                    <input name="email" value={form.email} onChange={onChange} />
                    </div>
                <div className="field">
                    <label>Contraseña</label>
                    <input type="password" name="password" value={form.password} onChange={onChange} />
                    </div>

                {error && <div className="error">{error}</div>}
                <div className="row" style={{justifyContent:'flex-end'}}>
                    <button className="btn" disabled={loading}>{loading ? 'Iniciando sesón...' : 'Iniciar sesión'}</button>
                    </div>
            </form>
        </section>
  )
}
  

