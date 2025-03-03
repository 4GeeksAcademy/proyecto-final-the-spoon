
import { Routes, Route } from 'react-router-dom'
import NavigateBar from './components/NavigateBar'
import Footer from './components/Footer.jsx'
import FeedRestaurantes from './components/Feedrestaurantes.jsx';

import GuardedRoute from './components/GuardedRoute.jsx';

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
      </main>
      <footer id="footer">
        <Footer />
      </footer>
    </div>
  );
}


export default App
