import React, { useState, useContext } from "react";
import { UserContext } from "../context/User";
import { postLogin } from "../services/api/auth";

const UserLoginForm = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await postLogin(email, password);
      if (data.error) {
        setError(data.error);
        return;
      }
      // Llamamos a login sin redirigir (redirect = false)
      await login(email, password, false);
      if (onClose) {
        onClose();
      }
    } catch (err) {
      console.error("Error en login:", err);
      setError("Error al conectar con el servidor.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Insert your ingenous email"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Insert your top-secret password"
          required
        />
      </div>
      {error && <p className="error-message">{error}</p>}
      <button type="submit" className="submit-button">Log in</button>
    </form>
  );
};

export default UserLoginForm;
