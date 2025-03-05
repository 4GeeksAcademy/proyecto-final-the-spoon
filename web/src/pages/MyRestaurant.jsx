import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/User"; 
import { useParams } from "react-router";

const MyRestaurant = () => {
  const { id } = useParams(); // Obtienes el id de la URL (restaurante específico)
  const { user } = useContext(UserContext); // Accedes al usuario actual desde el contexto
  const [restaurants, setRestaurants] = useState([]); // Lista de restaurantes
  const [restaurantData, setRestaurantData] = useState(null); // Datos del restaurante que se está editando

  useEffect(() => {
    // Función que obtiene los restaurantes creados por el usuario
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`/api/users/${user.id}/restaurants`);

        // Verifica si la respuesta es exitosa (status 200)
        if (!response.ok) {
          throw new Error("No se pudieron obtener los restaurantes.");
        }

        const data = await response.json(); // Convierte la respuesta a JSON
        setRestaurants(data); // Guarda los restaurantes en el estado
      } catch (error) {
        console.error("Error al obtener restaurantes:", error);
      }
    };

    if (user?.id) {
      fetchRestaurants(); // Llamar a la función para obtener los restaurantes
    }
  }, [user.id]); // Ejecutar solo cuando el id del usuario cambie

  // Filtrar el restaurante específico para su edición
  useEffect(() => {
    const restaurantId = parseInt(id, 10);
    const restaurant = restaurants.find((r) => r.id === restaurantId);

    if (restaurant) {
      setRestaurantData({
        id: restaurant.id,
        name: restaurant.name || "",
        description: restaurant.description || "",
        food_type: restaurant.food_type || "",
        location: restaurant.location || "",
      });
    }
  }, [restaurants, id]);

  if (!restaurantData) {
    return <p>Cargando restaurante...</p>;
  }

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
    }
  };

  return (
    <div className="my-restaurant-container">
      <h2>Mis Restaurantes</h2>
      {restaurants.length === 0 ? (
        <p>No has creado ningún restaurante aún.</p>
      ) : (
        restaurants.map((restaurant) => (
          <div key={restaurant.id}>
            <h3>{restaurant.name}</h3>
            <p>{restaurant.description}</p>
            <button onClick={() => setRestaurantData(restaurant)}>Editar</button>
          </div>
        ))
      )}

      {restaurantData && (
        <div>
          <h3>Editar {restaurantData.name}</h3>
          <div>
            <label>Nombre</label>
            <input
              type="text"
              name="name"
              value={restaurantData.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Descripción</label>
            <textarea
              name="description"
              value={restaurantData.description}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Tipo de comida</label>
            <input
              type="text"
              name="food_type"
              value={restaurantData.food_type}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Ubicación</label>
            <input
              type="text"
              name="location"
              value={restaurantData.location}
              onChange={handleInputChange}
            />
          </div>
          <button onClick={handleSaveChanges}>Guardar Cambios</button>
        </div>
      )}
    </div>
  );
};

export default MyRestaurant;
