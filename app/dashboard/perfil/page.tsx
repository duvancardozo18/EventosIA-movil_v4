import Link from "next/link"
import { ArrowLeft, LogOut } from "lucide-react"
import Image from "next/image"
import BottomNavigation from "@/components/BottomNavigation"

export default function Perfil() {
  // Datos de ejemplo para el perfil
  const perfilData = {
    nombre: "Felipe Diaz",
    correo: "juan.perez@example.com",
    celular: "123 456 7890",
    rol: "Gestor de eventos",
    avatar: "/placeholder.svg?height=120&width=120",
  }

  return (
    <div className="flex flex-col min-h-screen pb-16">
      <header className="p-4 border-b">
        <div className="flex items-center">
          <Link href="/dashboard" className="text-gray-800 mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </div>
      </header>

      <div className="flex-1 p-4">
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 rounded-full overflow-hidden mb-4">
            <Image
              src={perfilData.avatar || "/placeholder.svg"}
              alt={perfilData.nombre}
              width={128}
              height={128}
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold">{perfilData.nombre}</h1>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold text-indigo-500 mb-4 uppercase">Información Personal</h2>

          <div className="space-y-6">
            <div>
              <p className="text-gray-500">Correo electrónico</p>
              <p className="font-medium">{perfilData.correo}</p>
            </div>

            <div>
              <p className="text-gray-500">Celular:</p>
              <p className="font-medium">{perfilData.celular}</p>
            </div>

            <div>
              <p className="text-gray-500">Rol</p>
              <p className="font-medium">{perfilData.rol}</p>
            </div>
          </div>
        </div>

        <Link href="/login" className="block w-full">
          <button className="w-full py-3 border border-indigo-500 text-indigo-500 rounded-md font-medium flex items-center justify-center">
            <LogOut className="h-5 w-5 mr-2" />
            Cerrar sesión
          </button>
        </Link>
      </div>

      <BottomNavigation activeItem="profile" />
    </div>
  )
}

