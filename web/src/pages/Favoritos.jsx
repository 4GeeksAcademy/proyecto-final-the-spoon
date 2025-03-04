import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import VolverAtras from '../components/VolverAtras';

const Favoritos = () => {
  const { id } = useParams();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/favoritos/${id}`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFavorites(data);
        } else {
          console.error("Los datos obtenidos no son un array.");
          setFavorites([]);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener favoritos:", error);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Cargando favoritos...</p>;
  if (favorites.length === 0) return <p>No tienes favoritos.</p>;

  return (
    <div>
      <VolverAtras /> {/* Botón para volver atrás */}
      <h2>Favoritos</h2>
      <ul>
        {favorites.map((fav) => (
          <li key={fav.id}>
            <img src={fav.image || "imagen por defecto"} alt="Restaurante favorito" />
            <p>{fav.restaurant}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Favoritos;
