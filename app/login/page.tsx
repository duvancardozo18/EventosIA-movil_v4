import Link from "next/link"
import { Eye } from "lucide-react"

export default function Login() {
  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex items-center text-3xl font-bold text-indigo-600 justify-center mb-12">
        <div className="relative w-10 h-10 mr-2">
          <div className="absolute inset-0 bg-indigo-600 rounded-full"></div>
          <div className="absolute inset-2 bg-white rounded-full"></div>
          <div className="absolute inset-3 bg-indigo-600 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-5 h-2.5 -translate-x-1/2 -translate-y-1/2 bg-cyan-400 rounded-full"></div>
        </div>
        <span>EventosIA</span>
      </div>

      <h1 className="text-2xl font-bold mb-6">Iniciar sesión</h1>

      <form className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <input
              type="email"
              placeholder="Correo electrónico"
              className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="password"
              placeholder="Contraseña"
              className="w-full pl-10 pr-10 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              <Eye className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="text-right">
          <Link href="/recuperar-contrasena" className="text-sm text-gray-600">
            Recuperar contraseña
          </Link>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-indigo-500 text-white rounded-md font-medium flex items-center justify-center"
        >
          INGRESAR
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          No tienes una cuenta?{" "}
          <Link href="/registro" className="text-indigo-600">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}

