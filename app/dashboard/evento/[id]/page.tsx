"use client"

import Link from "next/link"
import { ArrowLeft, Calendar, MapPin, Video, Users, Edit2, Plus } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import BottomNavigation from "@/components/BottomNavigation"

type TabType = "Participantes" | "Recursos" | "Alimentos"

export default function EventoDetalle({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState<TabType>("Participantes")

  // Datos de ejemplo para el evento
  const eventData = {
    id: params.id,
    title: "International Band Music Conc.",
    category: "Música",
    date: "14 December, 2021",
    time: "Tuesday, 4:00PM - 9:00PM",
    location: "Gala Convention Center",
    address: "36 Guild Street London, UK",
    modality: "Modalidad - Virutal",
    link: "Enlace",
    maxParticipants: "Max. Participantes: 324",
    description:
      "Enjoy your favorite dishe and a lovely your friends and family and have a great time. Food from local food trucks will be available for purchase.",
    image: "/placeholder.svg?height=200&width=400",
    status: "Planificado",
  }

  // Datos de participantes
  const participantesData = {
    confirmados: 230,
    invitados: 300,
    personas: [
      { id: 1, name: "Jhon Pulido", status: "Invitado", avatar: "/placeholder.svg?height=60&width=60" },
      { id: 2, name: "Cristian Alvira", status: "Confirmado", avatar: "/placeholder.svg?height=60&width=60" },
      { id: 3, name: "Cristian Alvira", status: "Invitado", avatar: "/placeholder.svg?height=60&width=60" },
    ],
  }

  // Datos de recursos
  const recursosData = [
    {
      id: 1,
      name: "Videobeam Epson",
      units: 5,
      price: "$ 2.320.000",
      description: "Equipo en alta definicion de la mejor calidad",
    },
    {
      id: 2,
      name: "Videobeam Epson",
      units: 5,
      price: "$ 2.320.000",
      description: "Equipo en alta definicion de la mejor calidad",
    },
  ]

  // Datos de alimentos
  const alimentosData = [
    {
      id: 1,
      name: "Hamburguesas",
      units: 5,
      price: "$ 2.320.000",
      description: "Equipo en alta definicion de la mejor calidad",
    },
    {
      id: 2,
      name: "Cocacola",
      units: 5,
      price: "$ 2.320.000",
      description: "Equipo en alta definicion de la mejor calidad",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div className="relative">
        <div className="h-48 bg-gray-300 relative">
          <Image src={eventData.image || "/placeholder.svg"} alt={eventData.title} fill className="object-cover" />
          <Link href="/dashboard/mis-eventos" className="absolute top-4 left-4 text-white">
            <ArrowLeft className="h-6 w-6" />
          </Link>
        </div>

        <Link
          href={`/dashboard/evento/${params.id}/estado`}
          className="absolute -bottom-5 left-1/2 transform -translate-x-1/2"
        >
          <div className="bg-white px-4 py-2 rounded-full shadow-md">
            <div className="flex items-center text-indigo-500 font-medium">
              <span>{eventData.status}</span>
              <Edit2 className="h-4 w-4 ml-2" />
            </div>
          </div>
        </Link>
      </div>

      <div className="p-4 pt-8">
        <h1 className="text-2xl font-bold">{eventData.title}</h1>
        <p className="text-gray-500">{eventData.category}</p>

        <div className="mt-4 space-y-4">
          <div className="flex items-center bg-blue-50 p-3 rounded-lg">
            <Calendar className="h-5 w-5 text-indigo-500 mr-3" />
            <div>
              <p className="font-medium">{eventData.date}</p>
              <p className="text-sm text-gray-500">{eventData.time}</p>
            </div>
          </div>

          <div className="flex items-center bg-blue-50 p-3 rounded-lg">
            <MapPin className="h-5 w-5 text-indigo-500 mr-3" />
            <div>
              <p className="font-medium">{eventData.location}</p>
              <p className="text-sm text-gray-500">{eventData.address}</p>
            </div>
          </div>

          <div className="flex items-center bg-blue-50 p-3 rounded-lg">
            <Video className="h-5 w-5 text-indigo-500 mr-3" />
            <div>
              <p className="font-medium">{eventData.modality}</p>
              <p className="text-sm text-gray-500">{eventData.link}</p>
            </div>
          </div>

          <div className="flex items-center bg-blue-50 p-3 rounded-lg">
            <Users className="h-5 w-5 text-indigo-500 mr-3" />
            <div>
              <p className="font-medium">{eventData.maxParticipants}</p>
            </div>
          </div>

          <Link href={`/dashboard/evento/${params.id}/editar`} className="block">
            <button className="w-full border border-indigo-500 text-indigo-500 py-2 rounded-lg flex items-center justify-center">
              <Edit2 className="h-5 w-5 mr-2" />
              Editar Ajustes
            </button>
          </Link>
        </div>

        <div className="mt-6">
          <h2 className="font-bold mb-2">Descripción</h2>
          <p className="text-gray-700">{eventData.description}</p>
          <button className="text-indigo-500 mt-1">Read More...</button>
        </div>

        <div className="mt-6">
          <div className="flex border-b">
            <button
              className={`py-2 px-4 ${activeTab === "Participantes" ? "text-indigo-500 border-b-2 border-indigo-500 font-medium" : "text-gray-500"}`}
              onClick={() => setActiveTab("Participantes")}
            >
              Participantes
            </button>
            <button
              className={`py-2 px-4 ${activeTab === "Recursos" ? "text-indigo-500 border-b-2 border-indigo-500 font-medium" : "text-gray-500"}`}
              onClick={() => setActiveTab("Recursos")}
            >
              Recursos
            </button>
            <button
              className={`py-2 px-4 ${activeTab === "Alimentos" ? "text-indigo-500 border-b-2 border-indigo-500 font-medium" : "text-gray-500"}`}
              onClick={() => setActiveTab("Alimentos")}
            >
              Alimentos
            </button>
          </div>

          <div className="mt-4">
            {activeTab === "Participantes" && (
              <div>
                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-6">
                    <div className="w-5 h-5 rounded-full border-2 border-indigo-500 flex items-center justify-center mr-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    </div>
                    <span className="font-medium">Confirmados</span>
                  </div>
                  <span className="text-indigo-500 font-medium">{participantesData.confirmados}</span>
                </div>

                <div className="flex items-center mb-6">
                  <div className="flex items-center mr-6">
                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 mr-2"></div>
                    <span className="font-medium">Invitados</span>
                  </div>
                  <span className="text-indigo-500 font-medium">{participantesData.invitados}</span>
                </div>

                <div className="space-y-4">
                  {participantesData.personas.map((persona) => (
                    <div key={persona.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-lg bg-orange-500 overflow-hidden mr-3">
                          <Image
                            src={persona.avatar || "/placeholder.svg"}
                            alt={persona.name}
                            width={48}
                            height={48}
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium">{persona.name}</span>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-md text-sm ${persona.status === "Confirmado" ? "bg-indigo-500 text-white" : "bg-gray-100 text-indigo-500"}`}
                      >
                        {persona.status}
                      </div>
                    </div>
                  ))}
                </div>

                <Link href={`/dashboard/evento/${params.id}/participantes`} className="block text-right">
                  <button className="text-indigo-500 mt-4">Ver todos</button>
                </Link>
              </div>
            )}

            {activeTab === "Recursos" && (
              <div>
                <Link href={`/dashboard/evento/${params.id}/recursos/agregar`} className="absolute bottom-24 right-6">
                  <button className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg">
                    <Plus className="h-6 w-6" />
                  </button>
                </Link>

                <div className="space-y-6">
                  {recursosData.map((recurso) => (
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
                      <p className="text-sm text-gray-500">{recurso.description}</p>
                    </div>
                  ))}
                </div>

                <Link href={`/dashboard/evento/${params.id}/recursos`} className="block text-right">
                  <button className="text-indigo-500 mt-4">Ver todos</button>
                </Link>
              </div>
            )}

            {activeTab === "Alimentos" && (
              <div>
                <Link href={`/dashboard/evento/${params.id}/alimentos/agregar`} className="absolute bottom-24 right-6">
                  <button className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg">
                    <Plus className="h-6 w-6" />
                  </button>
                </Link>

                <div className="space-y-6">
                  {alimentosData.map((alimento) => (
                    <div key={alimento.id} className="border-b pb-4">
                      <div className="flex justify-between mb-1">
                        <div className="font-medium">{alimento.name}</div>
                        <div className="text-indigo-500 font-medium">{alimento.price}</div>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm mb-1">
                        <span>{alimento.units} unidades</span>
                      </div>
                      <p className="text-sm text-gray-500">{alimento.description}</p>
                    </div>
                  ))}
                </div>

                <Link href={`/dashboard/evento/${params.id}/alimentos`} className="block text-right">
                  <button className="text-indigo-500 mt-4">Ver todos</button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 space-y-2">
        <Link href={`/dashboard/evento/${params.id}/facturacion`} className="block w-full">
          <button className="w-full py-3 bg-indigo-500 text-white rounded-md font-medium">FACTURACIÓN</button>
        </Link>
        <Link href={`/dashboard/evento/${params.id}/eliminar`} className="block w-full">
          <button className="w-full py-3 bg-red-500 text-white rounded-md font-medium">ELIMINAR EVENTO</button>
        </Link>
      </div>

      <BottomNavigation activeItem="home" />
    </div>
  )
}

