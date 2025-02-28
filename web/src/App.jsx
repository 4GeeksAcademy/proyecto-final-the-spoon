
import { Routes, Route } from 'react-router-dom'
import NavigateBar from './components/NavigateBar'
import Footer from './components/Footer.jsx'
import FeedRestaurantes from './components/Feedrestaurantes.jsx';

import UserDashboard from './pages/UserDashboard.jsx';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import './App.css'
import { publicRoutesConfig } from '../RouteConfig.js';
import { guardedRoutesConfig } from '../RouteConfig.js';

const App = () => {
  return (
    <div className="App">
      <header id='header'>
        <NavigateBar />
      </header>
      <main>
        <Routes>
<<<<<<< HEAD
        {publicRoutesConfig.map((route) => {
            return (
              <Route
              key={route.name}
              path={route.path}
              element={route.component}
              />
            )
           })}
          <Route element={<GuardedRoute />}>
           {guardedRoutesConfig.map((route) => {
            return (
              <Route
              key={route.name}
              path={route.path}
              element={route.component}
              />
            )
           })}
          </Route>
          <Route path="/*" element={<FeedRestaurantes />} />
        </Routes>
=======
          <Route path="/" element={<FeedRestaurantes />} />
          <Route path="/restaurante/:id" element={<RestauranteDetalle />} />
          <Route path="/users/:id/*" element={<UserDashboard />} />
          </Routes>
>>>>>>> c38aab85c58f30e17169ff6c8e8b4fe597e256a9
      </main>
      <footer id="footer">
        <Footer />
      </footer>
    </div>
  );
}


export default App
