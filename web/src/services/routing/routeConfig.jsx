import UserLoginForm from "../../forms/UserLoginForm";
import UserRegisterForm from "../../forms/UserRegisterForm";
import FeedRestaurantes from "../../components/Feedrestaurantes";
import RestauranteDetalle from "../../pages/RestauranteDetalle";

import ReservationForm from "../../forms/ReservationForm";
import ReviewForm from "../../forms/ReviewForm";
import Datos from "../../pages/Datos";
import Reservas from "../../pages/Reservas";
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
    path: "/dasboard-data",  // Usa :id en lugar de `${user.id}`
    component: <Datos />,
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
