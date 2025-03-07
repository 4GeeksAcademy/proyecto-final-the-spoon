import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import theSpoonImage from "../assets/The Spoon.png";
import ReviewForm from "../forms/ReviewForm";
import UserLoginForm from "../forms/UserLoginForm";
import ReservationForm from "../forms/ReservationForm";
import { baseUrl } from "../services/api/fetch";
import { useUserContext } from "../context/User";

const RestauranteDetalle = () => {
  const { id } = useParams();
  const { user, addReservation, getReservations } = useUserContext();
  const [restaurante, setRestaurante] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  // Estado para controlar la visibilidad de los modales
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  // Estado local para reservas, si lo usas en este componente (para actualizar el listado)
  const [localReservas, setLocalReservas] = useState([]);

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

  // Función para agregar una reserva y actualizar el listado
  const handleAddReservation = async (newReservation) => {
    try {
      await addReservation(user.id, newReservation);
      alert("Reserva completada con éxito");
      const updatedReservations = await getReservations(user.id);
      setLocalReservas(updatedReservations);
    } catch (error) {
      console.error("Error al agregar reserva:", error);
    }
  };

  const handleReviewSubmit = (newReview) => {
    setReviews((prevReviews) => [newReview, ...prevReviews]);
  };

  // Al hacer clic en "Reservar"
  const handleReservarClick = () => {
    if (user && user.id) {
      setShowReservationModal(true);
    } else {
      setShowLoginModal(true);
    }
  };

  if (loading)
    return <p className="text-center mt-5 fs-4 text-primary">Loading details...</p>;
  if (!restaurante)
    return <p className="text-center mt-5 fs-4 text-danger">Restaurant not found</p>;

  const imageSrc = restaurante.imagen ? restaurante.imagen : theSpoonImage;

  return (
    <div className="container">
      {/* Modal de Login */}
      <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Log in</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <UserLoginForm
            onClose={() => {
              setShowLoginModal(false);
              // Tras login exitoso, abre el modal de reserva
              setShowReservationModal(true);
            }}
          />
        </Modal.Body>
      </Modal>

      {/* Modal de Reserva */}
      <Modal show={showReservationModal} onHide={() => setShowReservationModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Book a reservation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReservationForm
            onClose={() => setShowReservationModal(false)}
            restaurant={restaurante}
            onSubmit={handleAddReservation}
          />
        </Modal.Body>
      </Modal>

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
            <button className="btn btn-success" onClick={handleReservarClick}>
              🏷️ Reserve
            </button>
          </div>
          <div className="text-center mt-4">
            <Link to="/" className="btn btn-outline-primary">
              ← Return
            </Link>
          </div>
          <div className="mt-5">
            <h3 className="text-center">Reviews</h3>
            {user && user.id ? (
              <ReviewForm restaurantId={id} onReviewSubmit={handleReviewSubmit} />
            ) : (
              <div className="text-center">
                <p>Login to leave a review.</p>
              </div>
            )}
            {reviews.length > 0 ? (
              <ul className="list-group1">
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
