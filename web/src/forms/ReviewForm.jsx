import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { useUserContext } from '../context/User'; // Asegúrate de importar UserContext
import '../styles/ReviewForm.css';

function ReviewForm({ user }) {
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(1);
    const [createdAt] = useState(new Date().toLocaleDateString('es-ES'));
    const { addReview } = useUserContext(); // Acceder a la función addReview del UserContext

    const handleCommentChange = (event) => {
        setComment(event.target.value);
    };

    const handleRatingChange = (event) => {
        setRating(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        // Datos de la reseña
        const reviewData = {
            comment,
            rating,
            user_id: user.id,
            created_at: createdAt
        };

        // Llamar a la función addReview desde el contexto para agregar la reseña
        addReview(user.id, reviewData); // Llamar a addReview para agregar la nueva reseña

        // Limpiar el formulario
        setComment('');
        setRating(1);
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
                <p><strong>Usuario:</strong> {user ? user.name : 'Anónimo'}</p> 
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
