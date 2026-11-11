import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { OFFERS_DATA as offers } from '../constants/hotelData';
import BookingBar from '../components/BookingBar';
import { ArrowRight, Sparkles, Crown, Heart, CalendarDays, Clock } from 'lucide-react';
import RoomsBanner from '../components/RoomsBanner';

// Import the exact hero background image from assets
import offersHeroImg from '../assets/OffersPageHero.webp';

/**
 * OffersPage Component
 * Displays exclusive hotel packages with reordered layout (Intro heading on top, Filter tabs below),
 * dynamic pricing, responsive white-themed card grid, and smooth navigation.
 */
function OffersPage() {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState('All Offers');

    // Auto-filter offers dynamically based on the selected tab category.
    const filteredOffers = selectedTab === 'All Offers'
        ? offers
        : offers.filter(offer => offer.category.toLowerCase() === selectedTab.toLowerCase());

    const filterTabs = ['All Offers', 'Romantic Escape', 'Long Stay', 'Early Booking'];

    return (
        <main className="min-h-screen bg-[#F8F5F0] text-[#18342d] overflow-x-hidden">
            {/* ================= HERO SECTION ================= */}
            <header
                className="relative h-[450px] md:h-[600px] bg-cover bg-center flex flex-col justify-center px-6 pt-20 md:px-12 md:pt-28"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(6, 59, 50, 0.85) 0%, rgba(6, 59, 50, 0.45) 40%, rgba(6, 59, 50, 0.1) 70%, rgba(6, 59, 50, 0) 90%), url(${offersHeroImg})`
                }}
                role="banner"
                aria-label="Offers page header"
            >
                {/* Hero Content with Smooth Fade-In & Slide-Up Animation */}
                <div className="max-w-7xl mx-auto w-full text-left animate-[fadeInUp_1s_ease-out]">
                    <span className="text-[#C5A253] tracking-[0.2em] uppercase text-xs font-bold block mb-2">
                        EXCLUSIVE EXPERIENCES
                    </span>
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-normal mb-3 md:mb-4">
                        Exclusive Offers
                    </h1>
                    <p className="text-gray-200 text-xs sm:text-sm md:text-base font-light max-w-xl leading-relaxed">
                        Discover thoughtfully curated offers and make your next<br className="hidden sm:block" />
                        Serenity Bay escape even more memorable.
                    </p>
                </div>
            </header>

            {/* Booking Bar Component Integration */}
            <div className="w-full max-w-[1350px] mx-auto px-4 -mt-12 md:-mt-16 relative z-20 mb-12 md:mb-16">
                <BookingBar />
            </div>

            {/* ================= INTRO HEADING SECTION ================= */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-6 text-center" aria-label="Offers Introduction">
                {/* Subtitle with Luxury Golden Accent */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
                    <span className="h-[1px] w-8 sm:w-12 bg-[#C5A253]"></span>
                    <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] sm:tracking-[0.3em] uppercase text-[#C5A253]">
                        SOMETHING SPECIAL AWAITS
                    </p>
                    <span className="h-[1px] w-8 sm:w-12 bg-[#C5A253]"></span>
                </div>

                {/* Main Heading - Adjusted for Mobile & Desktop */}
                <h2 className="font-serif text-2xl sm:text-4xl md:text-5xl text-[#063b32] font-normal mb-3 sm:mb-4">
                    Find Your Perfect Escape
                </h2>

                {/* Description - Optimized for mobile readability */}
                <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-gray-600 font-light px-2">
                    From romantic moments to longer, leisurely stays, explore
                    experiences designed to make every moment count.
                </p>
            </section>

            {/* ================= AUTO FILTER TABS SECTION (RESPONSIVE & AUTO-ADJUSTING) ================= */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-12 text-center" aria-label="Offer Categories">
                {/* 
                  'flex flex-wrap' ensures that if new categories are added, 
                  they automatically wrap and resize cleanly on both mobile and desktop screens.
                */}
                <div className="bg-[#FAF8F5] border border-[#C9A24B]/40 p-2 sm:p-3 rounded-2xl md:rounded-full shadow-md inline-flex flex-wrap justify-center items-center gap-2 sm:gap-2.5">
                    {filterTabs.map((tab) => {
                        // Assigning appropriate Lucide icons automatically
                        let IconComponent = Sparkles;
                        if (tab === 'Romantic Escape') IconComponent = Heart;
                        if (tab === 'Long Stay') IconComponent = CalendarDays;
                        if (tab === 'Early Booking') IconComponent = Clock;

                        const isSelected = selectedTab === tab;

                        return (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setSelectedTab(tab)}
                                className={`px-4 sm:px-6 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${isSelected
                                    ? 'bg-[#C9A24B] text-white shadow-md scale-105 font-bold' // Active: Golden pill with crisp white text
                                    : 'text-[#063B32] hover:bg-[#C9A24B]/15 bg-transparent' // Inactive: Transparent with hover effect
                                    }`}
                                aria-pressed={isSelected}
                            >
                                <IconComponent
                                    className={`w-4 h-4 transition-colors flex-shrink-0 ${isSelected ? 'text-white' : 'text-[#C9A24B]'
                                        }`}
                                />
                                <span className="truncate">{tab}</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* ================= OFFER CARDS SECTION ================= */}
            <section
                id="available-offers"
                className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-12"
                aria-label="Available Special Offers"
            >
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredOffers.map((offer) => {
                        const displayImage = offer.images?.[0] || offer.image;

                        // Assigning appropriate category icons based on offer type
                        let CatIcon = Sparkles;
                        if (offer.category.toLowerCase().includes('romantic')) CatIcon = Heart;
                        else if (offer.category.toLowerCase().includes('long')) CatIcon = CalendarDays;
                        else if (offer.category.toLowerCase().includes('early')) CatIcon = Clock;

                        return (
                            <article
                                key={offer.id}
                                className="group flex flex-col overflow-hidden rounded-3xl border border-transparent bg-white transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl shadow-md"
                            >
                                {/* Card Image & Only Discount Badge on top */}
                                <div className="relative h-64 w-full overflow-hidden flex-shrink-0">
                                    <img
                                        src={displayImage}
                                        alt={offer.title}
                                        loading="lazy"
                                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                                    />

                                    {/* Discount Badge on top-right */}
                                    <span className="absolute top-4 right-4 rounded-full bg-[#C9A24B] px-3.5 py-2 text-xs font-extrabold text-[#063B32] shadow-lg uppercase tracking-wider border border-white/20">
                                        {offer.discount}
                                    </span>
                                </div>

                                {/* Card Body Content */}
                                <div className="flex flex-1 flex-col p-6 md:p-7 text-[#063B32]">

                                    {/* Category with Golden Icon inside the body */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <CatIcon className="w-4 h-4 text-[#C9A24B]" />
                                        <span className="text-[11px] font-bold tracking-[0.2em] text-[#C9A24B] uppercase">
                                            {offer.category}
                                        </span>
                                    </div>

                                    {/* Balanced Soft & Elegant Luxury Title */}
                                    <h3 className="font-serif text-2xl font-semibold text-[#063B32] tracking-wide mb-2">
                                        {offer.title}
                                    </h3>

                                    {/* Description text */}
                                    <p className="text-sm text-gray-600 font-light leading-relaxed mb-4">
                                        {offer.description}
                                    </p>

                                    {/* Perfectly Spaced & Balanced Luxury Pricing Structure */}
                                    <div className="mb-6 bg-[#FAF8F5] p-4 rounded-2xl border border-[#C9A24B]/30 shadow-inner mt-auto">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-gray-400 font-light line-through">
                                                {offer.originalPrice} / night
                                            </span>
                                            <span className="rounded-lg bg-[#C9A24B]/15 px-2.5 py-0.5 text-[11px] font-bold text-[#C9A24B] border border-[#C9A24B]/30">
                                                {offer.saveAmount}
                                            </span>
                                        </div>
                                        <div className="flex items-baseline gap-1.5 pt-1 border-t border-gray-200/60">
                                            <span className="text-xs text-gray-600 font-medium">From</span>
                                            <span className="font-serif text-2xl font-bold text-[#063B32]">
                                                {offer.discountedPrice}
                                            </span>
                                            <span className="text-xs text-gray-600 font-medium">/ night</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons: Read More & Book Now in a single row */}
                                    <div className="pt-2 flex items-center justify-between gap-4">
                                        {/* Read More Link */}
                                        <Link
                                            to={`/offers/${offer.id}`}
                                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                            className="text-xs font-bold tracking-wider text-[#C9A24B] hover:text-[#B38E38] transition-colors cursor-pointer inline-flex items-center gap-1.5"
                                            aria-label={`Read more about ${offer.title}`}
                                        >
                                            <span>Read More</span>
                                            <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>

                                        {/* Book Now Button */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigate('/checkout', { state: { room: offer } });
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="bg-gradient-to-r from-[#C9A24B] to-[#B38E38] text-[#063B32] hover:opacity-95 px-5 py-3 rounded-xl text-xs font-bold tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
                                            aria-label={`Book offer ${offer.title}`}
                                        >
                                            <span>Book Now</span>
                                            <ArrowRight className="w-3.5 h-3.5 text-[#063B32]" />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </section>

            {/* Rooms Banner Component - Positioned directly above the footer */}
            <RoomsBanner />

            {/* Custom keyframes for smooth fade-in-up animation */}
            <style>{`
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </main>
    );
}

export default OffersPage;