import { useState, useEffect } from 'react';
import VolverAtras from '../components/VolverAtras';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/reservas`)
      .then((response) => response.json())
      .then((data) => {
        setReservas(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener las reservas:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Cargando reservas...</p>;
  if (!reservas.length) return <p>No tienes reservas.</p>;

  return (
    <div>
      <VolverAtras /> {/* Botón para volver atrás */}
      <h2>Reservas</h2>
      <ul>
        {reservas.map((reserva) => (
          <li key={reserva.id}>
            <p><strong>{reserva.restaurante}</strong> - {reserva.user}</p>
            <p>Fecha: {reserva.fecha}</p>
            <p>Hora: {reserva.hora}</p>
            <p>Personas: {reserva.numeroPersonas}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Reservas;
