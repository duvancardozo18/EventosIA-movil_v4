import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function EditarAlimento({ params }: { params: { id: string; alimentoId: string } }) {
  // Datos de ejemplo para el alimento
  const alimento = {
    id: params.alimentoId,
    name: "Hamburguesas",
    units: 100,
    price: 1500000,
    description: "Hamburguesas gourmet con papas",
  }

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex items-center mb-6">
        <Link href={`/dashboard/evento/${params.id}/alimentos`} className="text-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Editar Alimento</h1>

      <form className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Nombre del alimento</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            defaultValue={alimento.name}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Cantidad</label>
          <input
            type="number"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            defaultValue={alimento.units}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Precio total</label>
          <input
            type="number"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            defaultValue={alimento.price}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
            defaultValue={alimento.description}
          ></textarea>
        </div>

        <Link href={`/dashboard/evento/${params.id}/alimentos`} className="block w-full">
          <button type="button" className="w-full py-3 bg-indigo-500 text-white rounded-md font-medium">
            GUARDAR CAMBIOS
          </button>
        </Link>
      </form>
    </div>
  )
}

