import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/User"; 
import { useParams } from "react-router";

const MyRestaurant = () => {
  const { id } = useParams(); // ID desde los parámetros de la URL
  const { restaurants, user } = useContext(UserContext);
  const [restaurantData, setRestaurantData] = useState(null);
  const [isRestaurantOwner, setIsRestaurantOwner] = useState(false);

  // Convertimos el ID de la URL a número
  const restaurantId = parseInt(id, 10);
  console.log("ID convertido a número:", restaurantId);

  // Filtramos los restaurantes donde el 'user.id' coincide con 'administrator'
  const myRestaurants = restaurants.filter((restaurant) => restaurant.administrator === user.id);
  console.log("Restaurantes encontrados para el usuario:", myRestaurants);

  // Buscamos el restaurante que coincida con el ID proporcionado en la URL
  const restaurant = myRestaurants.find((r) => r.id === restaurantId);

  useEffect(() => {
    if (restaurant) {
      console.log("Restaurante encontrado:", restaurant);
      setRestaurantData({
        id: restaurant.id,
        name: restaurant.name,
        description: restaurant.description,
        food_type: restaurant.food_type,
        location: restaurant.location,
      });
      setIsRestaurantOwner(restaurant.administrator === user.id);
    } else {
      console.log("No se encontró el restaurante con ese id");
    }
  }, [myRestaurants, restaurantId, restaurant]);

  if (!restaurant) return <p>No se encontró el restaurante.</p>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurantData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = () => {
    if (restaurantData) {
      console.log("Cambios guardados:", restaurantData);
      // Aquí llamarías a la función para guardar cambios en el contexto
    }
  };

  return (
    <div className="my-restaurant-container">
      <h2>Mis Restaurantes</h2>
      <div key={restaurantData.id}>
        <h3>{restaurantData.name}</h3>

        <div>
          <label>Nombre</label>
          <input
            type="text"
            name="name"
            value={restaurantData.name}
            onChange={handleInputChange}
            disabled={!isRestaurantOwner}
          />
        </div>

        <div>
          <label>Descripción</label>
          <textarea
            name="description"
            value={restaurantData.description}
            onChange={handleInputChange}
            disabled={!isRestaurantOwner}
          />
        </div>

        <div>
          <label>Tipo de comida</label>
          <input
            type="text"
            name="food_type"
            value={restaurantData.food_type}
            onChange={handleInputChange}
            disabled={!isRestaurantOwner}
          />
        </div>

        <div>
          <label>Ubicación</label>
          <input
            type="text"
            name="location"
            value={restaurantData.location}
            onChange={handleInputChange}
            disabled={!isRestaurantOwner}
          />
        </div>

        {isRestaurantOwner && (
          <button onClick={handleSaveChanges}>Guardar Cambios</button>
        )}
      </div>
    </div>
  );
};

export default MyRestaurant;
