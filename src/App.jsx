import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RoomsPage from './pages/RoomsPage';
import RoomDetailsPage from './pages/RoomDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import OffersPage from './pages/OffersPage';
import OfferDetailsPage from './pages/OfferDetailsPage';
import AuthPage from './pages/AuthPage'; // අලුතෙන් එකතු කළ Sign In / Register Page එක
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App() {
  return (
    <Router>
      <div className="w-full bg-[#F2EFE9] min-h-screen text-gray-800">
        {/* Global Navigation Bar */}
        <Navbar />

        <Routes>
          {/* Home Page Route */}
          <Route path="/" element={<Home />} />

          {/* Checkout & Payment Page Route */}
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* Rooms & Suites Dedicated Page Route */}
          <Route path="/rooms" element={<RoomsPage />} />

          {/* Room Details Dynamic Page Route */}
          <Route path="/rooms/:id" element={<RoomDetailsPage />} />

          {/* Special Offers Listing Page Route */}
          <Route path="/offers" element={<OffersPage />} />

          {/* Dynamic Offer Details Page Route */}
          <Route path="/offers/:id" element={<OfferDetailsPage />} />

          {/* Authentication (Sign In & Register) Page Route */}
          <Route path="/auth" element={<AuthPage />} />
        </Routes>

        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}