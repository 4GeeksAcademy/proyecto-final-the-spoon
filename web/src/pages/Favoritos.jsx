import useParams from 'react-router-dom';
import { useState, useEffect } from 'react';

function Favoritos () {
    const {id} = useParams();
    const [favorites, setFavorites] = useState();
    const [loading, setLoading] = useState(true);

    useEffect (()=>{
        fetch (`/favoritos/${id}`)
        .then((response)=> response.json())
        .then ((data)=>{
            setFavorites(data);
            setLoading(false);
        })
        .catch((error)=> {
            console.error("Error al obtener favoritos:", error);
            setLoading(false);
        });
    },[id]);
    
    if (loading) return <p>Cargando usuario...</p>
    if(!favorites.length) return <p>No tienes favoritos.</p> 

return (
    <div>
        <h2>Favoritos</h2>
        {favorites.length === 0 ? (
            <p>No hay favoritos aún.</p>
        ) : (
            <ul>
                {favorites.map((fav) => (
                    <li key={fav.id}>
                        <img src="imagen restaurante favorito" alt="" />
                        <p>{fav.restaurant}</p>
                    </li>
                ))}
            </ul>
        )}
    </div>
)}
export default Favoritos;