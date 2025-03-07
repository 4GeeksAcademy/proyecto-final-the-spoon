import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { postLogin, postLogout, postRegister } from "../services/api/auth";
import { postRestaurant, getUserRestaurants } from "../services/api/restaurant";
import { addReservation as addReservationData, getReservations as getReservationsData, deleteReservation as deleteReservationData, updateReservation as updateReservationData } from "../services/api/reservations";
import { getReviews as getReviewsData, addReview as addReviewData, deleteReview as deleteReviewData } from "../services/api/reviews";

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
        getReservationsData(user.id),
        getReviewsData(user.id),
        getUserRestaurants(user.id) 
      ])
        .then(([favoritesData, reservationsData, reviewsData, restaurantsData]) => {
          setFavorites(favoritesData || []);
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
      navigate("/");
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
      navigate("/");
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

  const addReviewData = (userId, reviewData) => {
    setReviews ((prevReviews)=>[...prevReviews, reviewData])
  }

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
      register,
      addRestaurant,
      removeRestaurant: (restaurantId) => setRestaurants((prevRestaurants) => prevRestaurants.filter(r => r.id !== restaurantId)),
      updateRestaurant: (updatedRestaurant) => setRestaurants((prevRestaurants) => prevRestaurants.map(r => r.id === updatedRestaurant.id ? updatedRestaurant : r)),
      getUserRestaurants,
      addReservationData,
      getReservations: getReservationsData,
      deleteReservationData,
      updateReservationData,
      getReviews: getReviewsData,
      addReviewData,
      deleteReviewData
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
