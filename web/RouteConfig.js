import { Home } from "../../pages/Home";
import { Login } from "../../pages/Login";

export const routesConfig = [
  {
    name: "Root",
    path: "/",
    component: <Home />,
  },
  {
    name: "Login",
    path: "/login",
    component: <Login />,
  },
  {
    name: "All",
    path: "*",
    component: <Home />,
  },
];