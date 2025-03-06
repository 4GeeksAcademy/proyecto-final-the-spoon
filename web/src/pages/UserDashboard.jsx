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
  const { user, favorites, reservas, reviews, loadFavorites, getReservations, getReviews, loading, error, restaurants } = useContext(UserContext);  
  const [restaurant, setRestaurant] = useState(null); 
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user.id) {
      setLoadingData(true);
      Promise.all([
        loadFavorites(user.id),
        getReservations(user.id),
        getReviews(user.id)
      ])
        .then(() => setLoadingData(false))
        .catch(() => setLoadingData(false));
    } else {
      setLoadingData(false);
    }
  }, [user, loadFavorites, getReservations, getReviews]);

  if (loadingData || loading) return <p className="loading-message">Loading...</p>;
  if (!user.id) return <p className="error-message">Error: user not found</p>;

  const handleRestaurantCreated = (newRestaurant) => {
    setRestaurant(newRestaurant); // Guardamos el restaurante recién creado
    navigate(`/users/${user.id}/my-restaurant`); // Redirige a la página de "Mi Restaurante"
  };

  const routes = [
    { path: "dashboard-data", name: "Personal Data", component: <Datos /> },
    { path: "favoritos", name: "Favourites", component: <Favoritos favorites={favorites} /> },
    { path: "reservas", name: "Reservations", component: <Reservas reservas={reservas} /> },
    { path: "reviews", name: "Reviews", component: <Reviews reviews={reviews} /> },
    { path: "restaurants", name: "Add a New Restaurant", component: <AddRestaurant onRestaurantCreated={handleRestaurantCreated} /> },
    { path: "my-restaurant", name: "My Restaurant", component: <MyRestaurant restaurant={restaurant || restaurants[0]} /> } // Aseguramos que restaurant tenga algo
  ];

  return (
    <div className="user-dashboard-container">
      <h3>Hello, {user.username}</h3>
      <ul className="nav-links">
        {routes.map((route) => (
          <li key={route.path}>
            <Link to={`/users/${user.id}/${route.path}`} className="route-link">{route.name}</Link>
          </li>
        ))}
      </ul>

      {restaurant && (
        <div className="my-restaurant">
          <h4>My Restaurant: {restaurant.name}</h4>
          <Link to={`/users/${user.id}/my-restaurant`} className="route-link">See Restaurant</Link>
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