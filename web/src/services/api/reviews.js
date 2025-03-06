import {fetchWrapper, userReviewsUrl} from './fetch'; // Asegúrate de importar fetchWrapper
import { baseUrl } from './fetch';

export const getReviews = async (userId) => {
  try {
    const response = await fetchWrapper(userReviewsUrl);
    return response; // Retornamos la respuesta que viene de la API
  } catch (error) {
    console.error(error);
    return []; // En caso de error, retornamos un array vacío
  }
};

export const addReview = async (restaurantId, reviewData) => {
  try {
    const response = await fetchWrapper(`${baseUrl}restaurants/${restaurantId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
    return response;
  } catch (error) {
    console.error(error);
    throw error; 
  }
};



export const deleteReview = async (reviewId) => {
  try {
    const response = await fetchWrapper(`${baseUrl}reviews/${reviewId}`, {
      method: 'DELETE',
    });
    return response; // Retornamos la respuesta que viene de la API
  } catch (error) {
    console.error(error);
    throw error; // Propagamos el error para que pueda manejarse más arriba
  }
};
