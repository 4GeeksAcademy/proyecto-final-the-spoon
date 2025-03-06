import { useState, useEffect } from "react";
import { useUserContext } from "../context/User";
import VolverAtras from "../components/VolverAtras";
import ReservationForm from "../forms/ReservationForm";

const Reservas = ({reservasProp}) => {
  const {
    user,
    loading,
    error,
    getReservations,
    addReservation,
    removeReservation,
    updateReservation,
    restaurants,
  } = useUserContext();
  
  const reservas = reservasProp || [];

  const [showForm, setShowForm] = useState(false); // Estado para mostrar/ocultar formulario

  useEffect(() => {
    if (user?.id) {
      getReservations(user.id);
    }
  }, [user, getReservations]);

  if (loading) return <p>Loading reservations...</p>;
  if (error) return <p>{error}</p>;

  const handleAddReservation = (newReservation) => {
    addReservation(user.id, newReservation);
    setShowForm(false); // Ocultar formulario después de reservar
  };

  return (
    <div>
      <VolverAtras />
      <h2>Reservations</h2>

      {/* Botón para mostrar el formulario */}
      {!showForm && (
        <button onClick={() => setShowForm(true)} className="show-form-button">
          Book your reservation now
        </button>
      )}

      {showForm && <ReservationForm restaurants={restaurants} onSubmit={handleAddReservation} />}

      {reservasProp.length === 0 ? (
        <p>There are no reservations.</p>
      ) : (
        <ul>
          {reservasProp.map((reserva) => (
            <li key={reserva.id}>
              <p>
                <strong>{reserva.restaurante}</strong>
              </p>
              <p>Date: {reserva.fecha}</p>
              <p>People: {reserva.numeroPersonas}</p>
              <button onClick={() => removeReservation(user.id, reserva.id)}>Delete</button>
              <button
                onClick={() =>
                  updateReservation(user.id, reserva.id, { ...reserva, numeroPersonas: reserva.numeroPersonas + 1 })
                }
              >
                Update
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Reservas;
