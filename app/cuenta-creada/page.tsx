import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"

export default function CuentaCreada() {
  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex items-center mb-6">
        <Link href="/" className="text-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 text-center">
        <h1 className="text-2xl font-bold mb-2">Cuenta creada con éxito</h1>
        <p className="text-gray-600 mb-8">Te enviamos un enlace de VERIFICACIÓN al correo electrónico.</p>

        <div className="bg-indigo-500 rounded-full p-8 mb-12">
          <Check className="h-12 w-12 text-white" />
        </div>

        <Link href="/login" className="w-full">
          <button className="w-full py-3 bg-indigo-500 text-white rounded-md font-medium">ACEPTAR</button>
        </Link>
      </div>
    </div>
  )
}

