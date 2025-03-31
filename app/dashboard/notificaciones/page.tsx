import Link from "next/link"
import { ArrowLeft, Trash2, MapPin } from "lucide-react"
import Image from "next/image"
import BottomNavigation from "@/components/BottomNavigation"

export default function Notificaciones() {
  // Datos de ejemplo para las notificaciones
  const notificaciones = [
    {
      id: 1,
      fecha: "Wed, Apr 28",
      hora: "5:30 PM",
      titulo: "Jo Malone London's Mother's Day Presents",
      lugar: "Radius Gallery",
      ubicacion: "Santa Cruz, CA",
      imagen: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 2,
      fecha: "Wed, Apr 28",
      hora: "5:30 PM",
      titulo: "Jo Malone London's Mother's Day Presents",
      lugar: "Radius Gallery",
      ubicacion: "Santa Cruz, CA",
      imagen: "/placeholder.svg?height=80&width=80",
    },
    {
      id: 3,
      fecha: "Wed, Apr 28",
      hora: "5:30 PM",
      titulo: "Jo Malone London's Mother's Day Presents",
      lugar: "Radius Gallery",
      ubicacion: "Santa Cruz, CA",
      imagen: "/placeholder.svg?height=80&width=80",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen pb-16">
      <header className="p-4 border-b flex items-center">
        <Link href="/dashboard" className="text-gray-800 mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-bold">Notificaciones</h1>
      </header>

      <div className="flex-1 p-4">
        <div className="space-y-4">
          {notificaciones.map((notificacion) => (
            <div key={notificacion.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex">
                <div className="w-20 h-20 bg-pink-100 rounded-lg overflow-hidden mr-3">
                  <Image
                    src={notificacion.imagen || "/placeholder.svg"}
                    alt={notificacion.titulo}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-indigo-500 text-sm">
                      {notificacion.fecha} • {notificacion.hora}
                    </p>
                    <button className="text-indigo-500">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <h3 className="font-bold text-lg">{notificacion.titulo}</h3>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>
                      {notificacion.lugar} • {notificacion.ubicacion}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNavigation activeItem="notifications" />
    </div>
  )
}

