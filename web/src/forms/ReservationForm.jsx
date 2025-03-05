import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/ReservationForm.css";

registerLocale("es", es);

const ReservationForm = ({ restaurants, onSubmit }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState("");
  const [people, setPeople] = useState(1);
  const [startDate, setStartDate] = useState(new Date());

  const minTime = new Date();
  minTime.setHours(12, 0, 0);
  const maxTime = new Date();
  maxTime.setHours(23, 30, 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRestaurant) {
      alert("Por favor, selecciona un restaurante.");
      return;
    }
    onSubmit({ restaurante: selectedRestaurant, fecha: startDate, numeroPersonas: people });
    setSelectedRestaurant("");
    setPeople(1);
    setStartDate(new Date());
  };

  return (
    <div className="reservation-form-container">
      <h2>Reservar mesa</h2>
      <form className="reservation-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Restaurante:</label>
          <select
            className="input-field"
            value={selectedRestaurant}
            onChange={(e) => setSelectedRestaurant(e.target.value)}
            required
          >
            <option value="">Selecciona un restaurante</option>
            {restaurants.map((restaurant) => (
              <option key={restaurant.id} value={restaurant.name}>
                {restaurant.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Número de personas:</label>
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
          <label>Fecha y hora:</label>
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
          Reservar
        </button>
      </form>
    </div>
  );
};

export default ReservationForm;
