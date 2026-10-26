import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Amenities from '../components/Amenities';
import Rooms from '../components/Rooms';
import Experience from '../components/Experience';
import Offers from '../components/Offers';
import Testimonials from '../components/Testimonials';
import Gallery from '../components/Gallery';
import Footer from '../components/Footer';

export default function Home() {
    return (
        <div id="home" className="min-h-screen selection:bg-[#D4AF37] selection:text-black">
            <Navbar />
            <Hero />
            <Amenities />
            <Rooms />
            <Experience />
            <Offers />
            <Testimonials />
            <Gallery />
            <Footer />
        </div>
    );
}