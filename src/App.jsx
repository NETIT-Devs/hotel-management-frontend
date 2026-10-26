import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RoomsPage from './pages/RoomsPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App() {
  return (
    <Router>
      <div className="w-full bg-[#fcfbf9] min-h-screen text-gray-800">
        <Navbar />
        <Routes>
          {/* Home Page */}
          <Route path="/" element={<Home />} />

          {/* Rooms & Suites Dedicated Page */}
          <Route path="/rooms" element={<RoomsPage />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}