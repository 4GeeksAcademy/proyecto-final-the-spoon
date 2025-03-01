import UserLoginForm from "./src/forms/UserLoginForm";
import UserRegisterForm from "./src/forms/UserRegisterForm";
import FeedRestaurantes from "./src/components/Feedrestaurantes";
import RestauranteDetalle from "./src/pages/RestauranteDetalle";

import ReservationForm from "./src/forms/ReservationForm";
import ReviewForm from "./src/forms/ReviewForm";
import Datos from "./src/pages/Datos";
import Favoritos from "./src/pages/Favoritos";
import Reservas from "./src/pages/Reservas";
import Reviews from "./src/pages/Reviews";
import UserDashboard from "./src/pages/UserDashboard";

export const publicRoutesConfig = [
  {
    name: "Root",
    path: "/",
    component: FeedRestaurantes,
  },
  {
    name: "Login",
    path: "/login",
    component: UserLoginForm,
  },
  {
    name: "Register",
    path: "/register",
    component: UserRegisterForm,
  },
  {
    name: "Detalle",
    path: "/restaurante/:id",
    component: RestauranteDetalle,
  }
];

export const guardedRoutesConfig = [
  {
    name: "ReservasForm",
    path: "/reservations",
    component: ReservationForm,
  },
  {
    name: "ReviewForm",
    path: "/reviews",
    component: ReviewForm,
  },
  {
    name: "Datos",
    path: "/users/${user.id}/datos",
    component: Datos,
  },
  {
    name: "Favoritos",
    path: "/users/${user.id}/favorites",
    component: Favoritos,
  },
  {
    name: "Reviews",
    path: "/users/${user.id}/reviews",
    component: Reviews,
  },
  {
    name: "Reservas",
    path: "/users/${user.id}/reservations",
    component: Reservas,
  },
  {
    name: "Dashboard",
    path: "/users/${user.id}",
    component: UserDashboard,
  }
];