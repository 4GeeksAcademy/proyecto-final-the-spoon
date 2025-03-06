import React, { useState, useEffect } from "react";
import Container from 'react-bootstrap/Container';
import '@fortawesome/fontawesome-free/css/all.min.css';


const Footer = ()=> {
  return (
    <Container fluid>
      <div className="copyright">&copy; 2025 The Spoon. All rights reserved.</div>
      <div className="socials">
        <ul>
          <li><a href="https://www.facebook.com/thefork.es" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i></a></li>
          <li><a href="https://www.instagram.com/thefork_es" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a></li>
          <li><a href="https://x.com/thefork_es" target="_blank" rel="noopener noreferrer"><i className="fab fa-x-twitter"></i></a></li>
        </ul>
      </div>
    </Container>
  )
}

export default Footer;