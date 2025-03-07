import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/User";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import "../styles/ReviewForm.css";

const ReviewForm = ({ restaurantId, onReviewSubmit }) => {
  const location = useLocation();
  const restaurant = location.state?.restaurant;
  const { user } = useUserContext();
  const navigate = useNavigate();

  if (!user || !user.id) {
    return (
      <div className="review-form-container">
        <h2>Leave a review</h2>
        <p>Debes iniciar sesión para comentar.</p>
        <button onClick={() => navigate("/login")} className="submit-button">
          Iniciar sesión
        </button>
      </div>
    );
  }

  const [comment, setComment] = useState("");
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

    onReviewSubmit(reviewData);
    setComment("");
    setRating(1);
  };

  const handleStarClick = (event, starNumber) => {
    const { left, width } = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - left;
    if (clickX < width / 2) {
      setRating(starNumber - 0.5);
    } else {
      setRating(starNumber);
    }
  };

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
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
          <strong>User:</strong> {user.username}
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
};

export default ReviewForm;
