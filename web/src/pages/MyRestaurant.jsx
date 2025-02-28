import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Para acceder al ID del usuario y del restaurante

const MyRestaurant = () => {
  const { id } = useParams(); // Obtener el ID del usuario desde la URL
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    // Aquí haces una llamada al backend para obtener los datos del restaurante
    fetch(`http://localhost:5000/restaurants/${id}`)
      .then((response) => response.json())
      .then((data) => setRestaurant(data))
      .catch((error) => console.error("Error al obtener el restaurante:", error));
  }, [id]);

  if (!restaurant) return <p>Cargando restaurante...</p>;

  return (
    <div>
      <h2>Mi Restaurante: {restaurant.name}</h2>
      <p><strong>Descripción:</strong> {restaurant.description}</p>
      <p><strong>Tipo de comida:</strong> {restaurant.food_type}</p>
      <p><strong>Ubicación:</strong> Lat {restaurant.location.lat}, Lng {restaurant.location.lng}</p>
    </div>
  );
};

export default MyRestaurant;
