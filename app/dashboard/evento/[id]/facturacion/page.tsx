"use client"

import Link from "next/link"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { useState } from "react"
import BottomNavigation from "@/components/BottomNavigation"

export default function Facturacion({ params }: { params: { id: string } }) {
  const [clienteEnlazado, setClienteEnlazado] = useState(true)

  // Datos de ejemplo para la facturación
  const facturacionData = {
    evento: "International Band Music",
    direccion: "Gala Convention Center, 36 Guild Street",
    modalidad: "Virtual",
    maxParticipantes: 324,
    fechaInicio: "14/12/2021 - 4 pm",
    fechaFinalizacion: "14/12/2021 - 9 pm",
    costos: {
      logistica: "$1.500.000",
      alquilerSitio: "$2.000.000",
      alimentacion: "$2.500.000",
      recursos: "$5.000.000",
      total: "$11.000.000",
    },
    cliente: {
      nombre: "Juan Perez",
      correo: "juanperez@example.com",
      estado: "Cotización Enviada",
    },
  }

  return (
    <div className="flex flex-col min-h-screen p-4 pb-16">
      <div className="flex items-center mb-6">
        <Link href={`/dashboard/evento/${params.id}`} className="text-gray-800 mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-bold">Facturación</h1>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h2 className="font-bold mb-4">Facturación</h2>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500">Evento</span>
            <span className="font-medium">{facturacionData.evento}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Dirección</span>
            <span className="font-medium text-right">{facturacionData.direccion}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Modalidad</span>
            <span className="font-medium">{facturacionData.modalidad}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Max. Participantes</span>
            <span className="font-medium">{facturacionData.maxParticipantes}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Fecha de Inicio</span>
            <span className="font-medium">{facturacionData.fechaInicio}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Fecha de Finalización</span>
            <span className="font-medium">{facturacionData.fechaFinalizacion}</span>
          </div>
        </div>

        <h3 className="font-medium text-center my-4">Costos</h3>

        <div className="space-y-3">
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-500">Logística</span>
            <span className="font-medium">{facturacionData.costos.logistica}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Alquiler del Sitio</span>
            <span className="font-medium">{facturacionData.costos.alquilerSitio}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Alimentación</span>
            <span className="font-medium">{facturacionData.costos.alimentacion}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Recursos</span>
            <span className="font-medium">{facturacionData.costos.recursos}</span>
          </div>

          <div className="flex justify-between border-t pt-3 font-bold">
            <span>TOTAL</span>
            <span className="text-indigo-500">{facturacionData.costos.total}</span>
          </div>
        </div>
      </div>

      {clienteEnlazado ? (
        <div className="space-y-4 mb-6">
          <div className="flex items-center">
            <div className="w-6 h-6 rounded-full border border-gray-300 mr-2"></div>
            <span className="font-medium">Cliente</span>
            <span className="text-indigo-500 font-medium ml-auto">{facturacionData.cliente.nombre}</span>
          </div>

          <div className="flex items-center">
            <div className="w-6 h-6 rounded-md border border-gray-300 mr-2"></div>
            <span className="font-medium">Correo electrónico</span>
            <span className="text-indigo-500 font-medium ml-auto">{facturacionData.cliente.correo}</span>
          </div>

          <div className="flex items-center">
            <div className="w-6 h-6 rounded-md border border-gray-300 mr-2 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-gray-500" />
            </div>
            <span className="font-medium">Estado</span>
            <span className="text-indigo-500 font-medium ml-auto">{facturacionData.cliente.estado}</span>
          </div>

          <Link href={`/dashboard/evento/${params.id}/cliente-eliminado`} className="block w-full">
            <button className="w-full py-3 bg-red-500 text-white rounded-md font-medium mt-4">ELIMINAR CLIENTE</button>
          </Link>
        </div>
      ) : (
        <Link href={`/dashboard/evento/${params.id}/enlazar-cliente`} className="block w-full">
          <button className="w-full py-3 bg-indigo-500 text-white rounded-md font-medium">ENLAZAR CLIENTE</button>
        </Link>
      )}

      <BottomNavigation activeItem="home" />
    </div>
  )
}

