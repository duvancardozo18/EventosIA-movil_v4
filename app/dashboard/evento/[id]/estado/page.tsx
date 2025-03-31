"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useState } from "react"

type EventState = "Planificado" | "En curso" | "Completado" | "Cancelado"

export default function EstadoEvento({ params }: { params: { id: string } }) {
  const [selectedState, setSelectedState] = useState<EventState>("Planificado")

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex items-center mb-6">
        <Link href={`/dashboard/evento/${params.id}`} className="text-gray-800">
          <ArrowLeft className="h-6 w-6" />
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-12 text-center">Estado del Evento</h1>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-lg">Planificado</span>
          <div
            className={`w-6 h-6 rounded-md ${
              selectedState === "Planificado"
                ? "bg-indigo-500 flex items-center justify-center"
                : "border border-gray-300"
            }`}
            onClick={() => setSelectedState("Planificado")}
          >
            {selectedState === "Planificado" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg">En curso</span>
          <div
            className={`w-6 h-6 rounded-md ${
              selectedState === "En curso" ? "bg-indigo-500 flex items-center justify-center" : "border border-gray-300"
            }`}
            onClick={() => setSelectedState("En curso")}
          >
            {selectedState === "En curso" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg">Completado</span>
          <div
            className={`w-6 h-6 rounded-md ${
              selectedState === "Completado"
                ? "bg-indigo-500 flex items-center justify-center"
                : "border border-gray-300"
            }`}
            onClick={() => setSelectedState("Completado")}
          >
            {selectedState === "Completado" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-lg">Cancelado</span>
          <div
            className={`w-6 h-6 rounded-md ${
              selectedState === "Cancelado"
                ? "bg-indigo-500 flex items-center justify-center"
                : "border border-gray-300"
            }`}
            onClick={() => setSelectedState("Cancelado")}
          >
            {selectedState === "Cancelado" && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <Link href={`/dashboard/evento/${params.id}`} className="block w-full">
          <button className="w-full py-3 bg-indigo-500 text-white rounded-md font-medium">ACTUALIZAR</button>
        </Link>
      </div>
    </div>
  )
}

