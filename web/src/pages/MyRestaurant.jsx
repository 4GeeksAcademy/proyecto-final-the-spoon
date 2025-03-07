import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/User";
import { useParams } from "react-router-dom";
import { baseUrl } from "../services/api/fetch";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";

const MyRestaurant = () => {
  const { id } = useParams(); // Restaurante específico
  const { user } = useContext(UserContext); // Usuario actual
  const [restaurants, setRestaurants] = useState([]);
  const [restaurantData, setRestaurantData] = useState(null);

  useEffect(() => {
    // Obtener los restaurantes creados por el usuario
    const fetchRestaurants = async () => {
      try {
        const response = await fetch(`/api/users/${user.id}/restaurants`);
        if (!response.ok) {
          throw new Error("No se pudieron obtener los restaurantes.");
        }
        const data = await response.json();
        setRestaurants(data);
      } catch (error) {
        console.error("Error al obtener restaurantes:", error);
      }
    };

    if (user?.id) {
      fetchRestaurants();
    }
  }, [user]);

  // Cuando se haga clic en "Edit", se establece restaurantData con ese restaurante
  const handleEditClick = (restaurant) => {
    setRestaurantData({
      id: restaurant.id,
      name: restaurant.name || "",
      description: restaurant.description || "",
      food_type: restaurant.food_type || "",
      location: restaurant.location || "",
    });
  };

  // Manejar cambios en el formulario de edición
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurantData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Función para enviar los cambios
  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`${baseUrl}restaurants/${restaurantData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(restaurantData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al actualizar el restaurante:", errorData);
      } else {
        const updatedRestaurant = await response.json();
        // Actualizamos la lista de restaurantes en el estado local
        setRestaurants((prevRestaurants) =>
          prevRestaurants.map((restaurant) =>
            restaurant.id === restaurantData.id
              ? { ...restaurant, ...restaurantData }
              : restaurant
          )
        );
        // Cerramos el formulario de edición
        setRestaurantData(null);
      }
      console.log("Cambios guardados:", restaurantData);
    } catch (error) {
      console.error("Hubo un problema al enviar la solicitud:", error);
    }
  };

  return (
    <Container className="my-restaurant-container">
      <h2>My Restaurants</h2>
      {restaurants.length === 0 ? (
        <p>No restaurants added yet.</p>
      ) : (
        <Row>
          {restaurants.map((restaurant) => (
            <Col key={restaurant.id} md={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{restaurant.name}</Card.Title>
                  <Card.Text>{restaurant.description}</Card.Text>
                  <Button
                    variant="link"
                    onClick={() => handleEditClick(restaurant)}
                  >
                    Editar
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {restaurantData && (
        <Card className="mt-4">
          <Card.Body>
            <Card.Title>Edit {restaurantData.name}</Card.Title>
            <Form>
              <Form.Group controlId="formName" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={restaurantData.name}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formDescription" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={restaurantData.description}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formFoodType" className="mb-3">
                <Form.Label>Food type</Form.Label>
                <Form.Control
                  type="text"
                  name="food_type"
                  value={restaurantData.food_type}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="formLocation" className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  value={restaurantData.location}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleSaveChanges}>
                Save changes
              </Button>{" "}
              <Button variant="secondary" onClick={() => setRestaurantData(null)}>
                Cancel
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default MyRestaurant;
