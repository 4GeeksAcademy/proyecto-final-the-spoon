import { useEffect } from "react";
import { useUserContext } from "../context/User";

const Favoritos = () => {
  const { user, favorites, loadFavorites } = useUserContext();

  useEffect(() => {
    if (user.id) {
      loadFavorites(user.id);  // Cargar los favoritos cuando el usuario esté logueado
    }
  }, [user, loadFavorites]);

  // Si no hay favoritos, mostrar el mensaje "Añade favoritos"
  if (favorites.length === 0) {
    return <p>Not favourites yet. What are you waiting for?</p>;
  }

  return (
    <div>
      <h2>My Favourites</h2>
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
