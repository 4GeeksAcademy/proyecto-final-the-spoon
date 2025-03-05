import { useState, useEffect } from "react";
import { useUserContext } from "../context/User";
import VolverAtras from "../components/VolverAtras";
import ReservationForm from "../forms/ReservationForm";

const Reservas = ({ reservasProp }) => {
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
  
  const reservas = reservasProp || []; // Aquí definimos reservas correctamente

  const [showForm, setShowForm] = useState(false); // Estado para mostrar/ocultar formulario

  useEffect(() => {
    if (user?.id) {
      getReservations(user.id); // Obtenemos las reservas del usuario
    }
  }, [user, getReservations]);

  if (loading) return <p>Cargando reservas...</p>;
  if (error) return <p>{error}</p>;

  const handleAddReservation = (newReservation) => {
    addReservation(user.id, newReservation);
    setShowForm(false); // Ocultar formulario después de reservar
  };

  return (
    <div>
      <VolverAtras />
      <h2>Reservas</h2>

      {/* Botón para mostrar el formulario */}
      {!showForm && (
        <button onClick={() => setShowForm(true)} className="show-form-button">
          Haz tu reserva ahora
        </button>
      )}

      {showForm && <ReservationForm restaurants={restaurants} onSubmit={handleAddReservation} />}

      {/* Verificamos si hay reservas usando la variable 'reservas' */}
      {reservas.length === 0 ? (
        <p>No tienes reservas.</p>
      ) : (
        <ul>
          {reservas.map((reserva) => (
            <li key={reserva.id}>
              <p>
                <strong>{reserva.restaurante}</strong>
              </p>
              <p>Fecha: {reserva.fecha}</p>
              <p>Personas: {reserva.numeroPersonas}</p>
              <button onClick={() => removeReservation(user.id, reserva.id)}>Eliminar</button>
              <button
                onClick={() =>
                  updateReservation(user.id, reserva.id, { ...reserva, numeroPersonas: reserva.numeroPersonas + 1 })
                }
              >
                Actualizar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Reservas;
