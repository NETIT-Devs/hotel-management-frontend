import React from 'react';
import Hero from '../components/Hero';
import Amenities from '../components/Amenities';
import Rooms from '../components/Rooms';
import Experience from '../components/Experience';
import Offers from '../components/Offers';
import Testimonials from '../components/Testimonials';
import Gallery from '../components/Gallery';

/**
 * Home Component (Landing Page)
 * Assembles all core sections of the Serenity Bay Resort website.
 * Fully optimized for mobile responsiveness, accessibility, and luxury branding aesthetics.
 */
export default function Home() {
    return (
        <main
            id="home"
            className="min-h-screen bg-[#F2EFE9] selection:bg-[#D4AF37] selection:text-black overflow-hidden"
            aria-label="Serenity Bay Hotel & Resort Homepage"
        >
            {/* Hero Section with Signature Emerald Gradient */}
            <Hero />

            {/* Hotel Amenities & Facilities Bar */}
            <Amenities />

            {/* Featured Rooms and Suites Grid */}
            <Rooms />

            {/* Resort Experiences & Activities */}
            <Experience />

            {/* Special Offers & Packages */}
            <Offers />

            {/* Guest Testimonials & Reviews */}
            <Testimonials />

            {/* Resort Photo Gallery Preview */}
            <Gallery />
        </main>
    );
}