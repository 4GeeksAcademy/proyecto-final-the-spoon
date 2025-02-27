import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/UserLoginForm.css";

const UserLoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("https://tu-api.com/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token); // Guardamos el token
                localStorage.setItem("userId", data.id); // Guardamos el ID del usuario
                navigate(`/users/${data.id}`); // Redirigir al Dashboard
            } else {
                alert("Credenciales incorrectas");
            }
        } catch (error) {
            console.error("Error en login:", error);
        }
    };

    return (
        <div className="login-form-container">
            <form className="login-form" onSubmit={handleSubmit}>
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
        </div>
    );
};

export default UserLoginForm;
