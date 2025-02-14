import { Routes, Route } from 'react-router'
import './App.css'

function App() {

  return (
    <>
      <div>
      <NavigateBar />
      <Routes>
        <Route path="/feed" element={<Feed />} />
        <Route path="/feed/:id" element={<FeedRestaurants />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id/favs" element={<UserFavs />} />
        <Route path="/users/:id/resenas" element={<UserReseñas />} />
        <Route path="/users/:id/reservas" element={<UserReservas />} />
        <Route path="/users/:id/puntos" element={<UserPuntos />} />
      </Routes>
      <Footer />
      </div>
    </>
  )
}

export default App
