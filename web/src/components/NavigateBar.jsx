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
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    
    setIsAuthenticated(!!token);
    setUserId(storedUserId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    setUserId(null);
    navigate('/');
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
                  <Nav.Link href={`/users/${userId}`}>Dashboard</Nav.Link>
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
            <UserLoginForm 
              setIsAuthenticated={setIsAuthenticated} 
              setShowModal={setShowModal} 
            /> 
          ) : (
            <UserRegisterForm /> 
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default NavigateBar;
