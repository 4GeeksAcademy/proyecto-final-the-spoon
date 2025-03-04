import { useUserContext } from '../context/User'; // Asegúrate de importar el hook
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Datos = () => {
    const { id } = useParams();
    const { user, loading } = useUserContext(); // Obtienes el user desde el contexto
    const [isLoading, setIsLoading] = useState(loading); 
    const [error, setError] = useState(null);

    useEffect(() => {
        if (loading === false && user === null) {
            setError("Usuario no encontrado");
        }
    }, [loading, user]);

    if (isLoading) return <p>Cargando datos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h3>Datos Personales</h3>
            <p><strong>Nombre:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Password:</strong> {user.password}</p>
        </div>
    );
};

export default Datos;
