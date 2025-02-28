import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "../styles/AddRestaurant.css";

const AddRestaurant = () => {
  const [location, setLocation] = useState({ lat: 40.4168, lng: -3.7038 }); // Coordenadas de Madrid
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [foodType, setFoodType] = useState("MEXICAN");
  const [userId, setUserId] = useState("");
  const [showForm, setShowForm] = useState(true); // Estado para controlar la visibilidad del formulario

  // Definimos las opciones del mapa
  const containerStyle = {
    width: "100%",
    height: "400px",
  };

  const center = {
    lat: location.lat,
    lng: location.lng,
  };

  // cambio de ubicación cuando el usuario hace clic en el mapa
  const handleMapClick = (e) => {
    setLocation({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const restaurantData = {
      administrator: userId,
      location: location, // ubicación (lat, lng)
      description: description,
      food_type: foodType,
      name: name,
    };

    fetch("http://localhost:5000/restaurants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(restaurantData),
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.href = `/restaurantes/${data.id}`;
      })
      .catch((error) => console.error("Error al crear el restaurante:", error));
  };

  // Función para cerrar el formulario
  const closeForm = () => {
    setShowForm(false);
  };

  return (
    showForm && (
      <form onSubmit={handleSubmit} className="add-restaurant-form">
        <div className="add-restaurant-container">
          {/* Botón de cierre */}
          <button type="button" className="close-button" onClick={closeForm}>
            &times;
          </button>

          <h2>Añadir Restaurante</h2>
  
          <div className="form-group">
            <label htmlFor="name">Nombre del Restaurante</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
  
          <div className="form-group">
            <label htmlFor="description">Descripción</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
  
          <div className="form-group">
            <label htmlFor="foodType">Tipo de comida</label>
            <select
              id="foodType"
              value={foodType}
              onChange={(e) => setFoodType(e.target.value)}
              required
            >
              {["MEXICAN", "ITALIAN", "CHINESE"].map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
  
          {/* Mapa de Google */}
          <div className="form-group google-map">
            <label htmlFor="location">Ubicación</label>
            <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15}
                onClick={handleMapClick}
              >
                <Marker position={location} />
              </GoogleMap>
            </LoadScript>
          </div>
  
          <button type="submit" className="submit-button">
            Crear Restaurante
          </button>
        </div>
      </form>
    )
  );
};

export default AddRestaurant;
