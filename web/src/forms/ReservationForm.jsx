import React, { useState } from "react";
import DatePicker from "react-datepicker";

import { registerLocale, setDefaultLocale } from  "react-datepicker";
import { es } from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css";
import '../styles/ReservationForm.css';

registerLocale('es', es)
setDefaultLocale('es')

const ReservationForm = () => {
  const [name, setName] = useState("");
  const [people, setPeople] = useState (1);
  const [startDate, setStartDate] = useState(new Date());

  const minTime = new Date();
  minTime.setHours(12, 0, 0); 
  const maxTime = new Date();
  maxTime.setHours(23.30, 0, 0); 

  const handleSubmit = (e) => {
    e.preventDefault();
    alert (`Reserva realizada:\nNombre: ${name}\nPersonas: ${people}\nFecha: ${startDate}`);
  };

  return (
    <div className="review-form-container">
      <h2>Reservar mesa</h2>
      <form className="review-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Usuario:</label>
          <input
            className="input-field"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Numero de personas:</label>
          <input
            className="input-field"
            type="number"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            min={1}
            required
          />
        </div>
        <div>
          <label>Fecha y hora:</label>
          <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} showTimeSelect dateFormat="Pp" locale="es" className="input-field" minTime={minTime}
            maxTime={maxTime}
            minDate={new Date()}/>        
        </div>
        <button type="submit" className="submit-button">Reservar</button>
      </form>
    </div>
  );
};


export default ReservationForm