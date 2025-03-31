import Link from "next/link"
import { Home, Calendar, Bell, User } from "lucide-react"

interface BottomNavigationProps {
  activeItem: "home" | "calendar" | "notifications" | "profile"
}

export default function BottomNavigation({ activeItem }: BottomNavigationProps) {
  return (
    <footer className="bg-white border-t py-3 fixed bottom-0 left-0 right-0">
      <div className="flex justify-around items-center">
        <Link
          href="/dashboard"
          className={`flex flex-col items-center ${activeItem === "home" ? "text-indigo-600" : "text-gray-500"}`}
        >
          <Home className="h-6 w-6" />
        </Link>
        <Link
          href="/dashboard/calendario"
          className={`flex flex-col items-center ${activeItem === "calendar" ? "text-indigo-600" : "text-gray-500"}`}
        >
          <Calendar className="h-6 w-6" />
        </Link>
        <Link
          href="/dashboard/notificaciones"
          className={`flex flex-col items-center ${activeItem === "notifications" ? "text-indigo-600" : "text-gray-500"}`}
        >
          <Bell className="h-6 w-6" />
        </Link>
        <Link
          href="/dashboard/perfil"
          className={`flex flex-col items-center ${activeItem === "profile" ? "text-indigo-600" : "text-gray-500"}`}
        >
          <User className="h-6 w-6" />
        </Link>
      </div>
    </footer>
  )
}

