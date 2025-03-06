import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/User"; 
import { useParams } from "react-router-dom";  // Importa useParams

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
    return <p>Loading restaurant...</p>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurantData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      // Enviar los cambios al servidor (PUT)
      const response = await fetch(`/api/restaurants/${restaurantData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(restaurantData), // Aquí estás enviando el objeto con los datos actualizados
      });
  
      if (!response.ok) {
        const errorData = await response.json();  // Captura el detalle del error
        console.error("Error al actualizar el restaurante:", errorData);
      } else {
        const updatedRestaurant = await response.json();
        // Aquí actualizas el estado de los restaurantes sin redirigir a otra página
        setRestaurants((prevRestaurants) =>
          prevRestaurants.map((restaurant) =>
            restaurant.id === restaurantData.id
              ? { ...restaurant, ...restaurantData } // Actualizar los datos del restaurante
              : restaurant
          )
        );
      }  
      console.log("Cambios guardados:", restaurantData);
    } catch (error) {
      console.error("Hubo un problema al enviar la solicitud:", error);
    }
  };

  return (
    <div className="my-restaurant-container">
      <h2>My Restaurants</h2>
      {restaurants.length === 0 ? (
        <p>Not restaurant added yet</p>
      ) : (
        restaurants.map((restaurant) => (
          <div key={restaurant.id}>
            <h3>{restaurant.name}</h3>
            <p>{restaurant.description}</p>
            <button onClick={() => setRestaurantData(restaurant)}>Edit</button>
          </div>
        ))
      )}

      {restaurantData && (
        <div>
          <h3>Edit {restaurantData.name}</h3>
          <div>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={restaurantData.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Description</label>
            <textarea
              name="description"
              value={restaurantData.description}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Food type</label>
            <input
              type="text"
              name="food_type"
              value={restaurantData.food_type}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Location</label>
            <input
              type="text"
              name="location"
              value={restaurantData.location}
              onChange={handleInputChange}
            />
          </div>
          <button onClick={handleSaveChanges}>Save changes</button>
        </div>
      )}
    </div>
  );
};

export default MyRestaurant;
