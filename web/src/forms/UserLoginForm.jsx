import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserLoginForm = ({ setIsAuthenticated, setShowModal }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://fluffy-space-telegram-v6qp6pqgq4pgc69wx-5000.app.github.dev/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        // Guardamos el token y el ID del usuario en el localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.id);

        // Actualizamos el estado de autenticación
        setIsAuthenticated(true);

        // Cerramos el modal
        setShowModal(false);

        // Redirigimos al dashboard del usuario
        navigate(`/users/${data.id}`);
      } else {
        alert("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error en login:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">Usuario</label>
        <input
          type="text"
          id="username"
          className="input-field"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Ingresa tu usuario"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingresa tu contraseña"
          required
        />
      </div>
      <button type="submit" className="submit-button">Iniciar sesión</button>
    </form>
  );
};

export default UserLoginForm;
