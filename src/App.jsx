import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import RoomsPage from './pages/RoomsPage';
import RoomDetailsPage from './pages/RoomDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import OffersPage from './pages/OffersPage';
import OfferDetailsPage from './pages/OfferDetailsPage';
import FacilitiesPage from './pages/FacilitiesPage';
import AvailabilityPage from './pages/AvailabilityPage';
import GalleryPage from './pages/GalleryPage';
import MyBookingsPage from './pages/MyBookingsPage';
import AuthPage from './pages/AuthPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ReviewsPage from './pages/ReviewsPage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function AppLayout() {
  return (
    <div className="w-full bg-[#F2EFE9] min-h-screen text-gray-800">
      <ScrollToTop />
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

        {/* Luxury Facilities Page Route */}
        <Route path="/facilities" element={<FacilitiesPage />} />

        {/* Luxury Gallery Page Route */}
        <Route path="/gallery" element={<GalleryPage />} />

        {/* Live Availability Check Page Route */}
        <Route path="/availability" element={<AvailabilityPage />} />

        {/* Customer Bookings & Profile Dashboard */}
        <Route path="/my-bookings" element={<MyBookingsPage />} />
        <Route path="/profile" element={<MyBookingsPage />} />

        {/* Authentication (Sign In & Register) Page Route */}
        <Route path="/auth" element={<AuthPage />} />

        {/* About Us Page Route */}
        <Route path="/about" element={<AboutPage />} />

        {/* Contact & Concierge Page Route */}
        <Route path="/contact" element={<ContactPage />} />

        {/* Verified Guest Reviews Page Route */}
        <Route path="/reviews" element={<ReviewsPage />} />
      </Routes>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}