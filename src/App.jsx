import React from 'react';
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
import AdminDashboard from './pages/admin/AdminDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function AppLayout() {
  const location = useLocation();
  const isAdminRoute =
    location.pathname.startsWith('/admin') ||
    location.pathname.startsWith('/dashboard');

  return (
    <div className="w-full bg-[#F2EFE9] min-h-screen text-gray-800">
      {/* Global Navigation Bar (hidden on Admin Dashboard routes) */}
      {!isAdminRoute && <Navbar />}

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

        {/* Admin & Super Admin Dashboard Routes */}
        <Route path="/dashboard" element={<AdminDashboard activeSection="overview" />} />
        <Route path="/admin/dashboard" element={<AdminDashboard activeSection="overview" />} />
        <Route path="/admin/bookings" element={<AdminDashboard activeSection="bookings" />} />
        <Route path="/admin/offers" element={<AdminDashboard activeSection="offers" />} />
        <Route path="/admin/promo-codes" element={<AdminDashboard activeSection="promo-codes" />} />
        <Route path="/admin/rooms" element={<AdminDashboard activeSection="rooms" />} />
        <Route path="/admin/facilities" element={<AdminDashboard activeSection="facilities" />} />
        <Route path="/admin/gallery" element={<AdminDashboard activeSection="gallery" />} />
        <Route path="/admin/management" element={<AdminDashboard activeSection="management" />} />
        <Route path="/admin/*" element={<AdminDashboard activeSection="overview" />} />
      </Routes>

      {/* Global Footer (hidden on Admin Dashboard routes) */}
      {!isAdminRoute && <Footer />}
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