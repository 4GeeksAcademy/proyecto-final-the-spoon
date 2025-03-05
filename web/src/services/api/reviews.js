import {fetchWrapper, userReviewsUrl} from './fetch'; // Asegúrate de importar fetchWrapper

export const getReviews = async (userId) => {
  try {
    const response = await fetchWrapper(userReviewsUrl);
    return response; // Retornamos la respuesta que viene de la API
  } catch (error) {
    console.error(error);
    return []; // En caso de error, retornamos un array vacío
  }
};

export const addReview = async (userId, reviewData) => {
  try {
    const response = await fetchWrapper(`/api/reviews/${userId}`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
    return response; // Retornamos la respuesta que viene de la API
  } catch (error) {
    console.error(error);
    throw error; // Propagamos el error para que pueda manejarse más arriba
  }
};

export const updateReview = async (reviewId, updatedData) => {
  try {
    const response = await fetchWrapper(`/api/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(updatedData),
    });
    return response; // Retornamos la respuesta que viene de la API
  } catch (error) {
    console.error(error);
    throw error; // Propagamos el error para que pueda manejarse más arriba
  }
};

export const deleteReview = async (reviewId) => {
  try {
    const response = await fetchWrapper(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
    });
    return response; // Retornamos la respuesta que viene de la API
  } catch (error) {
    console.error(error);
    throw error; // Propagamos el error para que pueda manejarse más arriba
  }
};
