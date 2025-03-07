import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import { useLocation } from "react-router-dom";
import { useUserContext } from "../context/User";  // Importamos el contexto para obtener el user
import { format } from "date-fns";

import "react-datepicker/dist/react-datepicker.css";
import "../styles/ReservationForm.css";

registerLocale("es", es);

const ReservationForm = ({
  onSubmit = (reservationData) =>
    console.log("Reserva recibida (default):", reservationData),
}) => {
  // Extraemos el restaurante desde el state de la navegación
  const location = useLocation();
  const restaurant = location.state?.restaurant;
  // Obtenemos el user del contexto
  const { user } = useUserContext();

  const [people, setPeople] = useState(1);
  const [startDate, setStartDate] = useState(new Date());

  const minTime = new Date();
  minTime.setHours(12, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(23, 30, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!restaurant) {
      alert("No se encontró el restaurante.");
      return;
    }
    if (!user) {
      alert("Usuario no identificado.");
      return;
    }
    const formattedDate = format(startDate, "yyyy-MM-dd HH:mm:ss");
    // Construir el payload con los nombres de campos que espera el backend:
    const payload = {
      restaurant_id: restaurant.id, 
      date: formattedDate,
      numeroPersonas: people,
      user_id: user.id,  // Esto asocia la reserva al usuario (por ejemplo, 5)
    };
    console.log("Payload enviado:", payload);
    onSubmit(payload);
    setPeople(1);
    setStartDate(new Date());
  };

  return (
    <div className="reservation-form-container">
      <h2>Book a table</h2>
      <form className="reservation-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Restaurant:</label>
          {/* Mostramos el nombre del restaurante de forma fija */}
          <p className="input-field">
            {restaurant ? restaurant.name : "Restaurante desconocido"}
          </p>
        </div>
        <div className="form-group">
          <label>Number of persons:</label>
          <input
            className="input-field"
            type="number"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            min={1}
            required
          />
        </div>
        <div className="form-group">
          <label>Date and time:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            showTimeSelect
            dateFormat="Pp"
            locale="es"
            className="input-field"
            minTime={minTime}
            maxTime={maxTime}
            minDate={new Date()}
          />
        </div>
        <button type="submit" className="submit-button">
          Reserve
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
