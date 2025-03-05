import { useState, useEffect } from 'react';
import { useUserContext } from '../context/User'; // Asegúrate de importar el hook
import VolverAtras from '../components/VolverAtras';

const Reservas = () => {
  const { user, reservas = [], loading, error, getReservations, addReservation, removeReservation, updateReservation } = useUserContext(); // Cambiar getReservationsData a getReservations

  const [newReservation, setNewReservation] = useState({
    restaurante: "",
    fecha: "",
    hora: "",
    numeroPersonas: 0,
  });

  useEffect(() => {
    if (user && user.id) {
      getReservations(user.id); // Cargar reservas del usuario
    }
  }, [user, getReservations]);

  if (loading) return <p>Cargando reservas...</p>;
  if (error) return <p>{error}</p>;

  // Verificamos si hay reservas antes de intentar acceder a ellas
  if (!Array.isArray(reservas) || reservas.length === 0) {
    return <p>No tienes reservas.</p>;
  }

  const handleChange = (e) => {
    setNewReservation({ ...newReservation, [e.target.name]: e.target.value });
  };

  const handleAddReservation = () => {
    if (newReservation.restaurante && newReservation.fecha && newReservation.hora && newReservation.numeroPersonas) {
      addReservation(user.id, newReservation);
      setNewReservation({ restaurante: "", fecha: "", hora: "", numeroPersonas: 0 });
    } else {
      alert("Por favor, completa todos los campos.");
    }
  };

  return (
    <div>
      <VolverAtras />
      <h2>Reservas</h2>

      <div>
        <h3>Agregar Nueva Reserva</h3>
        <input 
          type="text" 
          name="restaurante" 
          value={newReservation.restaurante} 
          onChange={handleChange} 
          placeholder="Restaurante" 
        />
        <input 
          type="date" 
          name="fecha" 
          value={newReservation.fecha} 
          onChange={handleChange} 
        />
        <input 
          type="time" 
          name="hora" 
          value={newReservation.hora} 
          onChange={handleChange} 
        />
        <input 
          type="number" 
          name="numeroPersonas" 
          value={newReservation.numeroPersonas} 
          onChange={handleChange} 
          placeholder="Número de personas" 
        />
        <button onClick={handleAddReservation}>Agregar Reserva</button>
      </div>

      <ul>
        {reservas.map((reserva) => (
          <li key={reserva.id}>
            <p><strong>{reserva.restaurante}</strong></p>
            <p>Fecha: {reserva.fecha}</p>
            <p>Hora: {reserva.hora}</p>
            <p>Personas: {reserva.numeroPersonas}</p>

            <button onClick={() => removeReservation(user.id, reserva.id)}>Eliminar</button>
            <button onClick={() => updateReservation(user.id, reserva.id, { ...reserva, numeroPersonas: reserva.numeroPersonas + 1 })}>Actualizar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reservas;
