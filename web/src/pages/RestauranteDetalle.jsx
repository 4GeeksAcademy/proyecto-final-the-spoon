import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import theSpoonImage from '../assets/The Spoon.png';  // Importación de la imagen

const RestauranteDetalle = () => {
  const { id } = useParams();
  const [restaurante, setRestaurante] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`/api/restaurants/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setRestaurante(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al cargar detalles:", error);
        setLoading(false);
      });
  }, [id]);
  if (loading)
    return <p className="text-center mt-5 fs-4 text-primary">Loading details...</p>;
  if (!restaurante)
    return <p className="text-center mt-5 fs-4 text-danger">Restaurant not found</p>;
  // Si no hay imagen del restaurante, usar la imagen de 'The Spoon'
  const imageSrc = restaurante.imagen ? restaurante.imagen : theSpoonImage;
  return (
    <div className="container">
      <div className="card shadow-lg">
        <img
          src={imageSrc}
          alt={restaurante.name}
          className="card-img-top"
          style={{ height: "100px", width: "100px" }}
        />
        <div className="card-body">
          <h1 className="card-title text-center text-primary">{restaurante.name}</h1>
          <h5 className="text-muted text-center">{restaurante.food_type}</h5>
          <p className="text-center text-secondary"> {restaurante.location}
          </p>
          <p className="card-text text-center mt-3">{restaurante.description}</p>
          <div className="text-center mt-4">
            <Link to="/" className="btn btn-outline-primary">
              ← Return
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RestauranteDetalle;