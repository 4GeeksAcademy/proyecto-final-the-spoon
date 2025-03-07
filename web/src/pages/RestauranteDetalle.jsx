import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import theSpoonImage from '../assets/The Spoon.png';
import ReviewForm from "../forms/ReviewForm";
import { baseUrl } from "../services/api/fetch";
import { useUserContext } from "../context/User";

const RestauranteDetalle = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const [restaurante, setRestaurante] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar detalles del restaurante
    fetch(`${baseUrl}restaurants/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRestaurante(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar detalles:", error);
        setLoading(false);
      });

    // Cargar reseñas del restaurante
    fetch(`${baseUrl}restaurants/${id}/reviews`)
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((error) => console.error("Error al cargar reseñas:", error));
  }, [id]);

  const handleReviewSubmit = (newReview) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  if (loading)
    return <p className="text-center mt-5 fs-4 text-primary">Loading details...</p>;

  if (!restaurante)
    return <p className="text-center mt-5 fs-4 text-danger">Restaurant not found</p>;

  const imageSrc = restaurante.imagen ? restaurante.imagen : theSpoonImage;

  return (
    <div className="container">
      <div className="card shadow-lg">
        <img
          src={imageSrc}
          alt={restaurante.name}
          className="card-img-top"
          style={{ height: "100px", width: "100px" }}
        />
        <div className="card-body">
          <h1 className="card-title text-center text-primary">{restaurante.name}</h1>
          <h5 className="text-muted text-center">{restaurante.food_type}</h5>
          <p className="text-center text-secondary">{restaurante.location}</p>
          <p className="card-text text-center mt-3">{restaurante.description}</p>
          <div className="text-center mt-4">
            <Link
              to="/reservations"
              className="btn btn-success"
              state={{ restaurant: restaurante }}
            >
              🏷️ Reservar
            </Link>
          </div>
          <div className="text-center mt-4">
            <Link to="/" className="btn btn-outline-primary">
              ← Return
            </Link>
          </div>
          <div className="mt-5">
            <h3 className="text-center">Reviews</h3>
            {/* Solo mostramos el formulario de reseñas si el usuario está logueado */}
            {user ? (
              <ReviewForm restaurantId={id} onReviewSubmit={handleReviewSubmit} />
            ) : (
              <p className="text-center">Inicia sesión para dejar un review.</p>
            )}
            {reviews.length > 0 ? (
              <ul className="list-group">
                {reviews.map((review) => (
                  <li key={review.id} className="list-group-item">
                    <p><strong>Rating:</strong> {review.rating}</p>
                    <p>{review.comment}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted">
                No reviews available for this restaurant.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestauranteDetalle;
