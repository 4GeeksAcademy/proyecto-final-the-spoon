import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { postLogin, postLogout, postRegister } from "../services/api/auth";
import { loadFavorites } from "../services/api/favorites";
import { postRestaurant } from "../services/api/restaurant";
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
  login: () => {},
  logout: () => {},
  loadFavorites: () => {},
  register: () => {},
  addRestaurant: () => {},
  removeRestaurant: () => {},
  updateRestaurant: () => {},
  addReservation: () => {},
  getReservations: () => {},
  deleteReservation: () => {},
  updateReservation: () => {},
  getReviews: () => {},
  addReview: () => {},
  updateReview: () => {},
  deleteReview: () => {},
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
        getReviewsData(user.id)
      ])
        .then(([favoritesData, reservationsData, reviewsData]) => {
          setFavorites(favoritesData || []);
          setReservas(reservationsData || []);
          setReviews(reviewsData || []);
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
      const newRestaurant = await postRestaurant(restaurantData);
      setRestaurants((prevRestaurants) => [...prevRestaurants, newRestaurant]);
      setLoading(false);
    } catch (error) {
      setError("Error al agregar restaurante");
      setLoading(false);
    }
  };

  const removeRestaurant = (restaurantId) => {
    setRestaurants((prevRestaurants) => prevRestaurants.filter(r => r.id !== restaurantId));
  };

  const updateRestaurant = (updatedRestaurant) => {
    setRestaurants((prevRestaurants) => prevRestaurants.map(r => r.id === updatedRestaurant.id ? updatedRestaurant : r));
  };

  const addReservation = async (userId, reservationData) => {
    setLoading(true);
    try {
      const newReservation = await addReservationData(userId, reservationData);
      setReservas((prevReservas) => [...prevReservas, newReservation]);
      setLoading(false);
    } catch (error) {
      setError("Error al agregar la reserva");
      setLoading(false);
    }
  };

  const deleteReservation = async (reservationId) => {
    setLoading(true);
    try {
      await deleteReservationData(reservationId);
      setReservas((prevReservas) => prevReservas.filter(r => r.id !== reservationId));
      setLoading(false);
    } catch (error) {
      setError("Error al eliminar la reserva");
      setLoading(false);
    }
  };

  const updateReservation = async (reservationId, updatedData) => {
    setLoading(true);
    try {
      const updatedReservation = await updateReservationData(reservationId, updatedData);
      setReservas((prevReservas) => prevReservas.map(r => r.id === reservationId ? updatedReservation : r));
      setLoading(false);
    } catch (error) {
      setError("Error al actualizar la reserva");
      setLoading(false);
    }
  };

  const addReview = async (userId, reviewData) => {
    setLoading(true);
    try {
      const newReview = await addReviewData(userId, reviewData);
      setReviews((prevReviews) => [...prevReviews, newReview]);
      setLoading(false);
    } catch (error) {
      setError("Error al agregar la reseña");
      setLoading(false);
    }
  };

  const updateReview = async (reviewId, updatedData) => {
    setLoading(true);
    try {
      const updatedReview = await updateReviewData(reviewId, updatedData);
      setReviews((prevReviews) => prevReviews.map(r => r.id === reviewId ? updatedReview : r));
      setLoading(false);
    } catch (error) {
      setError("Error al actualizar la reseña");
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    setLoading(true);
    try {
      await deleteReviewData(reviewId);
      setReviews((prevReviews) => prevReviews.filter(r => r.id !== reviewId));
      setLoading(false);
    } catch (error) {
      setError("Error al eliminar la reseña");
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
