import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/User"; 
import { useParams } from "react-router";

const MyRestaurant = () => {
  const { id } = useParams(); // Obtener el ID desde la URL
  const { restaurants, updateRestaurant } = useContext(UserContext); // Obtener restaurantes y método de actualización desde el contexto
  const [isRestaurantOwner, setIsRestaurantOwner] = useState(false);
  const [restaurantData, setRestaurantData] = useState(null); // Estado para manejar los datos del restaurante en edición

  // Buscar el restaurante por ID
  const restaurant = restaurants.find((r) => r.id === parseInt(id)); // Filtramos el restaurante por ID

  useEffect(() => {
    if (restaurant) {
      console.log("Valor de restaurant desde el contexto:", restaurant); // Ver el valor del restaurante

      if (restaurant.administrator === parseInt(id)) {
        setIsRestaurantOwner(true);
      } else {
        setIsRestaurantOwner(false);
      }

      // Establecer los datos del restaurante para mostrarlos en el formulario
      setRestaurantData({
        name: restaurant.name,
        description: restaurant.description,
        food_type: restaurant.food_type,
        location: restaurant.location,
      });
    }
  }, [restaurant, id]);

  if (!restaurant) return <p>Cargando restaurante...</p>;

  // Función para manejar cambios en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurantData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Función para guardar los cambios del restaurante
  const handleSaveChanges = () => {
    // Llamamos al método `updateRestaurant` del contexto para actualizar el restaurante
    updateRestaurant({ ...restaurant, ...restaurantData });
  };

  if (!isRestaurantOwner) {
    return <p>No tienes permiso para ver este restaurante.</p>;
  }

  return (
    <div>
      <h2>Mi Restaurante: {restaurant.name}</h2>
      {/* Si está editando, mostramos el formulario */}
      {restaurantData ? (
        <div>
          <h3>Editar Restaurante</h3>
          <form>
            <div>
              <label>Nombre:</label>
              <input 
                type="text" 
                name="name" 
                value={restaurantData.name} 
                onChange={handleInputChange} 
              />
            </div>
            <div>
              <label>Descripción:</label>
              <textarea 
                name="description" 
                value={restaurantData.description} 
                onChange={handleInputChange} 
              />
            </div>
            <div>
              <label>Tipo de comida:</label>
              <input 
                type="text" 
                name="food_type" 
                value={restaurantData.food_type} 
                onChange={handleInputChange} 
              />
            </div>
            <div>
              <label>Ubicación:</label>
              <input 
                type="text" 
                name="location" 
                value={`Lat: ${restaurantData.location.lat}, Lng: ${restaurantData.location.lng}`} 
                disabled 
              />
            </div>
            <button type="button" onClick={handleSaveChanges}>Guardar Cambios</button>
          </form>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MyRestaurant;
