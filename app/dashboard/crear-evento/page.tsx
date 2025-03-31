import Link from "next/link"
import { ArrowLeft, Upload, ChevronDown } from "lucide-react"

export default function CrearEvento() {
  return (
    <div className="flex flex-col min-h-screen pb-6">
      <div className="flex items-center p-4 border-b">
        <Link href="/dashboard" className="text-gray-800 mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-bold">Crear evento</h1>
      </div>

      <div className="flex-1 p-4">
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Nombre del evento</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"></textarea>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Imagen</label>
            <div className="border rounded-md p-2 flex items-center justify-between">
              <span className="text-gray-500">Seleccionar imagen</span>
              <Upload className="h-5 w-5 text-gray-500" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Modalidad del evento</label>
            <div className="relative">
              <select className="w-full p-2 border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-8">
                <option>Seleccionar modalidad</option>
                <option>Presencial</option>
                <option>Virtual</option>
                <option>Híbrido</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Categoría del evento</label>
            <div className="relative">
              <select className="w-full p-2 border rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-8">
                <option>Seleccionar categoría</option>
                <option>Conferencia</option>
                <option>Taller</option>
                <option>Seminario</option>
                <option>Networking</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Enlace del meet</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-center font-medium text-gray-700">Fecha y hora</h3>

            <div className="grid grid-cols-4 gap-2 items-center">
              <label className="text-sm font-medium text-gray-700">Inicio</label>
              <div className="col-span-2">
                <input
                  type="date"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  defaultValue="2024-06-10"
                />
              </div>
              <div>
                <input
                  type="time"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  defaultValue="09:41"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 items-center">
              <label className="text-sm font-medium text-gray-700">Fin</label>
              <div className="col-span-2">
                <input
                  type="date"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  defaultValue="2024-06-10"
                />
              </div>
              <div>
                <input
                  type="time"
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  defaultValue="09:41"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-center font-medium text-gray-700">Lugar</h3>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Nombre del lugar</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Dirección</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <textarea className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[60px]"></textarea>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Precio - Alquiler del sitio</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-center font-medium text-gray-700">Costos / Participantes</h3>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Precio del evento - logística (sin recursos)
              </label>
              <input
                type="number"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Número máximo de participantes</label>
              <input
                type="number"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-indigo-500 text-white rounded-md font-medium">
            CREAR EVENTO
          </button>
        </form>
      </div>
    </div>
  )
}

