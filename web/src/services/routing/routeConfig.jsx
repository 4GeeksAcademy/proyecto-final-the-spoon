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
    path: "/users/${user.id}/datos",
    component: <Datos />,
  },
  {
    name: "Favoritos",
    path: "/users/${user.id}/favorites",
    component: <Favoritos />,
  },
  {
    name: "Reviews",
    path: "/users/${user.id}/reviews",
    component: <Reviews />,
  },
  {
    name: "Reservas",
    path: "/users/${user.id}/reservations",
    component: <Reservas />,
  },
  {
    name: "Dashboard",
    path: "/users/${user.id}",
    component: <UserDashboard />,
  }
];