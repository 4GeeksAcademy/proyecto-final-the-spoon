import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Modal, Button } from 'react-bootstrap'; 
import UserLoginForm from '../forms/UserLoginForm'; 
import UserRegisterForm from '../forms/UserRegisterForm'; 
import logo from '../assets/The Spoon.png';

function NavigateBar() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoginModal, setIsLoginModal] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleShowLogin = () => {
    setIsLoginModal(true);
    setShowModal(true);
  };

  const handleShowRegister = () => {
    setIsLoginModal(false);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false); 

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="/">
            <img className="logo" src={logo} alt="logo" />
            The Spoon
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {isAuthenticated ? (
                <>
                  <Nav.Link href="/users/${user.id}">Dashboard</Nav.Link>
                  <Nav.Link href="/private" onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link href="/login" onClick={handleShowLogin}>Login</Nav.Link>
                  <Nav.Link href="/register" onClick={handleShowRegister}>Register</Nav.Link>
                  </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Modal para el Login */}
      <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
          <Modal.Title>{isLoginModal ? 'Iniciar sesión' : 'Registro'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoginModal ? (
            <UserLoginForm /> // Formulario de login
          ) : (
            <UserRegisterForm /> // Formulario de registro
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NavigateBar;
