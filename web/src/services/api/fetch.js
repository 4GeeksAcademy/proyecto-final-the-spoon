export const baseUrl = "https://fluffy-space-telegram-v6qp6pqgq4pgc69wx-5000.app.github.dev/"; // Backend Render

export const loginUrl = "login";
export const registerUrl = "register";
export const logoutUrl = "logout";
export const privateUrl = `${baseUrl}private`; // Ruta protegida

// Pantalla principal de restaurantes 
export const restaurantsUrl = `${baseUrl}restaurants`;

// Ajustar según backend
export const restaurantIdUrl = (id) => `${baseUrl}restaurants/${id}`;
export const userFavsUrl = (id) => `${baseUrl}users/${id}/favorites`;
export const userReviewsUrl = (id) => `${baseUrl}users/${id}/reviews`;
export const userReservationsUrl = (id) => `${baseUrl}users/${id}/reservations`;
export const userPointsUrl = (id) => `${baseUrl}users/${id}/puntos`; // AQUÍ HABRÍA QUE FILTRAR POR LOS DATOS QUE CONTIENE EL USUARIO EN BBDD

// 🔹 Para hacer peticiones al backend
export const fetchWrapper = async (url, options = {}) => {
  try {
    // Obtener el token JWT (si el backend lo usa en localStorage)
    const token = localStorage.getItem("token");
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    // Obtener el CSRF-Token si está presente en sessionStorage
    const csrfToken = sessionStorage.getItem("csrf_access_token");
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