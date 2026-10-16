import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMensaje('Iniciando sesión...')
    try {
      const respuesta = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const datos = await respuesta.json()
      if (respuesta.ok) {
        setMensaje('¡Login exitoso! Entrando al panel...')
        localStorage.setItem('token', datos.token)
        setTimeout(() => navigate('/dashboard'), 1000)
      } else {
        setMensaje(`Error: ${datos.message || 'Credenciales incorrectas'}`)
      }
    } catch (error) {
      console.error(error)
      setMensaje('Error de conexión con el servidor')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Bienvenido de nuevo</h2>
          <p className="text-slate-500 mt-2">Accede a tu panel de vocabulario</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Correo electrónico</label>
            <input 
              type="email" 
              placeholder="tu@correo.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Contraseña</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-95"
          >
            Entrar al Dashboard
          </button>
        </form>

        {mensaje && (
          <div className={`mt-4 p-3 rounded-lg text-sm text-center font-medium ${mensaje.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {mensaje}
          </div>
        )}
        
        <p className="mt-6 text-center text-slate-600 text-sm">
          ¿No tienes cuenta? <Link to="/register" className="text-blue-600 font-semibold hover:underline">Regístrate aquí</Link>
        </p>
      </div>
    </div>
  )
}

export default Login