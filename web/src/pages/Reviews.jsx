import React, { useState, useEffect } from 'react';
import { useUserContext } from '../context/User'; // Importar UserContext

const Reviews = () => {
  const { user, reviews = [], loading, error, addReview, updateReview, deleteReview } = useUserContext(); // Asegurar que reviews sea un arreglo
  const [newReview, setNewReview] = useState({
    restaurantId: '',
    content: '',
    rating: 0,
  });

  // Efecto para obtener reseñas cuando el usuario cambie
  useEffect(() => {
    if (user && user.id) {
      // Aquí puedes agregar la lógica para obtener las reseñas si es necesario.
      // Si ya se manejan a través del contexto, no hace falta hacer nada aquí.
    }
  }, [user]);

  const handleChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleAddReview = () => {
    if (newReview.restaurantId && newReview.content && newReview.rating) {
      addReview(user.id, newReview);
      setNewReview({ restaurantId: '', content: '', rating: 0 }); // Limpiar el formulario
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  const handleDeleteReview = (reviewId) => {
    deleteReview(reviewId);
  };

  const handleUpdateReview = (reviewId, updatedData) => {
    updateReview(reviewId, updatedData);
  };

  return (
    <div>
      <h2>Reseñas</h2>

      {loading && <p>Cargando reseñas...</p>}
      {error && <p>{error}</p>}

      <div>
        <h3>Agregar Nueva Reseña</h3>
        <input
          type="text"
          name="restaurantId"
          value={newReview.restaurantId}
          onChange={handleChange}
          placeholder="ID del Restaurante"
        />
        <textarea
          name="content"
          value={newReview.content}
          onChange={handleChange}
          placeholder="Contenido de la reseña"
        />
        <input
          type="number"
          name="rating"
          value={newReview.rating}
          onChange={handleChange}
          min="1"
          max="5"
          placeholder="Calificación (1-5)"
        />
        <button onClick={handleAddReview}>Agregar Reseña</button>
      </div>

      <ul>
        {/* Verificar si 'reviews' es un arreglo antes de hacer map */}
        {Array.isArray(reviews) && reviews.length > 0 ? (
          reviews.map((review) => (
            <li key={review.id}>
              <p><strong>Restaurante: {review.restaurantId}</strong></p>
              <p>Calificación: {review.rating}</p>
              <p>{review.content}</p>
              <button onClick={() => handleDeleteReview(review.id)}>Eliminar</button>
              <button onClick={() => handleUpdateReview(review.id, { ...review, content: 'Nuevo contenido' })}>Actualizar</button>
            </li>
          ))
        ) : (
          <p>No hay reseñas disponibles.</p> // Mensaje si no hay reseñas
        )}
      </ul>
    </div>
  );
};

export default Reviews;
