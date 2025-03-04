import { useState, useEffect } from 'react';
import VolverAtras from '../components/VolverAtras';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/resenas`)
      .then((response) => response.json())
      .then((data) => {
        setReviews(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener reseñas:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando reseñas...</p>;
  if (!reviews.length) return <p>No tienes reseñas.</p>;

  return (
    <div>
      <VolverAtras /> {/* Botón para volver atrás */}
      <h2>Reseñas</h2>
      {reviews.length === 0 ? (
        <p>No tienes reseñas.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <p><strong>{review.restaurante}</strong> - {review.user}</p>
              <p>{review.puntuacion}</p>
              <p>{review.comentario}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Reviews;
