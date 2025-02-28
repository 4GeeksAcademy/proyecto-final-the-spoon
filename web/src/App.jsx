
import { Routes, Route } from 'react-router-dom'
import NavigateBar from './components/NavigateBar'
import Footer from './components/Footer.jsx'
import FeedRestaurantes from './components/Feedrestaurantes.jsx';
import RestauranteDetalle from './pages/RestauranteDetalle.jsx';

import UserDashboard from './pages/UserDashboard.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './App.css'


const App = () => {
  return (
    <div className="App">
      <header id='header'>
        <NavigateBar />
      </header>
      <main>
        <Routes>
          <Route path="/" element={<FeedRestaurantes />} />
          <Route path="/restaurante/:id" element={<RestauranteDetalle />} />
          <Route path="/users/:id/*" element={<UserDashboard />} />
          </Routes>
      </main>

      <footer id="footer">
        <Footer />
      </footer>
    </div>
  );
}


export default App
