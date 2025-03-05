// Cargar reservas del usuario
export const getReservations = async (userId) => {
    try {
      const response = await fetchWrapper(`users/${userId}/reservations`);  // Sin "/api"
      if (!response.ok) {
        throw new Error("No se pudieron cargar las reservas.");
      }
      return response;  // El fetchWrapper ya devuelve la respuesta procesada como JSON
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  // Agregar una nueva reserva
  export const addReservation = async (userId, reservationData) => {
    try {
      const response = await fetchWrapper(`users/${userId}/reservations`, {
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
      const response = await fetchWrapper(`users/${userId}/reservations/${reservationId}`, {
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
      const response = await fetchWrapper(`users/${userId}/reservations/${reservationId}`, {
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
  