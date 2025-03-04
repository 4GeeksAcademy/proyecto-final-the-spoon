import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const RestauranteDetalle = () => {
  const { id } = useParams(); // Obtiene el ID del restaurante desde la URL
  const [restaurante, setRestaurante] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(id)

  useEffect(() => {
    fetch(`/api/restaurants/${id}`) // Reemplaza con la URL real
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setRestaurante(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error al cargar detalles:", error));
  }, [id]);

  if (loading) return <p className="text-center mt-10">Cargando detalles...</p>;
  if (!restaurante) return <p className="text-center mt-10">Restaurante no encontrado</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* <img
        src={restaurante.imagen}
        alt={restaurante.nombre}
        className="w-full h-64 object-cover rounded-lg"
      /> */}
      {/* <h1 className="text-3xl font-bold mt-4">{restaurante.name}</h1> */}
      <p className="text-gray-600 mt-2">{restaurante.food_type}</p>
      <p className="text-gray-700 mt-2">{restaurante.location}</p>
      <p className="mt-4">{restaurante.description}</p>
      <Link to="/" className="block mt-4 text-blue-500 hover:underline">
        ← Volver al inicio
      </Link>
    </div>
  );
};

export default RestauranteDetalle;
