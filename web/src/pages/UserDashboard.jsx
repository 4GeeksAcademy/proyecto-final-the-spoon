import { useNavigate, Link, Route, Routes } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import Datos from "./Datos";
import Favoritos from "./Favoritos";
import Reservas from "./Reservas";
import Reviews from "./Reviews";
import AddRestaurant from "../forms/AddRestaurant";
import MyRestaurant from "./MyRestaurant";
import '../styles/UserDashboard.css';
import { UserContext } from "../context/User";  

function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);  // Usamos el contexto para obtener el usuario
  const [restaurant, setRestaurant] = useState(null); // Aquí se guardará el restaurante creado
  const [loading, setLoading] = useState(true);

  // Si no hay un usuario logueado, redirige a la página principal
  useEffect(() => {
    if (!user.id) {
      navigate("/"); // Si no hay usuario, redirige al inicio
    } else {
      setLoading(false);  // Si el usuario existe, ya no está cargando
    }
  }, [user, navigate]);

  // Función para actualizar el restaurante después de añadir uno
  const handleRestaurantCreated = (newRestaurant) => {
    setRestaurant(newRestaurant);
  };

  if (loading) return <p className="loading-message">Cargando usuario...</p>;
  if (!user.id) return <p className="error-message">Error: usuario no encontrado</p>;

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


      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
      </Routes>
    </div>
  );
}

export default UserDashboard;
