import { useEffect, useState } from "react";
import { notificationService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

export const useUnreadNotifications = () => {
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      if (!user?.id_user) return;
      try {
        const res = await notificationService.getNotifications(user.id_user);
        const unread = res.data.filter(n => !n.read_status).length;
        setUnreadCount(unread);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          // No hay notificaciones, así que no se hace nada
          setUnreadCount(0);
        } else {
          console.error("Error al obtener notificaciones no leídas", err);
        }
      }
    };

    fetch();
  }, [user?.id_user]);

  return unreadCount;
};
