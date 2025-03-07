import { fetchWrapper, userReservationsUrl } from "./fetch";
export const getReservations = async (userId) => {
  const url = userReservationsUrl(userId); // Asegúrate de usar userReservationsUrl y no userReviewsUrl
  try {
    const response = await fetch(url, {
      headers: { "Accept": "application/json" },
    });
    const text = await response.text();
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    return JSON.parse(text);
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
      if (!response.ok) {
        throw new Error("No se pudo agregar la reserva.");
      }
      return response;  // Devuelve la nueva reserva añadida
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  // Eliminar una reserva
  export const deleteReservation = async (userId, reservationId) => {
    try {
      const response = await fetchWrapper(`${baseUrl}users/${userId}/reservations/${reservationId}`, {
        method: "DELETE",
      });
      return response;  // Confirma que la eliminación fue exitosa
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  // Editar (actualizar) una reserva
  export const updateReservation = async (userId, reservationId, updatedData) => {
    try {
      const response = await fetchWrapper(`${baseUrl}users/${userId}/reservations/${reservationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error("No se pudo actualizar la reserva.");
      }
      return response;  // Devuelve la reserva actualizada
    } catch (error) {
      throw new Error(error.message);
    }
  };
  