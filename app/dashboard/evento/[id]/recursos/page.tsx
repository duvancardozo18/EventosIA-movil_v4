import Link from "next/link"
import { ArrowLeft, Search, Plus, Edit2, Trash2 } from "lucide-react"
import BottomNavigation from "@/components/BottomNavigation"

export default function ListaRecursos({ params }: { params: { id: string } }) {
  // Datos de ejemplo para los recursos
  const recursos = [
    {
      id: 1,
      name: "Videobeam Epson",
      units: 5,
      price: "$ 2.320.000",
      description: "Equipo en alta definicion de la mejor calidad",
    },
    {
      id: 2,
      name: "Micrófonos inalámbricos",
      units: 10,
      price: "$ 1.500.000",
      description: "Micrófonos de alta calidad para eventos",
    },
    {
      id: 3,
      name: "Pantallas LED",
      units: 2,
      price: "$ 3.800.000",
      description: "Pantallas de 100 pulgadas para presentaciones",
    },
    {
      id: 4,
      name: "Sistema de sonido",
      units: 1,
      price: "$ 4.200.000",
      description: "Sistema completo con altavoces y mezcladora",
    },
    { id: 5, name: "Luces LED", units: 20, price: "$ 1.800.000", description: "Iluminación para escenario y ambiente" },
  ]

  return (
    <div className="flex flex-col min-h-screen pb-16">
      <header className="p-4 border-b">
        <div className="flex items-center">
          <Link href={`/dashboard/evento/${params.id}`} className="text-gray-800 mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Recursos</h1>
        </div>
      </header>

      <div className="p-4">
        <div className="flex items-center mb-6">
          <Link href={`/dashboard/evento/${params.id}/recursos/agregar`} className="mr-2">
            <button className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center text-white">
              <Plus className="h-5 w-5" />
            </button>
          </Link>

          <div className="relative flex-1">
            <div className="absolute inset-y-0 right-3 flex items-center">
              <Search className="h-5 w-5 text-indigo-500" />
            </div>
            <input
              type="text"
              placeholder="Buscar recursos..."
              className="w-full pl-4 pr-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-6">
          {recursos.map((recurso) => (
            <div key={recurso.id} className="border-b pb-4">
              <div className="flex justify-between mb-1">
                <div className="font-medium">{recurso.name}</div>
                <div className="text-indigo-500 font-medium">{recurso.price}</div>
              </div>
              <div className="flex items-center text-gray-500 text-sm mb-1">
                <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center mr-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                </div>
                <span>{recurso.units} unidades</span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{recurso.description}</p>

              <div className="flex space-x-2">
                <Link href={`/dashboard/evento/${params.id}/recursos/${recurso.id}/editar`}>
                  <button className="text-indigo-500 flex items-center text-sm">
                    <Edit2 className="h-4 w-4 mr-1" />
                    Editar
                  </button>
                </Link>
                <Link href={`/dashboard/evento/${params.id}/recursos/${recurso.id}/eliminar`}>
                  <button className="text-red-500 flex items-center text-sm">
                    <Trash2 className="h-4 w-4 mr-1" />
                    Eliminar
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNavigation activeItem="home" />
    </div>
  )
}

