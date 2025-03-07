import { fetchWrapper, userReservationsUrl } from "./fetch";
import { baseUrl } from "./fetch";

export const getReservations = async (userId) => {
  const url = userReservationsUrl(userId); 
  try {
    const response = await fetch(url, {
      headers: { "Accept": "application/json" },
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return await response.json()
  } catch (error) {
    throw error;
  }
};
  
  // Agregar una nueva reserva
  export const addReservation = async (userId, reservationData) => {
    try {
      const response = await fetchWrapper(`${baseUrl}users/${userId}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });
      if (response.error) {
        // Maneja el error sin lanzar una excepción
        console.error("Error al agregar reserva:", response.error);
        return { error: response.error };
      }
      return response; // Devuelve la reserva creada
    } catch (error) {
      console.error("Error en addReservation:", error);
      return { error: error.message };
    }
  };
    
  // Eliminar una reserva
  export const deleteReservation = async (userId, reservationId) => {
    try {
      const response = await fetchWrapper(`${baseUrl}users/${userId}/reservations/${reservationId}`, {
        method: "DELETE",
      });
      return response;  
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  