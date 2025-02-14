export const baseUrl =
  "";
export const usersUrl = "users/";
export const loginUrl = "login/";
export const registerUrl = "register/";
//Con Feed me refiero a la pantalla general//
export const feedUrl = "feed/";
//No me acuerdo como era esto revisarlo//
export const restauranteespecficoUrl = "main/:id";
export const userFavsUrl = "main/:id/favs/";
export const userReseñasUrl = "main/:id/resenas/";
export const userReservasUrl = "main/:id/reservas/";
export const userPuntosUrl = "users/:id/puntos/";


export const fetchWrapper = async (input, init) => {
  return await fetch(input, init)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText || response.status);
    })
    .then((data) => {
      return data;
    })
    .catch((error) => {
      return error;
    });
};