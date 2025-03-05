import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Feedrestaurantes.css'
import logo from '../assets/The Spoon.png'

const FeedRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  useEffect(() => {
    fetch('/api/restaurants') // Reemplaza con la URL real
      .then((res) => res.json())
      .then((data) => {
        setRestaurantes(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error al cargar restaurantes:", error));
  }, []);

  // Filtrar restaurantes según los inputs
  const restaurantesFiltrados = restaurantes.filter((restaurante) => {
    return (
      (search === "" || restaurante.nombre.toLowerCase().includes(search.toLowerCase())) &&
      (categoria === "" || restaurante.categoria === categoria) &&
      (ubicacion === "" || restaurante.ubicacion === ubicacion)
    );
  });

  return (
    <div className="container-center">
      {/* Filtros */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-full md:w-1/3"
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="border p-2 rounded-lg w-full md:w-1/4"
        >
          <option value="">Categories</option>
          <option value="Italiana">Italian</option>
          <option value="Japonesa">Chinese</option>
          <option value="Mexicana">Mexican</option>
        </select>
        <select
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          className="border p-2 rounded-lg w-full md:w-1/4"
        >
          <option value="">Locations</option>
          <option value="Madrid">Madrid</option>
          <option value="Barcelona">Barcelona</option>
          <option value="Valencia">Valencia</option>
        </select>
      </div>

      {/* Lista de restaurantes */}
      <div className="results">
        {restaurantesFiltrados.length > 0 ? (
          restaurantesFiltrados.map((restaurante) => (
            <div key={restaurante.id} className="bg-white shadow-lg rounded-lg p-4">
              <img
                src={logo}
                alt={restaurante.name}
                className="w-full h-40 object-cover rounded-md"
              />
              <h2 className="text-xl font-bold mt-2">{restaurante.name}</h2>
              <p className="text-gray-600">{restaurante.food_type}</p>
              <p className="text-gray-700">{restaurante.location}</p>
              <Link
                to={`/restaurante/${restaurante.id}`}
                className="block mt-3 text-center text-blue-500 hover:underline"
              >
                More info
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center w-full">There are no restaurants of this categorie.</p>
        )}
      </div>
    </div>
  );
};

export default FeedRestaurantes;
