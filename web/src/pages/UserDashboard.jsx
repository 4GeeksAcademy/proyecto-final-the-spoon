import { useParams, useNavigate, Link, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Datos from "./Datos";
import Favoritos from "./Favoritos";
import Reservas from "./Reservas";
import Reviews from "./Reviews";
import AddRestaurant from "../forms/AddRestaurant";
import MyRestaurant from "./MyRestaurant";
import'../styles/UserDashboard.css';
import { FaCamera } from 'react-icons/fa'; // Para el icono de la cámara

function UserDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null); // Aquí se guardará el restaurante creado
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let userId = id || localStorage.getItem("userId"); // Usa el ID de la URL o localStorage

    if (!userId) {
      navigate("/"); // Si no hay ID, redirige al inicio
      return;
    }

    fetch(`https://fluffy-space-telegram-v6qp6pqgq4pgc69wx-5000.app.github.dev/users/${userId}`)
  .then((res) => {
    if (!res.ok) {
      throw new Error('Error al obtener usuario');
    }
    return res.json();
  })
  .then((data) => {
    if (data && data.id) {
      setUser(data); // Actualiza el estado solo si los datos son válidos
    } else {
      console.error("Usuario no encontrado");
    }
    setLoading(false);
  })
  .catch((error) => {
    console.error("Error al obtener usuario:", error);
    setLoading(false);
  });
  }, [id, navigate]);

  // Función para actualizar el restaurante después de añadir uno
  const handleRestaurantCreated = (newRestaurant) => {
    setRestaurant(newRestaurant);
  };

  if (loading) return <p className="loading-message">Cargando usuario...</p>;
  if (!user) return <p className="error-message">Error: usuario no encontrado</p>;

  const routes = [
      { path: "datos", name: "Datos Personales", component: <Datos /> },
      { path: "favoritos", name: "Favoritos", component: <Favoritos /> },
      { path: "reservas", name: "Reservas", component: <Reservas /> },
      { path: "reviews", name: "Reviews", component: <Reviews /> },
      { path: "restaurants", name: "Añade tu Restaurante", component: <AddRestaurant onRestaurantCreated={handleRestaurantCreated} /> },
      { path: "my-restaurant", name: "Mi Restaurante", component: <MyRestaurant /> } // Ruta agregada
    ];

  return (
    <div className="user-dashboard-container">
      <h3>Hola, {user.username}</h3>
      <ul className="nav-links">
        {routes.map((route) => (
          <li key={route.path}>
            <Link to={`/users/${user.id}/${route.path}`} className="route-link">{route.name}</Link>
          </li>
        ))}
      </ul>

      {/* Enlace a Mi Restaurante si ya ha creado uno */}
      {restaurant && (
        <div className="my-restaurant">
          <h4>Mi Restaurante: {restaurant.name}</h4>
          <Link to={`/users/${user.id}/my-restaurant`} className="route-link">Ver Restaurante</Link>
        </div>
      )}

      <div className="add-photos">
        {/* Icono para subir fotos */}
        <FaCamera size={30} onClick={() => alert("Añadir fotos al restaurante")} />
      </div>

      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
      </Routes>
    </div>
  );
}

export default UserDashboard;
