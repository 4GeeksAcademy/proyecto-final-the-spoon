import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { postLogin, postLogout, postRegister } from "../services/api/auth";
import { loadFavorites } from "../services/api/favorites";
import { postRestaurant, getUserRestaurants } from "../services/api/restaurant"
import { addReservation as addReservationData, getReservations as getReservationsData, deleteReservation as deleteReservationData, updateReservation as updateReservationData } from "../services/api/reservations";
import { getReviews as getReviewsData, addReview as addReviewData, updateReview as updateReviewData, deleteReview as deleteReviewData } from "../services/api/reviews";

export const UserContext = createContext({
  user: {},
  favorites: [],
  restaurants: [],
  reservas: [],
  reviews: [],
  loading: false,
  error: null,
  login: () => { },
  logout: () => { },
  loadFavorites: () => { },
  register: () => { },
  addRestaurant: () => { },
  removeRestaurant: () => { },
  updateRestaurant: () => { },
  getUserRestaurants: () => { },
  addReservation: () => { },
  getReservations: () => { },
  deleteReservation: () => { },
  updateReservation: () => { },
  getReviews: () => { },
  addReview: () => { },
  updateReview: () => { },
  deleteReview: () => { },
});

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [restaurants, setRestaurants] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let navigate = useNavigate();

  useEffect(() => {
    if (user.id) {
      setLoading(true);
      Promise.all([
        loadFavorites(user.id),
        getReservationsData(user.id),
        getReviewsData(user.id),
        getUserRestaurants(user.id) 
      ])
      .then(([favoritesData, reservationsData, reviewsData, restaurantsData]) => {          setFavorites(favoritesData || []);
          setReservas(reservationsData || []);
          setReviews(reviewsData || []);
          setRestaurants(restaurantsData || []);
          setLoading(false);
        })
        .catch(() => {
          setError("Error al cargar los datos");
          setLoading(false);
        });
    } else {
      setLoading(false); 
    }
  }, [user]);

  const login = (email, password) => {
    setLoading(true);
    postLogin(email, password).then((data) => {
      if (data.error) {
        setLoading(false);
        setError(data.error);
        return;
      }
      setUser(data.user);
      localStorage.setItem("token", data.csrf_token);
      localStorage.setItem("userId", data.user.id);
      setLoading(false);
      navigate(`/users/${data.user.id}`);
    }).catch(() => {
      setLoading(false);
      setError("Error al iniciar sesión");
    });
  };

  const logout = () => {
    setLoading(true);
    postLogout().then(() => {
      setUser({});
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setLoading(false);
      navigate('/login');
    }).catch(() => {
      setLoading(false);
      setError("Error al cerrar sesión");
    });
  };

  const register = (username, email, password) => {
    setLoading(true);
    postRegister(username, email, password).then(() => {
      login(email, password);
    }).catch(() => {
      setLoading(false);
      setError("Error al registrarse");
    });
  };

  const addRestaurant = async (restaurantData) => {
    setLoading(true);
    try {
      const newRestaurant = await postRestaurant({
        ...restaurantData,
        administrator: user.id 
      });
      
      setRestaurants((prevRestaurants) => [...prevRestaurants, newRestaurant]);
      setLoading(false);
    } catch (error) {
      setError("Error al agregar restaurante");
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{
      user, 
      favorites,
      restaurants,
      reservas,
      reviews,
      loading,
      error,
      login,
      logout,
      loadFavorites,
      register,
      addRestaurant,
      removeRestaurant,
      updateRestaurant,
      addReservation,
      getReservations: getReservationsData,
      deleteReservation,
      updateReservation,
      getReviews: getReviewsData,
      addReview,
      updateReview,
      deleteReview
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
