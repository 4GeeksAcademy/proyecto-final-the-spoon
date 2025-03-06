import { useUserContext } from '../context/User'; // Asegúrate de importar el hook

const Datos = () => {
  const { user, loading } = useUserContext(); // Obtienes el user desde el contexto
  
  if (loading) return <p>Loading data...</p>;  // Esperamos mientras carga
  if (!user) return <p>User not found</p>;  // Si no hay usuario, mostramos un mensaje de error

  return (
    <div>
      <h3>Personal data</h3>
      <p><strong>Name:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
};

export default Datos;
