import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/User"; 
import { useParams, useNavigate } from "react-router-dom";  // Importa useNavigate

const MyRestaurant = () => {
  const { id } = useParams(); // Obtienes el id de la URL (restaurante específico)
  const { user } = useContext(UserContext); // Accedes al usuario actual desde el contexto
  const [restaurants, setRestaurants] = useState([]); // Lista de restaurantes
  const [restaurantData, setRestaurantData] = useState(null); // Datos del restaurante que se está editando
  const [isEditing, setIsEditing] = useState(false);  // Estado para controlar si estamos editando
  const navigate = useNavigate();  // Hook de navegación

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
        return; // Si hay un error, no continuar
      } else {
        const updatedRestaurant = await response.json(); // Recibimos los datos actualizados del servidor
  
        // Actualizar el estado de los restaurantes para reflejar los cambios
        setRestaurants((prevRestaurants) =>
          prevRestaurants.map((restaurant) =>
            restaurant.id === updatedRestaurant.id
              ? { ...restaurant, ...updatedRestaurant } // Actualizar el restaurante con los nuevos datos
              : restaurant
          )
        );
  
        // Mostrar un mensaje de éxito o redirigir si es necesario
        console.log("Restaurante actualizado correctamente:", updatedRestaurant);
        
        // Redirigir al usuario a la página del restaurante editado
        navigate(`/restaurants/${updatedRestaurant.id}`);
      }
    } catch (error) {
      console.error("Hubo un problema al enviar la solicitud:", error);
    }
  };
  
  const handleEditClick = (restaurant) => {
    // Establecer los datos del restaurante y mostrar el banner de edición
    setRestaurantData(restaurant);
    setIsEditing(true); // Activar la edición
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
            <button onClick={() => handleEditClick(restaurant)}>Editar</button>
          </div>
        ))
      )}

      {isEditing && restaurantData && (
        <div className="edit-banner">
          <h3>Editar {restaurantData.name}</h3>
          <button onClick={() => setIsEditing(false)}>Cerrar Edición</button>
          <button onClick={handleSaveChanges}>Guardar Cambios</button>
        </div>
      )}

      {isEditing && (
        <div>
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
        </div>
      )}
    </div>
  );
};

export default MyRestaurant;
