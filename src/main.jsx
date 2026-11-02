import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, NavLink, Outlet, redirect } from 'react-router-dom'
import './index.css'
import { Home } from './components'
import { Register, Login, Profile } from './pages'
import { storage } from './utils/storage'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// layout general
const Layout = () => {
   const { token, logout } = useAuth()
    
    return (
        <div>
            <nav style={{backgroundColor:'beige', padding: '20px'}}>
                <strong>API Auth Demo</strong>
                <div>
                    <NavLink to='/'>Inicio</NavLink>
                    <NavLink to='/register'>Registro</NavLink>
                    { !token ?
                    <NavLink to='/login'>Login</NavLink>
                    :<>
                    <NavLink to='/profile'>Profile</NavLink>
                    <button onClick={logout}>Logout</button>
                    </>
                    }
                </div>
            </nav>
            <main>
                <Outlet/>
            </main>
        </div>
    )
}
// autenticacion con redirect -- si no está autenticado, redirige al login
const requireAuth = () => {
    const tokenAuth = storage.get('token');
    if(!tokenAuth) throw redirect('/login');
    return null;

}
//rutas
const routes = [
    {
        path:'/',
        element: <Layout/>, 
        children: [
            { index: true, element: <Home/> },
            { path: '/register', element: <Register /> },
            { path: '/login', element: <Login/> },
            { path: '/profile', element: <Profile />, loader: requireAuth } // ruta protegida!!!
        ]
    }
]

//enrutado o router
const router = createBrowserRouter(routes)

//inicio de renderizado de la aplicación --- AQUÍ USAMOS EL CONTEXTO CON LOS ESTADOS GLOBALES !!!!!
createRoot(document.getElementById('root')).render(
    <StrictMode>
       <AuthProvider>
        <RouterProvider router={router} />
       </AuthProvider>
    </StrictMode>,
)

 
