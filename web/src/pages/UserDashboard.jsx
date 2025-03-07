import { useNavigate, Link, Route, Routes } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import Datos from "./Datos";
import Reservas from "./Reservas";
import AddRestaurant from "../forms/AddRestaurant";
import MyRestaurant from "./MyRestaurant";
import '../styles/UserDashboard.css';
import { UserContext } from "../context/User";

function UserDashboard() {
  const navigate = useNavigate();
  const {
    user,
    reservas,
    getReservations,
    loading,
    error,
    restaurants,
  } = useContext(UserContext);  
  const [restaurant, setRestaurant] = useState(null); 
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user.id) {
      setLoadingData(true);
      Promise.all([
        getReservations(user.id),
      ])
        .then(() => setLoadingData(false))
        .catch(() => setLoadingData(false));
    } else {
      setLoadingData(false);
    }
  }, [user, getReservations]);

  if (loadingData || loading) return <p className="loading-message">Loading...</p>;
  if (!user.id) return <p className="error-message">Error: user not found</p>;

  const handleRestaurantCreated = (newRestaurant) => {
    setRestaurant(newRestaurant); // Guardamos el restaurante recién creado
    navigate(`/users/${user.id}/my-restaurant`); // Redirige a "My Restaurant"
  };

  const rutas = [
    { path: "dashboard-data", name: "Personal Data", component: <Datos /> },
    { path: "reservas", name: "Reservations", component: <Reservas reservas={reservas || []} /> },
    { path: "restaurants", name: "Add a New Restaurant", component: <AddRestaurant onRestaurantCreated={handleRestaurantCreated} /> },
    { path: "my-restaurant", name: "My Restaurant", component: <MyRestaurant restaurant={restaurant || restaurants[0]} /> }
  ];

  return (
    <div className="user-dashboard-container">
      <h3>Hello, {user.username}</h3>
      <ul className="nav-links">
        {rutas.map((route) => (
          <li key={route.path}>
            <Link to={`/users/${user.id}/${route.path}`} className="route-link">
              {route.name}
            </Link>
          </li>
        ))}
      </ul>

      <Routes>
        {rutas.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
      </Routes>
    </div>
  );
}

export default UserDashboard;
