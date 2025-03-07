import { useState, useEffect } from "react";
import { useUserContext } from "../context/User";
import VolverAtras from "../components/VolverAtras";

const Reservas = ({ reservasProp = [] }) => {
  const {
    user,
    loading,
    error,
    getReservations,
    removeReservation,
    updateReservation,
  } = useUserContext();
  
  // Inicializamos reservas como un array vacío si no se pasa reservasProp
  const [reservas, setReservas] = useState(reservasProp);

  useEffect(() => {
    if (user?.id) {
      getReservations(user.id)
        .then((data) => setReservas(data))
        .catch((err) => console.error("Error al obtener reservas:", err));
    }
  }, [user, getReservations]);

  if (loading) return <p>Loading reservations...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <VolverAtras />
      <h2>Reservations</h2>
      {reservas.length === 0 ? (
        <p>There are no reservations.</p>
      ) : (
        <ul>
          {reservas.map((reserva) => (
            <li key={reserva.id}>
              <p>
                <strong>{reserva.restaurante}</strong>
              </p>
              <p>Date: {reserva.fecha}</p>
              <p>People: {reserva.numeroPersonas}</p>
              <button onClick={() => removeReservation(user.id, reserva.id)}>
                Delete
              </button>
              <button
                onClick={() =>
                  updateReservation(user.id, reserva.id, {
                    ...reserva,
                    numeroPersonas: reserva.numeroPersonas + 1,
                  })
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
