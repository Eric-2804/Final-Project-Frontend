import { getData } from './httpService';
import { API_ENDPOINTS } from './apiEndpoints';

export const getUserNotifications = async () => {
  try {
    const notifications = await getData(API_ENDPOINTS.NOTIFICATIONS.BASE);
    return notifications;
  } catch (error) {
    console.error('Error al obtener las notificaciones del usuario:', error);
    throw error;
  }
};