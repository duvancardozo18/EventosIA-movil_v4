import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function EditarRecurso({ params }: { params: { id: string; recursoId: string } }) {
  // Datos de ejemplo para el recurso
  const recurso = {
    id: params.recursoId,
    name: "Videobeam Epson",
    units: 5,
    price: 2320000,
    description: "Equipo en alta definicion de la mejor calidad",
  }

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex items-center mb-6">
        <Link href={`/dashboard/evento/${params.id}/recursos`} className="text-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Editar Recurso</h1>

      <form className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Nombre del recurso</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            defaultValue={recurso.name}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Cantidad</label>
          <input
            type="number"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            defaultValue={recurso.units}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Precio total</label>
          <input
            type="number"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            defaultValue={recurso.price}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
            defaultValue={recurso.description}
          ></textarea>
        </div>

        <Link href={`/dashboard/evento/${params.id}/recursos`} className="block w-full">
          <button type="button" className="w-full py-3 bg-indigo-500 text-white rounded-md font-medium">
            GUARDAR CAMBIOS
          </button>
        </Link>
      </form>
    </div>
  )
}

