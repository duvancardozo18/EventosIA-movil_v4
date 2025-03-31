"use client"

import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import BottomNavigation from "@/components/BottomNavigation"

type FilterType = "Gestor" | "Participante" | "Cliente"

const eventData = [
  {
    id: 1,
    title: "A virtual evening of smooth jazz",
    date: "1ST MAY- SAT -2:00 PM",
    image: "/placeholder.svg?height=80&width=80",
    color: "bg-indigo-900",
  },
  {
    id: 2,
    title: "Jo malone london's mother's day",
    date: "1ST MAY- SAT -2:00 PM",
    image: "/placeholder.svg?height=80&width=80",
    color: "bg-pink-200",
  },
  {
    id: 3,
    title: "Women's leadership conference",
    date: "1ST MAY- SAT -2:00 PM",
    image: "/placeholder.svg?height=80&width=80",
    color: "bg-purple-900",
  },
  {
    id: 4,
    title: "International kids safe",
    date: "1ST MAY- SAT -2:00 PM",
    image: "/placeholder.svg?height=80&width=80",
    color: "bg-blue-400",
  },
]

export default function MisEventos() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("Gestor")

  // Filtrar eventos según el tipo seleccionado
  const filteredEvents = () => {
    switch (activeFilter) {
      case "Gestor":
        return eventData
      case "Participante":
        return eventData.slice(0, 2)
      case "Cliente":
        return eventData.slice(0, 1)
      default:
        return eventData
    }
  }

  return (
    <div className="flex flex-col min-h-screen pb-16">
      <header className="p-4 border-b">
        <div className="flex items-center">
          <Link href="/dashboard" className="text-gray-800 mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Mis eventos</h1>
        </div>
      </header>

      <div className="p-4">
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-indigo-500" />
          </div>
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          <button
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeFilter === "Gestor" ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveFilter("Gestor")}
          >
            Gestor
          </button>
          <button
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeFilter === "Participante" ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveFilter("Participante")}
          >
            Participante
          </button>
          <button
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              activeFilter === "Cliente" ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveFilter("Cliente")}
          >
            Cliente
          </button>
        </div>

        <h2 className="text-lg font-medium mb-4">Mas recientes</h2>

        <div className="space-y-4">
          {filteredEvents().map((event) => (
            <Link href={`/dashboard/evento/${event.id}`} key={event.id}>
              <div className="flex items-center p-2 border rounded-lg shadow-sm">
                <div className={`w-20 h-20 rounded-lg mr-4 overflow-hidden ${event.color}`}>
                  <Image
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs text-indigo-500 font-medium">{event.date}</p>
                  <h3 className="font-bold">{event.title}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <BottomNavigation activeItem="calendar" />
    </div>
  )
}

