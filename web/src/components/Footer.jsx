import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import '@fortawesome/fontawesome-free/css/all.min.css';


const Footer = ()=> {
  return (
    <Container fluid>
      <div className="copyright">&copy; 2025 The Spoon. All rights reserved.</div>
      <div className="socials">
        <ul>
          <li><a href="https://www.facebook.com"><i className="fab fa-facebook-f"></i></a></li>
          <li><a href="https://www.instagram.com"><i className="fab fa-instagram"></i></a></li>
          <li><a href="https://wa.me/+34618227935?text=Diegooo aceptate un pull request!"><i className="fab fa-whatsapp"></i></a></li>
        </ul>
      </div>
    </Container>
  )
}

export default Footer;