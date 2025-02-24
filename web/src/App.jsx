
import { Routes, Route } from 'react-router-dom'
import NavigateBar from './components/NavigateBar'
import Footer from './components/Footer.jsx'
import ReviewForm from './forms/ReviewForm.jsx';
import ReservationForm from './forms/ReservationForm.jsx';
import FeedRestaurantes from './components/Feedrestaurantes.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './App.css'

const App = () => {
  return (
    <div className="App">
      <header id='header'>
        <NavigateBar />
      </header>
      <FeedRestaurantes />
      <footer id="footer">
        <Footer />
      </footer>
    </div>
  );
}


export default App
