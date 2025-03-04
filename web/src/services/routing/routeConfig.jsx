import UserLoginForm from "../../forms/UserLoginForm";
import UserRegisterForm from "../../forms/UserRegisterForm";
import FeedRestaurantes from "../../components/Feedrestaurantes";
import RestauranteDetalle from "../../pages/RestauranteDetalle";

import ReservationForm from "../../forms/ReservationForm";
import ReviewForm from "../../forms/ReviewForm";
import Datos from "../../pages/Datos";
import Favoritos from "../../pages/Favoritos";
import Reservas from "../../pages/Reservas";
import Reviews from "../../pages/Reviews";
import UserDashboard from "../../pages/UserDashboard";
import AddRestaurant from "../../forms/AddRestaurant";

export const publicRoutesConfig = [
  {
    name: "Root",
    path: "/",
    component: <FeedRestaurantes />,
  },
  {
    name: "Login",
    path: "/login",
    component: <UserLoginForm />,
  },
  {
    name: "Register",
    path: "/register",
    component: <UserRegisterForm />,
  },
  {
    name: "Detalle",
    path: "/restaurante/:id",
    component: <RestauranteDetalle />,
  }
];
export const guardedRoutesConfig = [
  {
    name: "ReservasForm",
    path: "/reservations",
    component: <ReservationForm />,
  },
  {
    name: "ReviewForm",
    path: "/reviews",
    component: <ReviewForm />,
  },
  {
    name: "Datos",
    path: "/users/:id/datos",  // Usa :id en lugar de `${user.id}`
    component: <Datos />,
  },
  {
    name: "Favoritos",
    path: "/users/:id/favorites",  // Usa :id en lugar de `${user.id}`
    component: <Favoritos />,
  },
  {
    name: "Reviews",
    path: "/users/:id/reviews",  // Usa :id en lugar de `${user.id}`
    component: <Reviews />,
  },
  {
    name: "Reservas",
    path: "/users/:id/reservations",  // Usa :id en lugar de `${user.id}`
    component: <Reservas />,
  },
  {
    name: "Dashboard",
    path: "/users/:id/*",  // Usa :id en lugar de `${user.id}`
    component: <UserDashboard />,
  },
  {
    name: "AddRestaurant",
    path: "/users/:id/restaurant",  // Usa :id en lugar de `${user.id}`
    component: <AddRestaurant />,
  }
];
