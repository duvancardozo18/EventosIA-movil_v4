import Link from "next/link"
import { ArrowLeft, Search, Plus, Edit2, Trash2 } from "lucide-react"
import BottomNavigation from "@/components/BottomNavigation"

export default function ListaAlimentos({ params }: { params: { id: string } }) {
  // Datos de ejemplo para los alimentos
  const alimentos = [
    { id: 1, name: "Hamburguesas", units: 100, price: "$ 1.500.000", description: "Hamburguesas gourmet con papas" },
    { id: 2, name: "Cocacola", units: 200, price: "$ 800.000", description: "Bebidas gaseosas en lata" },
    { id: 3, name: "Sándwiches", units: 150, price: "$ 1.200.000", description: "Variedad de sándwiches gourmet" },
    { id: 4, name: "Café", units: 80, price: "$ 500.000", description: "Café premium con opciones de leche" },
    { id: 5, name: "Pastelería", units: 120, price: "$ 900.000", description: "Selección de pasteles y postres" },
  ]

  return (
    <div className="flex flex-col min-h-screen pb-16">
      <header className="p-4 border-b">
        <div className="flex items-center">
          <Link href={`/dashboard/evento/${params.id}`} className="text-gray-800 mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Alimentos</h1>
        </div>
      </header>

      <div className="p-4">
        <div className="flex items-center mb-6">
          <Link href={`/dashboard/evento/${params.id}/alimentos/agregar`} className="mr-2">
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
              placeholder="Buscar alimentos..."
              className="w-full pl-4 pr-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-6">
          {alimentos.map((alimento) => (
            <div key={alimento.id} className="border-b pb-4">
              <div className="flex justify-between mb-1">
                <div className="font-medium">{alimento.name}</div>
                <div className="text-indigo-500 font-medium">{alimento.price}</div>
              </div>
              <div className="flex items-center text-gray-500 text-sm mb-1">
                <span>{alimento.units} unidades</span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{alimento.description}</p>

              <div className="flex space-x-2">
                <Link href={`/dashboard/evento/${params.id}/alimentos/${alimento.id}/editar`}>
                  <button className="text-indigo-500 flex items-center text-sm">
                    <Edit2 className="h-4 w-4 mr-1" />
                    Editar
                  </button>
                </Link>
                <Link href={`/dashboard/evento/${params.id}/alimentos/${alimento.id}/eliminar`}>
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

