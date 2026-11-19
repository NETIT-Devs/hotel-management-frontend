import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { OFFERS_DATA as staticOffers } from '../constants/hotelData';
import { fetchLiveOffers } from '../services/publicHotelService';
import { applyPageSEO } from '../utils/seo';
import { parsePriceValue } from '../utils/offerPricing';
import BookingBar from '../components/BookingBar';
import {
    ArrowRight,
    Sparkles,
    Crown,
    Heart,
    CalendarDays,
    Clock,
    Users,
    Sun,
    Flower2,
} from 'lucide-react';
import RoomsBanner from '../components/RoomsBanner';

// Import the hero background image asset
import offersHeroImg from '../assets/OffersPageHero.webp';

/**
 * OffersPage Component
 * Displays exclusive luxury hotel packages with category filters, dynamic live pricing,
 * Schema.org Offer structured data (SEO), and direct routing to real-time availability checks.
 */
function OffersPage() {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState('All Offers');
    const [offers, setOffers] = useState(staticOffers);

    // Fetch live promotional offers from backend API (with graceful fallback to static offers)
    useEffect(() => {
        fetchLiveOffers().then((mapped) => {
            if (mapped?.length) setOffers(mapped);
        });
    }, []);

    // Apply page-level SEO metadata and Schema.org Offer catalog JSON-LD
    useEffect(() => {
        const offerItems = offers.map((item, idx) => ({
            '@type': 'Offer',
            position: idx + 1,
            name: item.title,
            description: item.description,
            priceCurrency: 'USD',
            price: parsePriceValue(item.discountedPrice) || undefined,
            availability: 'https://schema.org/InStock',
            url: typeof window !== 'undefined' ? `${window.location.origin}/offers/${item.id}` : undefined
        }));

        return applyPageSEO({
            title: 'Exclusive Hotel Offers & Luxury Packages',
            description:
                'Explore curated luxury hotel deals, romantic escapes, early booking discounts, and extended stay packages at Serenity Bay Hotel & Resort.',
            canonicalPath: '/offers',
            jsonLd: {
                '@context': 'https://schema.org',
                '@type': 'ItemList',
                name: 'Serenity Bay Hotel Special Offers',
                itemListElement: offerItems
            }
        });
    }, [offers]);

    // Format category strings into clean Title Case and deduplicate case-insensitively
    const toTitleCase = (str) =>
        String(str || '')
            .trim()
            .toLowerCase()
            .replace(/\b\w/g, (ch) => ch.toUpperCase());

    const uniqueCategoryMap = new Map();
    ['Romantic Escape', 'Long Stay', 'Early Booking'].forEach((cat) => {
        uniqueCategoryMap.set(cat.toLowerCase(), cat);
    });
    offers.forEach((offer) => {
        const clean = toTitleCase(offer.category);
        if (clean && !uniqueCategoryMap.has(clean.toLowerCase())) {
            uniqueCategoryMap.set(clean.toLowerCase(), clean);
        }
    });
    const filterTabs = ['All Offers', ...Array.from(uniqueCategoryMap.values())];

    // Map each offer category label to a tailored luxury Lucide icon
    const getCategoryIcon = (label) => {
        const lower = String(label || '').toLowerCase();
        if (lower.includes('romantic')) return Heart;
        if (lower.includes('long')) return CalendarDays;
        if (lower.includes('early')) return Clock;
        if (lower.includes('family')) return Users;
        if (lower.includes('weekend')) return Sun;
        if (lower.includes('wellness') || lower.includes('spa')) return Flower2;
        if (lower.includes('vip') || lower.includes('luxury')) return Crown;
        return Sparkles;
    };

    // Auto-filter offers dynamically based on the selected tab category
    const filteredOffers = selectedTab === 'All Offers'
        ? offers
        : offers.filter(
            (offer) => (offer.category || '').trim().toLowerCase() === selectedTab.toLowerCase()
        );

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

            {/* ================= COMPACT LUXURY FILTER TABS (MATCHING FACILITIES STYLE) ================= */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-10 text-center" aria-label="Offer Categories">
                <div className="bg-[#FAF8F5] border border-[#C9A24B]/40 p-2 sm:p-2.5 rounded-2xl md:rounded-full shadow-md inline-flex flex-wrap justify-center items-center gap-1.5 sm:gap-2">
                    {filterTabs.map((tab) => {
                        const IconComponent = getCategoryIcon(tab);
                        const isSelected = selectedTab === tab;

                        return (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setSelectedTab(tab)}
                                className={`px-3.5 sm:px-5 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
                                    isSelected
                                        ? 'bg-[#C9A24B] text-[#061C2B] shadow-md font-bold'
                                        : 'text-[#063B32] hover:bg-[#C9A24B]/15 bg-transparent'
                                }`}
                                aria-pressed={isSelected}
                            >
                                <IconComponent
                                    className={`w-3.5 h-3.5 transition-colors shrink-0 ${
                                        isSelected ? 'text-[#061C2B]' : 'text-[#C9A24B]'
                                    }`}
                                    aria-hidden="true"
                                />
                                <span>{tab}</span>
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

                                        {/* Book Offer Button -> Routes to Real-Time Availability Check with Auto-Applied Offer */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigate(`/availability?offerId=${offer.id}`, {
                                                    state: {
                                                        selectedOffer: offer,
                                                        selectedRoomId: offer.room_id || null
                                                    }
                                                });
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="bg-gradient-to-r from-[#C9A24B] to-[#B38E38] text-[#063B32] hover:opacity-95 px-5 py-3 rounded-xl text-xs font-bold tracking-wider transition-all shadow-md flex items-center gap-2 cursor-pointer"
                                            aria-label={`Check availability and book offer ${offer.title}`}
                                        >
                                            <span>Book Offer</span>
                                            <ArrowRight className="w-3.5 h-3.5 text-[#063B32]" aria-hidden="true" />
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