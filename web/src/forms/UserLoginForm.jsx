import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { postLogin } from "../services/api/auth";

const UserLoginForm = ({ setIsAuthenticated, setShowModal }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // const response = await fetch("https://fluffy-space-telegram-v6qp6pqgq4pgc69wx-5000.app.github.dev/login", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify({ username, password })
            // });

            // const data = await response.json();

            // if (response.ok) {
            //     localStorage.setItem("token", data.token);
            //     localStorage.setItem("userId", data.id);

            //     setIsAuthenticated(true);
            //     setShowModal(false);
            //     navigate(`/users/${data.id}`);
            // } else {
            //     alert("Credenciales incorrectas");
            // }
            const data = await postLogin(email, password);

            if (data.error) {
                setError(data.error);
                return;
            }

            // Guardar token e ID del usuario
            // console.log("Datos recibidos en login:", data);
            localStorage.setItem("token", data.csrf_token);
            localStorage.setItem("userId", data.user.id);

            setIsAuthenticated(true);
            setShowModal(false);
            navigate(`/users/${data.user.id}`);
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
