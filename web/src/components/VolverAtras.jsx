import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const VolverAtras = () => {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)} style={{ cursor: 'pointer', fontSize: '20px', marginBottom: '20px' }}>
      <FaArrowLeft /> Volver
    </button>
  );
};

export default VolverAtras;
