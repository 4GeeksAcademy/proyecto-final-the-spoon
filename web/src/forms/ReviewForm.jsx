import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import '../styles/ReviewForm.css';

function ReviewForm({ user }) {
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(1);
    const [createdAt] = useState(new Date().toLocaleDateString('es-ES'));


    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleRatingChange = (event) => {
        setRating(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Datos al backend
        const reviewData = {
            comment,
            rating,
            user_id: user.id,
            created_at: createdAt
        };

        fetch('/api/reviews', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reviewData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Reseña enviada:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const renderStars = (rating) => {
        let stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={`star ${i <= rating ? 'filled' : ''}`}
                    onClick={() => setRating(i)}
                    role="button"
                    aria-label={`Puntuación ${i}`}
                >
                    <FontAwesomeIcon icon={faStar} className={i <= rating ? 'filled' : ''} />
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="review-form-container">
            <h2>Deja tu Reseña</h2>
            <div className="user-info">
                <p><strong>Usuario:</strong> {user ? user.name : 'Anónimo'}</p> {/* Mostrar el nombre del usuario */}
                <p><strong>Fecha:</strong> {createdAt}</p>
            </div>
            <form onSubmit={handleSubmit} className="review-form">
                <div className="form-group">
                    <label htmlFor="comment">Comentario:</label>
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
                    <label htmlFor="rating">Puntuación:</label>
                    <div className="stars">
                        {renderStars(rating)}
                    </div>
                </div>
                <div className="form-group">
                    <button type="submit" className="submit-button">Enviar Reseña</button>
                </div>
            </form>
        </div>
    );
}

export default ReviewForm;
