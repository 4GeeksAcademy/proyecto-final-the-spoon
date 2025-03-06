import React, { useState, useEffect } from 'react';
import { useUserContext } from '../context/User'; // Importar UserContext
import { FaArrowLeft } from 'react-icons/fa';

const Reviews = ({ restaurantId }) => {
  const { reviews = [], loading, error } = useUserContext(); // Asegurarse de que reviews sea un arreglo
  const [filteredReviews, setFilteredReviews] = useState([]);

  useEffect(() => {
    // Asegurarse de que reviews sea siempre un arreglo
    const safeReviews = Array.isArray(reviews) ? reviews : [];
    setFilteredReviews(safeReviews.filter(review => review.restaurantId === restaurantId));
  }, [reviews, restaurantId]); // Dependencia para actualizar cuando reviews o restaurantId cambien

  return (
    <div>
      <h2>Reseñas de tu Restaurante</h2>

      {loading && <p>Cargando reseñas...</p>}
      {error && <p>{error}</p>}

      <ul>
        {Array.isArray(filteredReviews) && filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <li key={review.id}>
              <p><strong>Restaurante: {review.restaurantId}</strong></p>
              <p>Calificación: {review.rating}</p>
              <p>{review.content}</p>
            </li>
          ))
        ) : (
          <p>No hay reseñas disponibles para este restaurante.</p> // Mensaje si no hay reseñas
        )}
      </ul>
      <button
        onClick={handleBackClick}
        style={{
          cursor: 'pointer',
          fontSize: '20px',
          marginBottom: '20px',
          padding: '10px 15px',
          border: 'none',
          backgroundColor: '#f1f1f1',
          borderRadius: '5px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <FaArrowLeft style={{ marginRight: '8px' }} />
        Volver
      </button>
    </div>
  );
};

export default Reviews;
