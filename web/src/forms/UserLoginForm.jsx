import React, { useState } from "react";
import "../styles/UserLoginForm.css"; 

const UserLoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Formulario enviado');
        console.log('Usuario:', username);
        console.log('Contraseña:', password);

        // reemplazar esto con un token del backend
        localStorage.setItem("token", "fake-jwt-token");

        setUsername('');
        setPassword('');

        window.location.href = "/"; // Redirige a la página de inicio
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
                        onChange={handleUsernameChange}
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
                        onChange={handlePasswordChange}
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
