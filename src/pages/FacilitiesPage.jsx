import React, { useState, useEffect } from 'react';
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
    Phone,
    CalendarCheck,
    FileText,
    Wrench,
} from 'lucide-react';
import BookingBar from '../components/BookingBar';
import RoomsBanner from '../components/RoomsBanner';
import FacilityBookingModal from '../components/FacilityBookingModal';
import { fetchPublicFacilities } from '../services/facilityService';
import { applyPageSEO } from '../utils/seo';
import experienceBg from '../assets/experience-bg.webp';

// Graceful fallback catalog used only if the backend API is temporarily unreachable
const FALLBACK_FACILITIES = [
    {
        id: 1,
        title: 'Oceanfront Infinity Pool & Private Cabanas',
        category: 'POOL & BEACH',
        booking_type: 'COMPLIMENTARY',
        badge: 'SIGNATURE EXPERIENCE',
        hours: '06:30 AM – 09:30 PM',
        location: 'Main Coastal Horizon Deck',
        access_note: 'Complimentary Walk-In for In-House Guests',
        price_label: 'Complimentary',
        base_price: 0,
        max_guests: 40,
        time_slots: [],
        service_options: [],
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=85',
        description:
            'Immerse yourself in our temperature-controlled saltwater infinity pool that blends seamlessly into the turquoise Indian Ocean, complete with shaded teakwood loungers and poolside refreshment service.',
        highlights: [
            'Temperature-controlled saltwater infinity edge',
            'Chilled tropical fruit skewers & Evian mist service',
            'Dedicated family lagoon & heated jacuzzi deck',
        ],
        status: 'OPEN',
    },
    {
        id: 2,
        title: 'Serenity Holistic Spa & Ayurveda Sanctuary',
        category: 'SPA & WELLNESS',
        booking_type: 'RESERVABLE',
        badge: 'AWARD-WINNING SPA',
        hours: '08:00 AM – 08:30 PM',
        location: 'Emerald Lotus Garden Wing',
        access_note: 'Advance Appointment Recommended',
        price_label: 'From $95 / session',
        base_price: 95,
        max_guests: 4,
        time_slots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:30 PM', '06:30 PM'],
        service_options: [
            'Ceylon Ayurveda Full Body Ritual (90 min)',
            'Private Couples Aromatherapy Suite (120 min)',
            'Warm Stone & Shirodhara Healing Therapy (75 min)',
        ],
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1400&q=85',
        description:
            'Rejuvenate body and soul amidst tranquil lotus ponds. Our master therapists blend ancient Sri Lankan Ayurveda with organic botanicals, warm stone rituals, and sound-healing therapies.',
        highlights: [
            'Private couples treatment villas with floral baths',
            'Authentic Shirodhara & Ceylon herbal steam suites',
            'Sunrise ocean-facing yoga & guided meditation',
        ],
        status: 'OPEN',
    },
    {
        id: 3,
        title: 'The Azure Cliffside Fine Dining & Cellar',
        category: 'FINE DINING',
        booking_type: 'RESERVABLE',
        badge: 'CULINARY EXCELLENCE',
        hours: '07:00 AM – 11:00 PM',
        location: 'West Cliff Ocean Terrace',
        access_note: 'Smart Casual · Table Reservation Recommended',
        price_label: 'From $65 / guest',
        base_price: 65,
        max_guests: 12,
        time_slots: ['12:30 PM (Lunch)', '06:30 PM (Sunset)', '07:30 PM (Dinner)', '08:45 PM (Late Dining)'],
        service_options: [
            '7-Course Chef Tasting Menu (Ocean Terrace)',
            'Private Beachfront Candlelit Dinner for Two',
            'Subterranean Sommelier Wine Cellar Pairing',
        ],
        image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1400&q=85',
        description:
            'Savor contemporary Indian Ocean gastronomy crafted from daily reef catches and organic estate spices, paired with over 300 vintage labels from our subterranean sommelier wine cellar.',
        highlights: [
            '7-course chef tasting menu under the stars',
            'Private beachfront candlelit dining setups',
            'Over 300 vintage labels in our subterranean cellar',
        ],
        status: 'OPEN',
    },
    {
        id: 4,
        title: 'Performance Fitness & Ocean Movement Studio',
        category: 'FITNESS',
        booking_type: 'COMPLIMENTARY',
        badge: '24/7 ACCESS',
        hours: 'Open 24 Hours (Keycard Access)',
        location: 'Wellness Pavilion, Level 2',
        access_note: 'Complimentary 24/7 Access for All Guests',
        price_label: 'Complimentary',
        base_price: 0,
        max_guests: 25,
        time_slots: [],
        service_options: [],
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=85',
        description:
            'Maintain your peak routine with panoramic ocean views. Equipped with the latest Technogym Artis line, free weights, Reformer Pilates studio, and post-workout recovery suites.',
        highlights: [
            'Latest Technogym Artis line & Reformer Pilates studio',
            'Himalayan salt sauna & aromatic eucalyptus steam room',
            'Floodlit championship tennis & padel courts',
        ],
        status: 'OPEN',
    },
    {
        id: 5,
        title: 'Private Cove Beach Club & Yacht Charters',
        category: 'RECREATION',
        booking_type: 'RESERVABLE',
        badge: 'EXCLUSIVE EXPERIENCE',
        hours: '07:00 AM – 07:00 PM',
        location: 'Serenity Private Southern Cove',
        access_note: 'Private Concierge Slot Reservation',
        price_label: 'From $140 / experience',
        base_price: 140,
        max_guests: 10,
        time_slots: ['08:00 AM (Morning Reef)', '11:30 AM (Day Cabana)', '04:00 PM (Sunset Cruise)'],
        service_options: [
            'Private 55ft Luxury Sunset Yacht Charter',
            'Private Beachfront Champagne Cabana (Half-Day)',
            'Guided Coral Reef Snorkeling & Marine Safari',
        ],
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=85',
        description:
            'Step directly onto powdery golden sands in our sheltered private bay. Reserve luxury catamaran sunset cruises, private champagne beach cabanas, and guided coral reef expeditions.',
        highlights: [
            'Private 55ft luxury sunset yacht charters',
            'Complimentary kayaking, paddleboarding & snorkeling gear',
            'Beachside wood-fired seafood grill & raw bar',
        ],
        status: 'OPEN',
    },
    {
        id: 6,
        title: 'Royal Pavilion Events, Weddings & VIP Chauffeur',
        category: 'EVENTS & VIP',
        booking_type: 'INQUIRY',
        badge: 'BESPOKE VENUES',
        hours: '24/7 Dedicated Events Concierge',
        location: 'Grand Ballroom & Cliffside Ocean Lawn',
        access_note: 'Tailored Proposal Within 24 Hours',
        price_label: 'Bespoke Packages',
        base_price: 0,
        max_guests: 250,
        time_slots: ['Morning Event', 'Afternoon Reception', 'Evening Gala', 'Full-Day Venue'],
        service_options: [
            'Cliffside Luxury Destination Wedding',
            'Executive Boardroom & Corporate Retreat',
            'Private Anniversary / Milestone Gala',
            'VIP Helicopter or Maybach Airport Transfer',
        ],
        image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=85',
        description:
            'From fairytale cliffside weddings to executive retreats and private helicopter transfers, our dedicated lifestyle concierges orchestrate every detail with effortless sophistication.',
        highlights: [
            'Oceanfront wedding lawn for up to 250 guests',
            'Private helipad & Mercedes-Maybach airport transfers',
            'Dedicated event planners & bespoke banquet menus',
        ],
        status: 'OPEN',
    },
];

const FILTER_TABS = [
    { label: 'All Facilities', match: 'ALL', icon: Sparkles },
    { label: 'Pool & Beach', match: 'POOL', icon: Waves },
    { label: 'Spa & Wellness', match: 'SPA', icon: Heart },
    { label: 'Fine Dining', match: 'DINING', icon: Utensils },
    { label: 'Fitness & Sport', match: 'FITNESS', icon: Dumbbell },
    { label: 'Recreation & Yacht', match: 'RECREATION', icon: Waves },
    { label: 'VIP & Events', match: 'EVENT', icon: Crown },
];

/**
 * FacilitiesPage Component
 * Authentic 5-star resort facilities showcase powered by live MySQL backend data.
 * Distinguishes real hospitality service tiers:
 *  - COMPLIMENTARY -> Walk-in guest access (no misleading booking form)
 *  - RESERVABLE    -> Direct concierge slot/table reservation modal
 *  - INQUIRY       -> Bespoke event & wedding proposal inquiry modal
 */
export default function FacilitiesPage() {
    const [selectedTab, setSelectedTab] = useState('ALL');
    const [facilities, setFacilities] = useState(FALLBACK_FACILITIES);
    const [loading, setLoading] = useState(true);
    const [activeModalFacility, setActiveModalFacility] = useState(null);

    // Fetch live facilities catalog from backend API
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        let cancelled = false;

        fetchPublicFacilities()
            .then((liveFacilities) => {
                if (!cancelled && liveFacilities.length > 0) {
                    setFacilities(liveFacilities);
                }
            })
            .catch(() => {
                // Gracefully retain fallback facilities if API is offline
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    // Synchronize SEO metadata & Schema.org Hotel AmenityFeature structured data
    useEffect(() => {
        return applyPageSEO({
            title: 'Luxury Resort Facilities, Spa & Fine Dining',
            description:
                'Explore Serenity Bay Hotel & Resort amenities: oceanfront infinity pool, Ayurveda spa appointments, cliffside fine dining reservations, yacht charters, and bespoke wedding venues.',
            canonicalPath: '/facilities',
            jsonLd: {
                '@context': 'https://schema.org',
                '@type': 'Hotel',
                name: 'Serenity Bay Hotel & Resort',
                amenityFeature: facilities.map((f) => ({
                    '@type': 'LocationFeatureSpecification',
                    name: f.title,
                    value: f.status === 'OPEN',
                    description: f.description,
                })),
            },
        });
    }, [facilities]);

    const filteredFacilities =
        selectedTab === 'ALL'
            ? facilities
            : facilities.filter((f) =>
                String(f.category || '')
                    .toUpperCase()
                    .includes(selectedTab)
            );

    return (
        <main className="min-h-screen bg-[#F8F5F0] text-[#061C2B] overflow-x-hidden">
            {/* ================= HERO BANNER ================= */}
            <header
                className="relative h-[450px] md:h-[600px] bg-cover bg-center flex flex-col justify-center px-6 pt-20 md:px-12 md:pt-28"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(6, 59, 50, 0.85) 0%, rgba(6, 59, 50, 0.45) 40%, rgba(6, 59, 50, 0.1) 70%, rgba(6, 59, 50, 0) 90%), url(${experienceBg})`,
                }}
                role="banner"
                aria-label="Resort Facilities Header"
            >
                <div className="max-w-7xl mx-auto w-full text-left animate-[fadeInUp_1s_ease-out]">
                    <span className="text-[#C5A253] tracking-[0.2em] uppercase text-xs font-bold block mb-2">
                        WORLD-CLASS AMENITIES &amp; CONCIERGE
                    </span>
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-normal mb-3 md:mb-4">
                        Luxury Resort <span className="italic text-[#C9A24B]">Facilities</span>
                    </h1>
                    <p className="text-gray-200 text-xs sm:text-sm md:text-base font-light max-w-xl leading-relaxed">
                        Enjoy complimentary coastal sanctuaries, reserve private Ayurveda spa rituals or cliffside dining tables, or request a bespoke event proposal with our 24/7 concierge.
                    </p>
                </div>
            </header>

            {/* ================= FLOATING BOOKING BAR ================= */}
            <div className="w-full max-w-[1350px] mx-auto px-4 -mt-12 md:-mt-16 relative z-20 mb-12">
                <BookingBar />
            </div>

            {/* ================= INTRO & 3-TIER ACCESS GUIDE ================= */}
            <section
                className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-8 text-center"
                aria-label="Resort Facilities Overview"
            >
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
                <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-gray-600 font-light mb-8">
                    From complimentary walk-in wellness spaces to curated private dining and destination weddings, every facility follows seamless 5-star hospitality etiquette.
                </p>

                {/* Real-World 3-Tier Hospitality Access Legend */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto text-left">
                    <div className="bg-white rounded-2xl p-4 border border-[#C9A24B]/25 shadow-xs flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#063B32] flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-4 h-4 text-[#063B32]" aria-hidden="true" />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-[#063B32] uppercase tracking-wider">
                                Complimentary Access
                            </h3>
                            <p className="text-[11px] text-gray-500 font-light mt-0.5">
                                Infinity pool &amp; 24/7 fitness studio—walk in freely with your room keycard.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-[#C9A24B]/35 shadow-xs flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#C9A24B]/20 text-[#063B32] flex items-center justify-center shrink-0">
                            <CalendarCheck className="w-4 h-4 text-[#C9A24B]" aria-hidden="true" />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-[#063B32] uppercase tracking-wider">
                                Slot &amp; Table Reservations
                            </h3>
                            <p className="text-[11px] text-gray-500 font-light mt-0.5">
                                Reserve spa rituals, dining tables &amp; yacht charters—pay at venue or charge to suite.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-4 border border-[#063B32]/20 shadow-xs flex items-start gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#063B32] text-[#C9A24B] flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4 text-[#C9A24B]" aria-hidden="true" />
                        </div>
                        <div>
                            <h3 className="text-xs font-bold text-[#063B32] uppercase tracking-wider">
                                Bespoke Event Proposals
                            </h3>
                            <p className="text-[11px] text-gray-500 font-light mt-0.5">
                                Weddings, galas &amp; executive venues—receive a custom quote within 24 hours.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= CATEGORY FILTER PILLS (SINGLE-ROW ON DESKTOP) ================= */}
            <section
                className="max-w-7xl mx-auto px-4 sm:px-6 pb-10 text-center"
                aria-label="Filter Facilities by Category"
            >
                <div className="bg-[#FAF8F5] border border-[#C9A24B]/40 p-1.5 sm:p-2 rounded-2xl lg:rounded-full shadow-md inline-flex flex-wrap lg:flex-nowrap justify-center items-center gap-1 sm:gap-1.5 max-w-full">
                    {FILTER_TABS.map(({ label, match, icon: IconComp }) => {
                        const active = selectedTab === match;
                        return (
                            <button
                                key={label}
                                type="button"
                                onClick={() => setSelectedTab(match)}
                                aria-pressed={active}
                                className={`px-3 xl:px-4 py-2 rounded-full text-[11px] xl:text-xs font-semibold tracking-wide transition-all duration-300 cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${active
                                        ? 'bg-[#C9A24B] text-[#061C2B] shadow-md font-bold'
                                        : 'text-[#063B32] hover:bg-[#C9A24B]/15 bg-transparent'
                                    }`}
                            >
                                <IconComp
                                    className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-[#061C2B]' : 'text-[#C9A24B]'}`}
                                    aria-hidden="true"
                                />
                                <span>{label}</span>
                            </button>
                        );
                    })}
                </div>
            </section>

            {/* ================= FACILITIES LUXURY GRID ================= */}
            <section
                className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 pb-20"
                aria-label="Resort Facilities Catalog"
            >
                {loading ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-[#C9A24B]/20 shadow-sm">
                        <p className="text-sm text-gray-500">Loading resort facilities &amp; concierge schedules...</p>
                    </div>
                ) : filteredFacilities.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-[#C9A24B]/20 shadow-sm">
                        <p className="font-serif text-xl text-[#063B32] mb-2">No facilities in this category yet</p>
                        <button
                            type="button"
                            onClick={() => setSelectedTab('ALL')}
                            className="mt-2 bg-[#063B32] text-[#C9A24B] px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                        >
                            Show All Facilities
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-7 lg:gap-10">
                        {filteredFacilities.map((facility) => {
                            const bookingType = String(facility.booking_type || 'COMPLIMENTARY').toUpperCase();
                            const isMaintenance = String(facility.status || 'OPEN').toUpperCase() !== 'OPEN';
                            const displayImage =
                                facility.image ||
                                facility.image_url ||
                                'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=85';

                            return (
                                <article
                                    key={facility.id}
                                    className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-[#C9A24B]/25 transition-all duration-300 flex flex-col justify-between"
                                >
                                    <div>
                                        {/* Image Header */}
                                        <div className="relative h-64 sm:h-72 overflow-hidden bg-gray-100">
                                            <img
                                                src={displayImage}
                                                alt={`${facility.title} at Serenity Bay Hotel & Resort`}
                                                loading="lazy"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#061C2B]/80 via-transparent to-transparent" />

                                            <span className="absolute top-4 left-4 bg-[#063B32]/90 backdrop-blur-md text-[#C9A24B] border border-[#C9A24B]/40 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase">
                                                {facility.category}
                                            </span>

                                            <span
                                                className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-[10px] font-extrabold tracking-wider uppercase shadow-md ${isMaintenance
                                                        ? 'bg-amber-500 text-white'
                                                        : 'bg-[#C9A24B] text-[#061C2B]'
                                                    }`}
                                            >
                                                {isMaintenance ? 'MAINTENANCE' : facility.badge || 'AVAILABLE DAILY'}
                                            </span>

                                            <div className="absolute bottom-3.5 left-4 right-4 flex flex-wrap items-center justify-between gap-2 text-white text-[11px] sm:text-xs">
                                                <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                                                    <Clock className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" aria-hidden="true" />
                                                    <span>{facility.hours}</span>
                                                </span>
                                                <span className="flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                                                    <MapPin className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" aria-hidden="true" />
                                                    <span>{facility.location}</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Card Body */}
                                        <div className="p-5 sm:p-7">
                                            <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                                                <span
                                                    className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md ${bookingType === 'COMPLIMENTARY'
                                                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                                            : bookingType === 'INQUIRY'
                                                                ? 'bg-[#063B32]/10 text-[#063B32] border border-[#063B32]/20'
                                                                : 'bg-[#C9A24B]/15 text-[#8a6a1f] border border-[#C9A24B]/35'
                                                        }`}
                                                >
                                                    {bookingType === 'COMPLIMENTARY'
                                                        ? 'Complimentary Walk-In'
                                                        : bookingType === 'INQUIRY'
                                                            ? 'Bespoke Event Proposal'
                                                            : 'Reservation Recommended'}
                                                </span>
                                                <span className="text-xs font-bold text-[#063B32]">
                                                    {facility.price_label || 'Complimentary'}
                                                </span>
                                            </div>

                                            <h3 className="font-serif text-2xl sm:text-[26px] text-[#063B32] font-semibold mb-2.5 leading-snug">
                                                {facility.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed mb-5">
                                                {facility.description}
                                            </p>

                                            {/* Signature Highlights Box */}
                                            {Array.isArray(facility.highlights) && facility.highlights.length > 0 && (
                                                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#C9A24B]/25 space-y-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A24B] block">
                                                        Signature Highlights
                                                    </span>
                                                    {facility.highlights.map((point, i) => (
                                                        <div key={i} className="flex items-start gap-2.5 text-xs text-[#061C2B]">
                                                            <span
                                                                className="w-4 h-4 rounded-full bg-[#C9A24B]/20 flex items-center justify-center shrink-0 mt-0.5"
                                                                aria-hidden="true"
                                                            >
                                                                <Check className="w-2.5 h-2.5 text-[#C9A24B]" />
                                                            </span>
                                                            <span>{point}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Smart Tiered Action Footer */}
                                    <div className="px-5 sm:px-7 py-4 sm:py-5 bg-[#FAF8F5] border-t border-[#C9A24B]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-2 text-xs text-[#063B32] font-medium">
                                            <ShieldCheck className="w-4 h-4 text-[#C9A24B] shrink-0" aria-hidden="true" />
                                            <span>{facility.access_note || 'In-House Concierge Service'}</span>
                                        </div>

                                        {isMaintenance ? (
                                            <span className="inline-flex items-center justify-center gap-1.5 bg-amber-100 text-amber-800 border border-amber-200 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0">
                                                <Wrench className="w-3.5 h-3.5" aria-hidden="true" />
                                                <span>Under Maintenance</span>
                                            </span>
                                        ) : bookingType === 'COMPLIMENTARY' ? (
                                            <span className="inline-flex items-center justify-center gap-1.5 bg-emerald-50 text-[#063B32] border border-emerald-200 px-4 py-2.5 rounded-xl text-xs font-bold shrink-0">
                                                <Check className="w-3.5 h-3.5 text-emerald-700" aria-hidden="true" />
                                                <span>No Booking Required</span>
                                            </span>
                                        ) : bookingType === 'INQUIRY' ? (
                                            <button
                                                type="button"
                                                onClick={() => setActiveModalFacility(facility)}
                                                aria-label={`Request event proposal for ${facility.title}`}
                                                className="bg-[#063B32] text-[#C9A24B] hover:opacity-95 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                                            >
                                                <span>Request Proposal</span>
                                                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                                            </button>
                                        ) : (
                                            <button
                                                type="button"
                                                onClick={() => setActiveModalFacility(facility)}
                                                aria-label={`Reserve slot for ${facility.title}`}
                                                className="bg-gradient-to-r from-[#C9A24B] to-[#b49147] text-[#061C2B] px-5 py-2.5 rounded-xl text-xs font-extrabold tracking-wider hover:opacity-95 transition shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
                                            >
                                                <span>Reserve Now</span>
                                                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                                            </button>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                )}

                {/* Concierge Direct Assistance Bar */}
                <div className="mt-14 bg-[#063B32] rounded-3xl p-6 sm:p-10 text-white border border-[#C9A24B]/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <span className="text-[#C9A24B] tracking-[0.25em] uppercase text-[11px] font-bold block mb-2">
                            24/7 LIFESTYLE CONCIERGE
                        </span>
                        <h3 className="font-serif text-2xl sm:text-3xl font-normal mb-2">
                            Bespoke Private Experiences &amp; Group Requests
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-300 font-light max-w-xl">
                            Planning a private beachfront proposal, customized wellness retreat, or airport helicopter transfer? Speak directly with our resident concierge team.
                        </p>
                    </div>
                    <a
                        href="tel:+94112345678"
                        className="bg-[#C9A24B] text-[#061C2B] px-6 sm:px-7 py-3.5 rounded-2xl text-xs font-extrabold uppercase tracking-wider hover:bg-[#b49147] transition shadow-lg inline-flex items-center gap-2.5 shrink-0"
                        aria-label="Call Serenity Bay Concierge Desk"
                    >
                        <Phone className="w-4 h-4" aria-hidden="true" />
                        <span>Call Concierge · +94 11 234 5678</span>
                    </a>
                </div>
            </section>

            {/* Rooms Banner */}
            <RoomsBanner />

            {/* Facility Slot Reservation & Event Inquiry Modal */}
            {activeModalFacility && (
                <FacilityBookingModal
                    facility={activeModalFacility}
                    onClose={() => setActiveModalFacility(null)}
                />
            )}

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
