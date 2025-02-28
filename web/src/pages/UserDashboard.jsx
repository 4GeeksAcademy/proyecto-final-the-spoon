import { useEffect, useState } from "react";
import {useParams} from "react-router-dom"


function UserDashboard () {
    const {id} = useParams();
    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);

    useEffect (()=>{
        fetch (`/users/${id}`)
        .then((response)=> response.json())
        .then ((data)=>{
            setUser(data);
            setLoading(false);
        })
        .catch((error)=> {
            console.error("Error al obtener usuario:", error);
            setLoading(false);
        });
    },[id]);
    
    if (loading) return <p>Cargando usuario...</p>
    if(!user) return <p>Error: usuario no encontrado</p> 

    return (
    <div>
        <h3>Hola, {user.name}</h3>
        <ul>
            <li><Link to={`/users/${user.id}/datos`}>Datos Personales</Link></li>
            <li><Link to={`/users/${user.id}/puntos`}>Puntos</Link></li>
            <li><Link to={`/users/${user.id}/favorites`}>Favoritos</Link></li>
            <li><Link to={`/users/${user.id}/reservations`}>Reservas</Link></li>
            <li><Link to={`/users/${user.id}/reviews`}>Reseñas</Link></li>
        </ul>
    </div>
    );
}
export default UserDashboard;