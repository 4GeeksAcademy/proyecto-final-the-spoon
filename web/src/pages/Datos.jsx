import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Datos = () => {
    const {id} = useParams();
    const [user, setUser] = useState();
    const [loading, setLoading]= useState(true);

    useEffect(()=>{
        fetch(`/users/${id}`)
        .then ((response)=> response.json())
        .then ((data) =>{
            setUser(data);
            setLoading(false);
        })
        .catch((error)=> {
            console.error("Error al obtener el usuario:", error);
            setLoading(false);
        });
    },[id]);

    if (loading) return <p>Cargando datos...</p>
    if(!user) return <p>Error: usuario no encontrado</p> 

    return (
        <div>
            <h3>Datos Personales</h3>
            <p><strong>Nombre:</strong>{username}</p>
            <p><strong>Email:</strong>{user.email}</p>
            <p><strong>Password:</strong>{user.password}</p>
        </div>
    )
}

  export default Datos;
  