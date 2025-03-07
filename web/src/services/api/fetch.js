import { postLogout } from "./auth";

export const baseUrl = "/api/"; // Backend Render

export const loginUrl = "login";
export const registerUrl = "register";
export const logoutUrl = "logout";
export const privateUrl = `${baseUrl}private`; 
export const restaurantsUrl = "restaurants"; // Ruta protegida
export const reservationsUrl = `reservations`;
export const reviewUrl = "review"; 


// Ajustar según backend
export const restaurantIdUrl = (id) => `${baseUrl}restaurants/${id}`;
export const userReservationsUrl = (id) => `${baseUrl}users/${id}/reservations`;
export const userPointsUrl = (id) => `${baseUrl}users/${id}/puntos`; // AQUÍ HABRÍA QUE FILTRAR POR LOS DATOS QUE CONTIENE EL USUARIO EN BBDD

// 🔹 Para hacer peticiones al backend
export const fetchWrapper = async (url, options = {}) => {
  try {
    if (!url) throw new Error("URL no proporcionada a fetchWrapper");

    console.log("Haciendo petición a:", url); // Depuración

    options.headers = options.headers || {};

    const token = localStorage.getItem("token");
    if (token) options.headers.Authorization = `Bearer ${token}`;

    const csrfToken = sessionStorage.getItem("csrf_access_token")    
    if (csrfToken) {
      options.headers = {
        ...options.headers,
        "X-CSRF-Token": csrfToken,
      };
    }

    // Incluir credenciales (cookies)
    options.credentials = "include";

    // Hacer la petición
    const response = await fetch(url, options);

    // Manejar errores de autenticación (401 - No autorizado)
    if (response.status === 401) {
      localStorage.removeItem("token"); // Eliminar token almacenado
      await postLogout(); // Llamar a la función de logout
      window.location.href = "/login"; // Redirigir al login
    }

    // Lanzar error si la respuesta no es OK
    if (!response.ok) {
      throw new Error(response.statusText || response.status);
    }

    return await response.json();
  } catch (error) {
    console.error("Error en fetchWrapper:", error);
    return { error: error.message };
  }
};
