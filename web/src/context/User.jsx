// src/context/User.jsx
import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router";
import { postLogin, postLogout, postRegister } from "../services/api/auth";

// Definimos el contexto
export const UserContext = createContext({
  user: {},
  login: () => {},
  logout: () => {},
  register: () => {},
  addRestaurant: () => {},
  removeRestaurant: () => {},
  updateRestaurant: () => {},
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [restaurants, setRestaurants] = useState([]); // Cambiar para manejar una lista de restaurantes
  
  let navigate = useNavigate();

  const login = (email, password) => {
    postLogin(email, password).then((data) => {
      if (data.error) {
        return;
      }

      setUser(data.user);
      localStorage.setItem("token", data.csrf_token);
      localStorage.setItem("userId", data.user.id);

      navigate(`/users/${data.user.id}`);
    });
  };

  const logout = () => {
    postLogout().then(() => {
      setUser({}); // Limpiar el estado de usuario
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
  
      navigate('/login');
    });
  };

  // Función para registrarse
  const register = (username, email, password) => {
    postRegister(username, email, password).then(() => {
      login(email, password);  
    });
  };

  // Función para agregar un restaurante
  const addRestaurant = (restaurantData) => {
    fetch(`api/users/${user.id}/restaurants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(restaurantData),
    })
      .then((response) => response.json())
      .then((newRestaurant) => {
        setRestaurants((prevRestaurants) => [...prevRestaurants, newRestaurant]);
      });
  };

  // Función para eliminar un restaurante
  const removeRestaurant = (restaurantId) => {
    setRestaurants((prevRestaurants) => prevRestaurants.filter(r => r.id !== restaurantId));
  };

  // Función para actualizar un restaurante
  const updateRestaurant = (updatedRestaurant) => {
    setRestaurants((prevRestaurants) => prevRestaurants.map(r => 
      r.id === updatedRestaurant.id ? updatedRestaurant : r
    ));
  };

  return (
    <UserContext.Provider value={{
      user, 
      restaurants,  // Usar restaurantes en lugar de restaurant
      login, 
      logout, 
      register, 
      addRestaurant, 
      removeRestaurant, 
      updateRestaurant
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext); 
};
