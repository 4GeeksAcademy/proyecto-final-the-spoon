import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/User"; 
import { postLogin } from "../services/api/auth"; // Importa el contexto de usuario

const UserLoginForm = ({ setShowModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const { login } = useContext(UserContext);  // Accede a la función login desde el contexto

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Llamar a postLogin para hacer la petición de login
      const data = await postLogin(email, password);

      if (data.error) {
        setError(data.error);  // Si hay error, lo mostramos
        return;
      }

      // Llamar a la función login del contexto para actualizar el estado
      login(email, password);

      // Redirigir a la página del usuario después de iniciar sesión
      navigate(`/users/${data.user.id}`);  // Redirige a la página del usuario

      // Cerrar el modal después de iniciar sesión
      setShowModal(false);
    } catch (error) {
      console.error("Error en login:", error);
      setError("Error al conectar con el servidor.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Correo Electrónico</label>
        <input
          type="email"
          id="email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingresa tu correo electrónico"
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
      {error && <p className="error-message">{error}</p>}
      <button type="submit" className="submit-button">Iniciar sesión</button>
    </form>
  );
};

export default UserLoginForm;
