import { useParams, useNavigate, Link, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Datos from "./Datos";
import Favoritos from "./Favoritos";
import Reservas from "./Reservas";
import Reseñas from "./Reseñas";
import AddRestaurant from "../forms/AddRestaurant";
import'../styles/UserDashboard.css';


function UserDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let userId = id || localStorage.getItem("userId"); // Usa el ID de la URL o localStorage

    if (!userId) {
      navigate("/"); // Si no hay ID, redirige al inicio
      return;
    }

    fetch(`https://fluffy-space-telegram-v6qp6pqgq4pgc69wx-5000.app.github.dev/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.id) { // Verifica si la respuesta contiene datos válidos
          setUser(data);
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

  if (loading) return <p className="loading-message">Cargando usuario...</p>;
  if (!user) return <p className="error-message">Error: usuario no encontrado</p>;

  const routes = [
    { path: "datos", name: "Datos Personales", component: <Datos /> },
    { path: "favoritos", name: "Favoritos", component: <Favoritos /> },
    { path: "reservas", name: "Reservas", component: <Reservas /> },
    { path: "resenas", name: "Reseñas", component: <Reseñas /> },
    { path: "add-restaurant", name: "Añade tu Restaurante", component: <AddRestaurant /> }
  ];

  return (
    <div className="user-dashboard-container">
      <h3>Hola, {user.name}</h3>
      <ul className="nav-links">
        {routes.map((route) => (
          <li key={route.path}>
            <Link to={`/users/${user.id}/${route.path}`} className="route-link">{route.name}</Link>
          </li>
        ))}
      </ul>

      <Routes>
        {routes.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
      </Routes>
    </div>
  );
}

export default UserDashboard;
