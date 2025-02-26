import React, { useState } from "react";
import "../styles/UserRegisterForm.css"; 

const UserRegisterForm = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState(''); // Nuevo campo de correo electrónico
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState(''); // Nuevo campo para confirmar la contraseña

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validación de contraseñas
        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        console.log('Formulario de registro enviado');
        console.log('Usuario:', username);
        console.log('Correo:', email);
        console.log('Contraseña:', password);

        // Aquí podrías enviar los datos al backend para el registro
        // Para simular el registro, vamos a guardar los datos en localStorage
        localStorage.setItem("user", JSON.stringify({ username, email, password }));

        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        window.location.href = "/"; // Redirige a la página de inicio después de registrarse
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
                    <label htmlFor="email">Correo electrónico</label>
                    <input
                        type="email"
                        id="email"
                        className="input-field"
                        value={email}
                        onChange={handleEmailChange}
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
                        onChange={handlePasswordChange}
                        placeholder="Ingresa tu contraseña"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirmar contraseña</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="input-field"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        placeholder="Confirma tu contraseña"
                        required
                    />
                </div>
                <button type="submit" className="submit-button">Registrarse</button>
            </form>
        </div>
    );
};

export default UserRegisterForm;
