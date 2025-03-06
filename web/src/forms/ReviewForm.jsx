import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { useUserContext } from '../context/User'; // Extraemos el usuario desde el contexto
import '../styles/ReviewForm.css';
import { addReview } from '../services/api/reviews';

function ReviewForm({ restaurantId }) {
  // Extraemos el usuario desde el contexto
  const { user } = useUserContext();
  
  // Si el usuario no está logueado, no mostramos el formulario
  if (!user) {
    return (
      <div className="review-form-container">
        <h2>Leave a review</h2>
        <p>Debes iniciar sesión para comentar.</p>
      </div>
    );
  }

  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(1);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const reviewData = {
      comment,
      rating,
      user_id: user.id,
    };

    addReview(restaurantId, reviewData);

    setComment('');
    setRating(1);
  };

  // Función para detectar clic en media o estrella completa
  const handleStarClick = (event, starNumber) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - left;
    if (clickX < width / 2) {
      setRating(starNumber - 0.5);
    } else {
      setRating(starNumber);
    }
  };

  // Función para renderizar las estrellas con soporte para valores flotantes
  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        // Estrella completa
        stars.push(
          <span
            key={i}
            className="star filled"
            onClick={(e) => handleStarClick(e, i)}
            role="button"
            aria-label={`Puntuación ${i}`}
          >
            <FontAwesomeIcon icon={faStar} />
          </span>
        );
      } else if (rating >= i - 0.5) {
        // Media estrella
        stars.push(
          <span
            key={i}
            className="star filled"
            onClick={(e) => handleStarClick(e, i)}
            role="button"
            aria-label={`Puntuación ${i - 0.5}`}
          >
            <FontAwesomeIcon icon={faStarHalfAlt} />
          </span>
        );
      } else {
        // Estrella vacía
        stars.push(
          <span
            key={i}
            className="star"
            onClick={(e) => handleStarClick(e, i)}
            role="button"
            aria-label={`Puntuación ${i}`}
          >
            <FontAwesomeIcon icon={faStar} />
          </span>
        );
      }
    }
    return stars;
  };

  return (
    <div className="review-form-container">
      <h2>Leave a review</h2>
      <div className="user-info">
        <p>
          <strong>User:</strong> {user.name}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label htmlFor="comment">Comment:</label>
          <textarea
            id="comment"
            name="comment"
            value={comment}
            onChange={handleCommentChange}
            required
            placeholder="Escribe tu comentario aquí"
            className="textarea"
          />
        </div>
        <div className="form-group">
          <label htmlFor="rating">Mark:</label>
          <div className="stars">{renderStars(rating)}</div>
        </div>
        <div className="form-group">
          <button type="submit" className="submit-button">
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
}

export default ReviewForm;
