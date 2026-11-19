import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Sparkles,
    Waves,
    Utensils,
    Dumbbell,
    Heart,
    Crown,
    Clock,
    MapPin,
    Check,
    ArrowRight,
    ShieldCheck,
    Phone
} from 'lucide-react';
import BookingBar from '../components/BookingBar';
import RoomsBanner from '../components/RoomsBanner';
import experienceBg from '../assets/experience-bg.webp';

const DEFAULT_FACILITIES = [
    {
        id: 1,
        title: 'Oceanfront Infinity Pool & Private Cabanas',
        category: 'Pool & Beach',
        badge: 'SIGNATURE EXPERIENCE',
        hours: '06:30 AM – 09:30 PM',
        location: 'Main Coastal Horizon Deck',
        complimentary: 'Complimentary for In-House Guests',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=85',
        description:
            'Immerse yourself in our temperature-controlled saltwater infinity pool that blends seamlessly into the turquoise Indian Ocean. Relax in shaded teakwood cabanas with dedicated poolside butler service.',
        highlights: [
            'Chilled tropical fruit skewers & Evian mist service',
            'Private sunset cabanas with champagne service',
            'Dedicated family lagoon & heated jacuzzi deck'
        ]
    },
    {
        id: 2,
        title: 'Serenity Holistic Spa & Ayurveda Sanctuary',
        category: 'Spa & Wellness',
        badge: 'AWARD-WINNING SPA',
        hours: '08:00 AM – 08:30 PM',
        location: 'Emerald Lotus Garden Wing',
        complimentary: 'Advance Reservation Recommended',
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1400&q=85',
        description:
            'Rejuvenate body and soul amidst tranquil lotus ponds. Our master therapists blend ancient Sri Lankan Ayurveda with organic botanicals, warm stone rituals, and sound-healing therapies.',
        highlights: [
            'Private couples treatment villas with floral baths',
            'Authentic Shirodhara & Ceylon herbal steam suites',
            'Sunrise ocean-facing yoga & guided meditation'
        ]
    },
    {
        id: 3,
        title: 'The Azure Cliffside Fine Dining & Cellar',
        category: 'Fine Dining',
        badge: 'CULINARY EXCELLENCE',
        hours: '07:00 AM – 11:00 PM',
        location: 'West Cliff Ocean Terrace',
        complimentary: 'Smart Casual Dress Code',
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85',
        description:
            'Savor contemporary Indian Ocean gastronomy crafted from daily reef catches and organic estate spices, paired with over 300 vintage labels from our subterranean sommelier wine cellar.',
        highlights: [
            '7-course chef tasting menu under the stars',
            'Private beachfront candlelit dining setups',
            'Artisanal sunset cocktail & cigar lounge'
        ]
    },
    {
        id: 4,
        title: 'Performance Fitness & Ocean Movement Studio',
        category: 'Fitness & Sport',
        badge: '24/7 ACCESS',
        hours: 'Open 24 Hours (Keycard Access)',
        location: 'Wellness Pavilion, Level 2',
        complimentary: 'Complimentary for All Guests',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=85',
        description:
            'Maintain your peak routine with panoramic ocean views. Equipped with the latest Technogym Artis line, free weights, Reformer Pilates studio, and post-workout cryotherapy recovery.',
        highlights: [
            'Certified personal trainers & bespoke fitness plans',
            'Himalayan salt sauna & aromatic eucalyptus steam room',
            'Floodlit championship tennis & padel courts'
        ]
    },
    {
        id: 5,
        title: 'Private Cove Beach Club & Yacht Charters',
        category: 'Pool & Beach',
        badge: 'EXCLUSIVE ACCESS',
        hours: '07:00 AM – 07:00 PM',
        location: 'Serenity Private Southern Cove',
        complimentary: 'Private Concierge Booking',
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85',
        description:
            'Step directly onto powdery golden sands in our sheltered private bay. Embark on luxury catamaran sunset cruises, whale-watching expeditions, and guided coral reef snorkeling.',
        highlights: [
            'Private 55ft luxury sunset yacht charters',
            'Complimentary kayaking, paddleboarding & snorkeling gear',
            'Beachside wood-fired seafood grill & raw bar'
        ]
    },
    {
        id: 6,
        title: 'Royal Pavilion Events, Weddings & VIP Chauffeur',
        category: 'VIP & Events',
        badge: 'BESPOKE LUXURY',
        hours: '24/7 Dedicated Concierge',
        location: 'Grand Lobby & Ocean Lawn',
        complimentary: 'Tailored Packages Available',
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=85',
        description:
            'From fairytale cliffside weddings to executive retreats and private helicopter transfers, our dedicated lifestyle concierges orchestrate every detail with effortless sophistication.',
        highlights: [
            'Oceanfront wedding lawn for up to 250 guests',
            'Private helipad & Mercedes-Maybach airport transfers',
            '24/7 personal butler & private excursion planning'
        ]
    }
];

const FILTER_TABS = [
    { label: 'All Facilities', icon: Sparkles },
    { label: 'Pool & Beach', icon: Waves },
    { label: 'Spa & Wellness', icon: Heart },
    { label: 'Fine Dining', icon: Utensils },
    { label: 'Fitness & Sport', icon: Dumbbell },
    { label: 'VIP & Events', icon: Crown }
];

export default function FacilitiesPage() {
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState('All Facilities');
    const [facilities, setFacilities] = useState(DEFAULT_FACILITIES);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        try {
            const saved = localStorage.getItem('serenity_facilities');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    const mapped = parsed.map((item, idx) => ({
                        id: item.id || idx + 100,
                        title: item.title,
                        category: item.category || 'Spa & Wellness',
                        badge: item.status === 'OPEN' ? 'AVAILABLE DAILY' : item.status,
                        hours: item.hours || '08:00 AM – 09:00 PM',
                        location: item.location || 'Main Resort Wing',
                        complimentary: 'Complimentary for In-House Guests',
                        image: item.image || DEFAULT_FACILITIES[idx % DEFAULT_FACILITIES.length].image,
                        description: item.description,
                        highlights: item.highlights || DEFAULT_FACILITIES[idx % DEFAULT_FACILITIES.length].highlights
                    }));
                    setFacilities(mapped);
                }
            }
        } catch {
            // fallback to default
        }
    }, []);

    const filteredFacilities =
        selectedTab === 'All Facilities'
            ? facilities
            : facilities.filter((f) =>
                  f.category.toLowerCase().includes(selectedTab.split(' ')[0].toLowerCase())
              );

    return (
        <main className="min-h-screen bg-[#F8F5F0] text-[#061C2B] overflow-x-hidden">
            {/* ================= HERO BANNER ================= */}
            <header
                className="relative h-[450px] md:h-[600px] bg-cover bg-center flex flex-col justify-center px-6 pt-20 md:px-12 md:pt-28"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(6, 59, 50, 0.88) 0%, rgba(6, 59, 50, 0.52) 45%, rgba(6, 59, 50, 0.15) 80%), url(${experienceBg})`
                }}
            >
                <div className="max-w-7xl mx-auto w-full text-left animate-[fadeInUp_1s_ease-out]">
                    <span className="text-[#C9A24B] tracking-[0.25em] uppercase text-xs font-bold block mb-2">
                        WORLD-CLASS AMENITIES &amp; SANCTUARY
                    </span>
                    <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal mb-4 leading-tight">
                        Luxury Resort Facilities
                    </h1>
                    <p className="text-gray-200 text-xs sm:text-sm md:text-base font-light max-w-xl leading-relaxed">
                        Every corner of Serenity Bay is thoughtfully crafted to awaken your senses—from our horizon-edge infinity pool and holistic Ayurveda sanctuary to cliffside fine dining.
                    </p>
                </div>
            </header>

            {/* ================= FLOATING BOOKING BAR ================= */}
            <div className="w-full max-w-[1350px] mx-auto px-4 -mt-12 md:-mt-16 relative z-20 mb-14">
                <BookingBar />
            </div>

            {/* ================= INTRO HEADING ================= */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-8 text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                    <span className="h-[1px] w-10 bg-[#C9A24B]" />
                    <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#C9A24B]">
                        CURATED FOR YOUR COMFORT
                    </p>
                    <span className="h-[1px] w-10 bg-[#C9A24B]" />
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#063B32] font-normal mb-4">
                    Unrivaled Coastal Indulgence
                </h2>
                <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-gray-600 font-light">
                    Explore our signature resort facilities designed to elevate every moment of your tropical getaway.
                </p>
            </section>

            {/* ================= CATEGORY FILTER PILLS ================= */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 text-center">
                <div className="bg-[#FAF8F5] border border-[#C9A24B]/40 p-2 sm:p-3 rounded-2xl md:rounded-full shadow-md inline-flex flex-wrap justify-center items-center gap-2">
                    {FILTER_TABS.map(({ label, icon: IconComp }) => {
                        const active = selectedTab === label;
                        return (
                            <button
                                key={label}
                                type="button"
                                onClick={() => setSelectedTab(label)}
                                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wider transition-all duration-300 cursor-pointer flex items-center gap-2 ${
                                    active
                                        ? 'bg-[#C9A24B] text-[#061C2B] shadow-md scale-105 font-bold'
                                        : 'text-[#063B32] hover:bg-[#C9A24B]/15 bg-transparent'
                                }`}
                            >
                                <IconComp className={`w-4 h-4 ${active ? 'text-[#061C2B]' : 'text-[#C9A24B]'}`} />
                                <span>{label}</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* ================= FACILITIES LUXURY GRID ================= */}
            <section className="max-w-7xl mx-auto px-5 md:px-8 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                    {filteredFacilities.map((facility) => (
                        <article
                            key={facility.id}
                            className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-[#C9A24B]/25 transition-all duration-300 flex flex-col justify-between"
                        >
                            <div>
                                {/* Image Header */}
                                <div className="relative h-72 overflow-hidden">
                                    <img
                                        src={facility.image}
                                        alt={facility.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#061C2B]/80 via-transparent to-transparent" />

                                    <span className="absolute top-4 left-4 bg-[#063B32]/90 backdrop-blur-md text-[#C9A24B] border border-[#C9A24B]/40 px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase">
                                        {facility.category}
                                    </span>

                                    <span className="absolute top-4 right-4 bg-[#C9A24B] text-[#061C2B] px-3.5 py-1.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase shadow-md">
                                        {facility.badge}
                                    </span>

                                    <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-center justify-between gap-2 text-white text-xs">
                                        <span className="flex items-center gap-1.5 bg-black/45 backdrop-blur-sm px-3 py-1 rounded-full">
                                            <Clock className="w-3.5 h-3.5 text-[#C9A24B]" />
                                            {facility.hours}
                                        </span>
                                        <span className="flex items-center gap-1.5 bg-black/45 backdrop-blur-sm px-3 py-1 rounded-full">
                                            <MapPin className="w-3.5 h-3.5 text-[#C9A24B]" />
                                            {facility.location}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 sm:p-8">
                                    <h3 className="font-serif text-2xl sm:text-3xl text-[#063B32] font-semibold mb-3">
                                        {facility.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed mb-6">
                                        {facility.description}
                                    </p>

                                    {/* Highlights Box */}
                                    <div className="bg-[#FAF8F5] p-4 sm:p-5 rounded-2xl border border-[#C9A24B]/25 space-y-2.5">
                                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A24B] block">
                                            Signature Highlights
                                        </span>
                                        {(facility.highlights || []).map((point, i) => (
                                            <div key={i} className="flex items-center gap-2.5 text-xs text-[#061C2B]">
                                                <span className="w-4 h-4 rounded-full bg-[#C9A24B]/20 flex items-center justify-center shrink-0">
                                                    <Check className="w-2.5 h-2.5 text-[#C9A24B]" />
                                                </span>
                                                <span>{point}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer */}
                            <div className="px-6 sm:px-8 py-5 bg-[#FAF8F5] border-t border-[#C9A24B]/20 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-xs text-[#063B32] font-medium">
                                    <ShieldCheck className="w-4 h-4 text-[#C9A24B] shrink-0" />
                                    <span>{facility.complimentary}</span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        navigate('/checkout');
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="bg-gradient-to-r from-[#C9A24B] to-[#b49147] text-[#061C2B] px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider hover:opacity-95 transition shadow-md flex items-center gap-2 cursor-pointer shrink-0"
                                >
                                    <span>Book Stay</span>
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* ================= VIP CONCIERGE BANNER ================= */}
            <section className="max-w-7xl mx-auto px-5 md:px-8 pb-20">
                <div className="bg-[#063B32] text-white rounded-3xl p-8 md:p-12 border border-[#C9A24B]/40 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div className="max-w-2xl">
                        <span className="text-[#C9A24B] text-xs font-bold uppercase tracking-[0.25em] block mb-2">
                            PERSONALIZED BESPOKE SERVICE
                        </span>
                        <h3 className="font-serif text-2xl sm:text-4xl font-normal mb-3">
                            Need a Custom Experience or Private Charter?
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                            Our 24/7 Lifestyle Concierge team is delighted to arrange private spa rituals, cliffside proposals, yacht charters, or helicopter transfers tailored exclusively to your stay.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 shrink-0">
                        <a
                            href="tel:+94112345678"
                            className="border border-[#C9A24B] text-[#C9A24B] hover:bg-[#C9A24B] hover:text-[#061C2B] px-6 py-3.5 rounded-xl text-xs font-bold tracking-wider transition flex items-center gap-2"
                        >
                            <Phone className="w-4 h-4" />
                            <span>+94 11 234 5678</span>
                        </a>
                        <button
                            type="button"
                            onClick={() => {
                                navigate('/availability');
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="bg-[#C9A24B] text-[#061C2B] hover:bg-[#b49147] px-6 py-3.5 rounded-xl text-xs font-bold tracking-wider transition shadow-lg flex items-center gap-2 cursor-pointer"
                        >
                            <span>Check Room Availability</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </section>

            <RoomsBanner />
        </main>
    );
}
