import { Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import NavigateBar from './components/NavigateBar'
import Footer from './components/Footer'
import './App.css'


const App = () => {
  return (
    <div className="App">
      <header id='header'>
        <NavigateBar />
      </header>
      {/* <main>
          <AppHero />
          <AppAbout />
          <AppServices />
          <AppWorks />
          <AppTeams />
          <AppTestimonials />
          <AppBlog />
          <AppContact />
        </main> */}
      <footer id="footer">
        <Footer />
      </footer>
    </div>
  );
}


export default App
