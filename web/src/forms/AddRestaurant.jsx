import React, { useState, useContext } from "react";
import { UserContext } from "../context/User";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "../styles/AddRestaurant.css";

const AddRestaurant = ({ onRestaurantCreated }) => {
  const [location, setLocation] = useState({ lat: 40.4168, lng: -3.7038 }); // Coordenadas de Madrid por defecto
  const [address, setAddress] = useState(""); // Dirección a buscar
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [foodType, setFoodType] = useState("MEXICAN");
  const [showForm, setShowForm] = useState(true);
  const [loading, setLoading] = useState(false); // Estado de carga para el submit
  const [isSearching, setIsSearching] = useState(false); // Estado para manejar la búsqueda de dirección
  const [searchError, setSearchError] = useState(""); // Para mostrar errores de búsqueda

  const { user, addRestaurant } = useContext(UserContext);

  // Opciones de comida
  const foodTypes = ["MEXICAN", "ITALIAN", "CHINESE"];

  // Maneja el cambio de la dirección
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  // Maneja la búsqueda de la dirección
  const handleSearchAddress = async () => {
    if (address.length > 3) { // Solo buscar si la longitud es mayor a 3 caracteres
      setIsSearching(true); // Indicamos que estamos buscando
      setSearchError(""); // Limpiar cualquier error previo
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address}&addressdetails=1`);
        const data = await response.json();

        if (data.length > 0) {
          const { lat, lon, display_name } = data[0]; // Usamos display_name como dirección completa
          setLocation({
            lat: parseFloat(lat),
            lng: parseFloat(lon),
          });
          setAddress(display_name); // Establecemos la dirección completa
        } else {
          setSearchError("No se encontró la dirección. Intenta con otra.");
          setIsSearching(false); // Desactivamos la búsqueda
        }
      } catch (error) {
        console.error("Error al buscar la dirección:", error);
        setSearchError("Error al realizar la búsqueda de la dirección.");
        setIsSearching(false); // Desactivamos la búsqueda en caso de error
      }
    } else {
      setSearchError("La dirección debe tener al menos 4 caracteres.");
    }
  };

  // Enviar formulario usando el contexto para agregar el restaurante
  const handleSubmit = (e) => {
    e.preventDefault(); // Previene que la página se recargue al enviar el formulario

    // Asegúrate de que user.id esté presente
    if (!user || !user.id) {
      console.error("User ID no encontrado");
      return;
    }

    const restaurantData = {
      administrator: user.id, 
      location: address, 
      description: description,
      food_type: foodType,
      name: name,
    };
    console.log("Datos del restaurante a guardar:", restaurantData);
    
    setLoading(true); // Activa el estado de carga

    // Usamos la función del contexto para agregar el restaurante
    addRestaurant(restaurantData);
    onRestaurantCreated(restaurantData); // Llamamos a la función del prop para actualizar el estado en UserDashboard

    setLoading(false); // Desactiva el estado de carga
    setShowForm(false); // Ocultamos el formulario

    console.log("Restaurante agregado:", restaurantData);
  };

  if (!showForm) return null;

  return (
    <form onSubmit={handleSubmit} className="add-restaurant-form">
      <div className="add-restaurant-container">
        <button type="button" className="close-button" onClick={() => setShowForm(false)}>
          &times;
        </button>

        <h2>Add restaurant</h2>

        <div className="form-group">
          <label htmlFor="name">Restaurant name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="foodType">Food type</label>
          <select
            id="foodType"
            value={foodType}
            onChange={(e) => setFoodType(e.target.value)}
            required
          >
            {foodTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="address">Location</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={handleAddressChange}
            placeholder="Buscar una dirección"
            required
          />
          <button type="button" onClick={handleSearchAddress} disabled={isSearching}>
            {isSearching ? "Searching..." : "Search location"}
          </button>
        </div>

        {/* Mensaje de error de búsqueda */}
        {searchError && <div className="error-message">{searchError}</div>}

        {/* Mapa */}
        <MapContainer
          center={[location.lat, location.lng]}
          zoom={13}
          style={{ width: "100%", height: "400px" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[location.lat, location.lng]}>
            <Popup>Location selected</Popup>
          </Marker>
        </MapContainer>

        {/* Botón para enviar el formulario */}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Creating..." : "Create restaurant"}
        </button>
      </div>
    </form>
  );
};

export default AddRestaurant;
