import Link from "next/link"
import { ArrowLeft, User, Mail, ArrowRight } from "lucide-react"

export default function EnlazarCliente({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex items-center mb-6">
        <Link href={`/dashboard/evento/${params.id}/facturacion`} className="text-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-2 text-center">Enlazar Cliente</h1>
      <p className="text-gray-500 text-center mb-8">(envío de cotización)</p>

      <form className="space-y-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Nombre"
            className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Apellido"
            className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="email"
            placeholder="Correo electrónico"
            className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <Link href={`/dashboard/evento/${params.id}/cotizacion-enviada`} className="block w-full">
          <button
            type="button"
            className="w-full py-3 bg-indigo-500 text-white rounded-md font-medium flex items-center justify-center"
          >
            ENVIAR
            <ArrowRight className="h-5 w-5 ml-2" />
          </button>
        </Link>
      </form>
    </div>
  )
}

