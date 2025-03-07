  import { useState, useEffect } from "react";
  import { useUserContext } from "../context/User";
  import VolverAtras from "../components/VolverAtras";

  const Reservas = ({ reservasProp = [] }) => {
    const {
      user,
      loading,
      error,
      getReservations,
      deleteReservation,
      restaurants,
    } = useUserContext();

    // Inicializamos reservas como un array vacío si no se pasa reservasProp
    const [reservas, setReservas] = useState(reservasProp);

    useEffect(() => {
      if (user?.id) {
        getReservations(user.id)
          .then((data) => {
            console.log(data)
            setReservas(data)
          })
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
                  <strong>{reserva.restaurant.name}</strong>
                </p>
                <p>Location: {reserva.restaurant.location}</p>
                <p>Date: {reserva.date}</p>
                <p>People: {reserva.people}</p>
                <button onClick={() => deleteReservation(user.id, reserva.id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>)}
      </div>
    );
  };

  export default Reservas;