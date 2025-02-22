export const baseUrl = "http://127.0.0.1:8080/"; // Backend Flask

export const loginUrl = `${baseUrl}login`;
export const registerUrl = `${baseUrl}signup`;
export const privateUrl = `${baseUrl}private`; // Ruta protegida

// Pantalla principal de restaurantes 
export const feedUrl = `${baseUrl}feed`;

// Ajustar según backend
export const restauranteEspecificoUrl = (id) => `${baseUrl}feed/${id}`;
export const userFavsUrl = (id) => `${baseUrl}feed/${id}/favs`;
export const userReseñasUrl = (id) => `${baseUrl}feed/${id}/resenas`;
export const userReservasUrl = (id) => `${baseUrl}feed/${id}/reservas`;
export const userPuntosUrl = (id) => `${baseUrl}users/${id}/puntos`;

// 🔹 Para hacer peticiones al backend
export const fetchWrapper = async (url, options = {}) => {
  try {
    // Petición  protegida, añadimos el token JWT
    const token = localStorage.getItem("token");
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    // Hacer la petición
    const response = await fetch(url, options);

    // Si la respuesta es 401 (no autorizado), eliminar el token y redirigir
    if (response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirigir al login
    }

    if (!response.ok) {
      throw new Error(response.statusText || response.status);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en fetchWrapper:", error);
    return { error: error.message };
  }
};
