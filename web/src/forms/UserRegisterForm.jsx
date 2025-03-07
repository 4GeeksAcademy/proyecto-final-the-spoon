import React, { useState, useEffect } from "react";
import "../styles/UserRegisterForm.css";
import { postRegister } from "../services/api/auth";

const UserRegisterForm = ({ setShowModal, setIsLoginModal, setIsAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isRegistered, setIsRegistered] = useState(false);  // Estado para controlar el registro

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de contraseñas
        if (password !== confirmPassword) {
            alert("Passwords are not matching.");
            return;
        }

        // Enviar los datos al backend para crear un nuevo usuario
        try {

            const data = await postRegister(username, email, password)
            if (data.error) {
                setError(data.error);
                return;
            }

            // Registro exitoso
            setIsRegistered(true);
            setTimeout(() => {
                setShowModal(false); // Cierra el modal de registro
                setIsLoginModal(true); // Cambia al modal de login
                setShowModal(true); // Abre el modal de login
            }, 2000);
        } catch (error) {
            console.error("Error en el registro:", error);
            setError("Error al conectar con el servidor.");
        }
    };

    if (isRegistered) {
        return <div className="success-message">¡Registered successsfully! Redirecting to Log in...</div>;
    }

    return (
        <div className="login-form-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">User</label>
                    <input
                        type="text"
                        id="username"
                        className="input-field"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Insert your user"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        className="input-field"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Insert your email"
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
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="input-field"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your top-secret password"
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="submit-button">Register</button>
            </form>
        </div>
    );
};

export default UserRegisterForm;
