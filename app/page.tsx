import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 space-y-8">
      <div className="flex items-center text-4xl font-bold text-indigo-600">
        <div className="relative w-12 h-12 mr-2">
          <div className="absolute inset-0 bg-indigo-600 rounded-full"></div>
          <div className="absolute inset-2 bg-white rounded-full"></div>
          <div className="absolute inset-3 bg-indigo-600 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 w-6 h-3 -translate-x-1/2 -translate-y-1/2 bg-cyan-400 rounded-full"></div>
        </div>
        <span>ventosIA</span>
      </div>

      <div className="text-center text-gray-500 space-y-1">
        <p>Sistema de gestión</p>
        <p>De eventos con</p>
        <p>Planificación automática</p>
      </div>

      <div className="w-full space-y-4 mt-12">
        <Link href="/login" className="block w-full">
          <button className="w-full py-3 bg-indigo-500 text-white rounded-md font-medium">INGRESAR</button>
        </Link>

        <Link href="/registro" className="block w-full">
          <button className="w-full py-3 bg-white text-indigo-500 border border-indigo-500 rounded-md font-medium">
            CREAR CUENTA
          </button>
        </Link>
      </div>
    </div>
  )
}

