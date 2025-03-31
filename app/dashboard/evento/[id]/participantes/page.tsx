"use client"

import Link from "next/link"
import { ArrowLeft, Search, Plus, Trash2 } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export default function ListaParticipantes({ params }: { params: { id: string } }) {
  const [searchTerm, setSearchTerm] = useState("")

  // Datos de ejemplo para los participantes
  const participantes = [
    {
      id: 1,
      name: "Alex Lee",
      email: "alexlee@example.com",
      status: "Confirmado",
      avatar: "/placeholder.svg?height=50&width=50",
      followers: null,
    },
    {
      id: 2,
      name: "Micheal Ulasi",
      email: "michael@example.com",
      status: "Invitado",
      avatar: "/placeholder.svg?height=50&width=50",
      followers: null,
    },
    {
      id: 3,
      name: "Cristofer",
      email: "cristofer@example.com",
      status: "Confirmado",
      avatar: "/placeholder.svg?height=50&width=50",
      followers: null,
    },
    {
      id: 4,
      name: "David Silbia",
      email: "5k Followers",
      status: "Confirmado",
      avatar: "/placeholder.svg?height=50&width=50",
      followers: "5k",
    },
    {
      id: 5,
      name: "Ashfak Sayem",
      email: "402 Followers",
      status: "Invitado",
      avatar: "/placeholder.svg?height=50&width=50",
      followers: "402",
    },
    {
      id: 6,
      name: "Rocks Velkeinjen",
      email: "893 Followers",
      status: "Invitado",
      avatar: "/placeholder.svg?height=50&width=50",
      followers: "893",
    },
    {
      id: 7,
      name: "Roman Kutepov",
      email: "225 Followers",
      status: "Invitado",
      avatar: "/placeholder.svg?height=50&width=50",
      followers: "225",
    },
    {
      id: 8,
      name: "Cristofer Nolan",
      email: "322 Followers",
      status: "Invitado",
      avatar: "/placeholder.svg?height=50&width=50",
      followers: "322",
    },
    {
      id: 9,
      name: "Jhon Wick",
      email: "2k Followers",
      status: "Invitado",
      avatar: "/placeholder.svg?height=50&width=50",
      followers: "2k",
    },
  ]

  // Filtrar participantes según el término de búsqueda
  const filteredParticipantes = participantes.filter(
    (participante) =>
      participante.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (participante.email && participante.email.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-4 border-b">
        <div className="flex items-center">
          <Link href={`/dashboard/evento/${params.id}`} className="text-gray-800 mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Participantes</h1>
        </div>
      </header>

      <div className="p-4">
        <div className="flex items-center mb-6">
          <Link href={`/dashboard/evento/${params.id}/invitar`} className="mr-2">
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
              placeholder="Buscar"
              className="w-full pl-4 pr-10 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredParticipantes.map((participante) => (
            <div key={participante.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-3">
                  <Image
                    src={participante.avatar || "/placeholder.svg"}
                    alt={participante.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{participante.name}</p>
                  <p className="text-sm text-gray-500">{participante.email}</p>
                </div>
              </div>

              <div className="flex items-center">
                <div
                  className={`px-3 py-1 rounded-md text-sm mr-2 ${
                    participante.status === "Confirmado" ? "bg-indigo-500 text-white" : "bg-gray-100 text-indigo-500"
                  }`}
                >
                  {participante.status}
                </div>
                <Link href={`/dashboard/evento/${params.id}/participantes/${participante.id}/eliminar`}>
                  <button className="text-gray-400 hover:text-red-500">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

