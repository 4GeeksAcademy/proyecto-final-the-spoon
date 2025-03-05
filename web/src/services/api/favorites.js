import { baseUrl, favoritesUrl } from "./fetch";

// Función para obtener los favoritos del usuario desde la API
export const loadFavorites = async (userId) => {
  try {
    const response = await fetch(`${baseUrl}${favoritesUrl}/${userId}`);
    
    if (response.status === 404) {
      return [];  // Si no se encuentran favoritos, devolver un array vacío
    }
    
    if (!response.ok) {
      throw new Error(`Error al obtener favoritos: ${response.statusText}`);
    }

    const data = await response.json();
    if (Array.isArray(data)) {
      return data;  // Si la respuesta es un array, lo retornamos
    } else {
      console.error("Los datos obtenidos no son un array.");
      return [];
    }
  } catch (error) {
    console.error("Error al cargar favoritos:", error);
    return [];  // En caso de error, retornamos un array vacío
  }
};
