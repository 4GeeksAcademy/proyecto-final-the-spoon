import React, { useState } from 'react';
import { Navbar, Nav, Container, Modal } from 'react-bootstrap'; 
import UserLoginForm from '../forms/UserLoginForm'; 
import UserRegisterForm from '../forms/UserRegisterForm'; 
import { useContext } from 'react';
import { UserContext } from '../context/User';  // Importa el contexto de usuario
import { Link } from 'react-router-dom';  // Importa Link de react-router-dom

const NavigateBar = () => {
  const [showModal, setShowModal] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(true);

  const { user, logout } = useContext(UserContext);  // Accede al contexto de usuario
  const isAuthenticated = !!user.id;  // Verifica si hay un usuario logueado (por la existencia de user.id)

  const handleLogout = () => {
    logout();  // Llama a la función de logout del contexto
    setShowModal(false); // Cierra el modal después de hacer logout
  };

  const handleShowLogin = () => {
    setIsLoginModal(true);
    setShowModal(true);
  };

  const handleShowRegister = () => {
    setIsLoginModal(false);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false); // Cierra el modal

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/"> {/* Cambié href por Link */}
            The Spoon
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {isAuthenticated ? (
                <>
                  <Nav.Link as={Link} to={`/users/${user.id}`}>Dashboard</Nav.Link>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link onClick={handleShowLogin}>Login</Nav.Link>
                  <Nav.Link onClick={handleShowRegister}>Register</Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{isLoginModal ? 'Iniciar sesión' : 'Registro'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoginModal ? (
            <UserLoginForm setShowModal={setShowModal} />
          ) : (
            <UserRegisterForm setShowModal={setShowModal} setIsLoginModal={setIsLoginModal} />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NavigateBar;
