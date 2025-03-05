// src/components/Favoritos.jsx
import { useEffect } from "react";
import { useUserContext } from "../context/User";

const Favoritos = () => {
  const { user, favorites, loadFavorites } = useUserContext();

  useEffect(() => {
    if (user.id) {
      loadFavorites(user.id);  // Cargar los favoritos cuando el usuario esté logueado
    }
  }, [user, loadFavorites]);

  if (favorites.length === 0) {
    return <p>No tienes favoritos.</p>;
  }

  return (
    <div>
      <h2>Mis Favoritos</h2>
      <ul>
        {favorites.map((favorite) => (
          <li key={favorite.id}>
            <img src={favorite.image || "imagen por defecto"} alt="Restaurante favorito" />
            <p>{favorite.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Favoritos;
