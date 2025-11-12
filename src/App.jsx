
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import CategoryMenu from './components/CategoryMenu';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AddService from './pages/AddService';
import ServiceSubmitted from './pages/ServiceSubmitted';
import Favorites from './pages/Favorites';
import Reviews from './pages/Reviews';
import UserProfile from './pages/UserProfile';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <CategoryMenu />
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/add-service" element={<AddService />} />
            <Route path="/service-submitted" element={<ServiceSubmitted />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/reviews/all" element={<Reviews />} />
            <Route path="/users/:id" element={<UserProfile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
