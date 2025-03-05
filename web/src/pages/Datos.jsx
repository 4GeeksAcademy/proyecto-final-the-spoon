import { useUserContext } from '../context/User'; // Asegúrate de importar el hook

const Datos = () => {
  const { user, loading } = useUserContext(); // Obtienes el user desde el contexto
  
  if (loading) return <p>Cargando datos...</p>;  // Esperamos mientras carga
  if (!user) return <p>Usuario no encontrado</p>;  // Si no hay usuario, mostramos un mensaje de error

  return (
    <div>
      <h3>Datos Personales</h3>
      <p><strong>Nombre:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default Datos;
