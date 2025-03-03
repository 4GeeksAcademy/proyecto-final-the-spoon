import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const FeedRestaurantes = () => {
  const [restaurantes, setRestaurantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoria, setCategoria] = useState("");
  const [ubicacion, setUbicacion] = useState("");

  useEffect(() => {
    fetch("https://api.ejemplo.com/restaurantes") // Reemplaza con la URL real
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
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded-lg w-full md:w-1/3"
        />
        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          className="border p-2 rounded-lg w-full md:w-1/4"
        >
          <option value="">Todas las categorías</option>
          <option value="Italiana">Italiana</option>
          <option value="Japonesa">Japonesa</option>
          <option value="Mexicana">Mexicana</option>
        </select>
        <select
          value={ubicacion}
          onChange={(e) => setUbicacion(e.target.value)}
          className="border p-2 rounded-lg w-full md:w-1/4"
        >
          <option value="">Todas las ubicaciones</option>
          <option value="Madrid">Madrid</option>
          <option value="Barcelona">Barcelona</option>
          <option value="Valencia">Valencia</option>
        </select>
      </div>

      {/* Lista de restaurantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurantesFiltrados.length > 0 ? (
          restaurantesFiltrados.map((restaurante) => (
            <div key={restaurante.id} className="bg-white shadow-lg rounded-lg p-4">
              <img
                src={restaurante.imagen}
                alt={restaurante.nombre}
                className="w-full h-40 object-cover rounded-md"
              />
              <h2 className="text-xl font-bold mt-2">{restaurante.nombre}</h2>
              <p className="text-gray-600">{restaurante.categoria}</p>
              <p className="text-gray-700">{restaurante.ubicacion}</p>
              <Link
                to={`/restaurante/${restaurante.id}`}
                className="block mt-3 text-blue-500 hover:underline"
              >
                Ver detalles
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center w-full">No hay restaurantes que coincidan con los filtros.</p>
        )}
      </div>
    </div>
  );
};

export default FeedRestaurantes;
