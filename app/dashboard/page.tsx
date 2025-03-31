"use client"

import Link from "next/link"
import BottomNavigation from "@/components/BottomNavigation"
import { useRef } from "react"

export default function Dashboard() {
  // Verificar si hay eventos para mostrar
  const hasEvents = true
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const events = [
    {
      id: 1,
      title: "International Band Mu...",
      date: "5 JUNE",
      location: "36 Guild Street London, UK",
      attendees: 20,
      image: "/placeholder.svg?height=120&width=120",
      color: "bg-pink-200",
    },
    {
      id: 2,
      title: "Jo Malone L...",
      date: "6 JUNE",
      location: "Radius Gallery",
      attendees: 20,
      image: "/placeholder.svg?height=120&width=120",
      color: "bg-blue-200",
    },
    {
      id: 3,
      title: "Women's Leadership...",
      date: "7 JUNE",
      location: "Conference Center",
      attendees: 15,
      image: "/placeholder.svg?height=120&width=120",
      color: "bg-purple-200",
    },
    {
      id: 4,
      title: "International Kids...",
      date: "8 JUNE",
      location: "Community Center",
      attendees: 30,
      image: "/placeholder.svg?height=120&width=120",
      color: "bg-green-200",
    },
  ]

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef
      const scrollAmount = 200
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" })
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen pb-16">
      <header className="bg-indigo-600 text-white py-4 px-6 flex justify-center items-center">
        <h1 className="text-xl font-bold">EventosIA</h1>
      </header>

      <main className="flex-1 p-6">
        <div className="flex justify-end mb-8">
          <Link href="/dashboard/crear-evento">
            <button className="bg-indigo-500 text-white px-4 py-2 rounded-md font-medium">CREAR EVENTO</button>
          </Link>
        </div>

        {!hasEvents ? (
          <div className="flex flex-col items-center justify-center flex-1 text-center mt-12">
            <div className="bg-gray-100 rounded-full p-12 mb-6">
              <div className="relative w-24 h-24">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-full h-full">
                  <rect x="2" y="4" width="20" height="18" rx="2" fill="#FF4D6D" />
                  <rect x="4" y="2" width="2" height="4" rx="1" fill="#9CA3AF" />
                  <rect x="18" y="2" width="2" height="4" rx="1" fill="#9CA3AF" />
                  <rect x="4" y="8" width="16" height="1" fill="#9CA3AF" />
                  <rect x="4" y="11" width="3" height="3" rx="0.5" fill="#1E40AF" />
                  <rect x="8" y="11" width="3" height="3" rx="0.5" fill="#1E40AF" />
                  <rect x="12" y="11" width="3" height="3" rx="0.5" fill="#1E40AF" />
                  <rect x="16" y="11" width="3" height="3" rx="0.5" fill="#1E40AF" />
                  <rect x="4" y="15" width="3" height="3" rx="0.5" fill="#1E40AF" />
                </svg>
              </div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-4 border-indigo-500 rounded-full flex items-center justify-center bg-white">
                <div className="w-8 h-1 bg-indigo-500 rounded-full"></div>
                <div className="absolute w-1 h-4 bg-indigo-500 rounded-full transform rotate-90 translate-x-2"></div>
              </div>
            </div>

            <h2 className="text-xl font-bold mb-2">No hay eventos</h2>
            <p className="text-gray-600 mb-8">Comunícate con un gestor de eventos</p>
          </div>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Mis eventos</h2>
              <Link href="/dashboard/mis-eventos" className="text-sm text-gray-500">
                Ver todos &gt;
              </Link>
            </div>

            <div className="relative">
              <button
                onClick={() => scroll("left")}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto pb-4 scrollbar-hide gap-4 px-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {events.map((event) => (
                  <Link href={`/dashboard/evento/${event.id}`} key={event.id} className="flex-shrink-0 w-[160px]">
                    <div className="border rounded-lg overflow-hidden shadow-sm h-full">
                      <div className={`h-32 relative ${event.color}`}>
                        <div className="absolute top-2 left-2 bg-white rounded-md px-2 py-1 text-xs font-bold text-red-500">
                          {event.date}
                        </div>
                      </div>
                      <div className="p-3">
                        <h3 className="font-bold text-sm">{event.title}</h3>
                        <div className="flex items-center mt-2">
                          <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white"></div>
                            <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white"></div>
                          </div>
                          <span className="text-xs text-indigo-500 ml-1">+{event.attendees} Going</span>
                        </div>
                        <div className="flex items-center mt-2">
                          <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center mr-1">
                            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                          </div>
                          <p className="text-xs text-gray-500 truncate">{event.location}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <button
                onClick={() => scroll("right")}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>

      <BottomNavigation activeItem="home" />
    </div>
  )
}

