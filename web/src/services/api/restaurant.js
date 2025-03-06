import { baseUrl, restaurantsUrl } from "./fetch";
import { fetchWrapper } from "./fetch";  // Importamos el fetchWrapper

const postRestaurantEndpoint = `${baseUrl}${restaurantsUrl}`; // /api/restaurant

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

    return data; 
  } catch (error) {
    console.error("Error en postRestaurant:", error);
    throw error;
  }
};

export const getUserRestaurants = async (userId) => {
  try {
    const data = await fetchWrapper(`${baseUrl}users/${userId}/restaurants`)
    return data;
  } catch (error) {
    return [];
  }
};

