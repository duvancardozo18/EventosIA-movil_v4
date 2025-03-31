import Link from "next/link"
import { ArrowLeft, Check } from "lucide-react"

export default function RecursoEliminado({ params }: { params: { id: string; recursoId: string } }) {
  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex items-center mb-6">
        <Link href={`/dashboard/evento/${params.id}/recursos`} className="text-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 text-center">
        <h1 className="text-2xl font-bold mb-2">Recurso Eliminado</h1>
        <h2 className="text-2xl font-bold mb-8">Correctamente</h2>

        <div className="bg-indigo-500 rounded-full p-8 mb-12">
          <Check className="h-12 w-12 text-white" />
        </div>

        <Link href={`/dashboard/evento/${params.id}/recursos`} className="w-full">
          <button className="w-full py-3 bg-indigo-500 text-white rounded-md font-medium">ACEPTAR</button>
        </Link>
      </div>
    </div>
  )
}

