import { baseUrl, addRestaurantUrl } from "./fetch";
import { fetchWrapper } from "./fetch";  // Importamos el fetchWrapper

const postRestaurantEndpoint = `${baseUrl}${addRestaurantUrl}`; // /api/restaurant

// Función para agregar un restaurante
export const postRestaurant = async (restaurantData) => {
  try {
    // Usamos fetchWrapper para manejar la petición POST
    const data = await fetchWrapper(postRestaurantEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(restaurantData),
    });

    return data; // Regresamos la respuesta del backend
  } catch (error) {
    console.error("Error en postRestaurant:", error);
    throw error; 
  }
};
