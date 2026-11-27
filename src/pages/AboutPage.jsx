import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Sparkles,
    Compass,
    Heart,
    ArrowRight,
    Utensils,
    Waves,
    Bed,
    Users,
    MapPin,
    Award,
    Clock,
} from 'lucide-react';
import { applyPageSEO } from '../utils/seo';

// Existing project assets — swap any of these imports with your own photography later
import hotelLobbyImg from '../assets/hotelLobbyImg.webp';
import resortExteriorImg from '../assets/resortExteriorImg.webp';
import luxurySuiteImg from '../assets/roomsPageHero.webp';
import fineDiningImg from '../assets/OffersPageHero.webp';
import spaWellnessImg from '../assets/spaWellnessImg.webp';

// Key resort highlights displayed in the editorial metrics bar
const RESORT_HIGHLIGHTS = [
    { value: '10+', label: 'Years of Excellence', icon: Award },
    { value: '25+', label: 'Luxury Suites & Villas', icon: Bed },
    { value: '24/7', label: 'Personal Concierge', icon: Clock },
    { value: 'Mirissa', label: 'Beachfront Sanctuary', icon: MapPin },
];

/**
 * AboutPage Component
 * Editorial brand story & hospitality showcase for Serenity Bay Hotel & Resort (Mirissa, Sri Lanka).
 * Sections:
 * 1. Minimalist luxury hero banner (centered, with logo)
 * 2. Resort highlights strip
 * 3. Our Story
 * 4. Our Philosophy (Mission / Vision / Values cards)
 * 5. The Serenity Experience (4 feature rows)
 * 6. Closing CTA
 */
export default function AboutPage() {
    // Scroll to top and apply dynamic SEO metadata + Hotel JSON-LD schema on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });

        return applyPageSEO({
            title: 'About Us | Serenity Bay Hotel & Resort',
            description:
                'Discover Serenity Bay Hotel & Resort on Beach Road, Mirissa, Sri Lanka. Experience coastal luxury, bespoke suites, fine dining, Ayurveda wellness, and 24/7 concierge care.',
            canonicalPath: '/about',
            jsonLd: {
                '@context': 'https://schema.org',
                '@type': 'Hotel',
                name: 'Serenity Bay Hotel & Resort',
                description:
                    'Luxury coastal hotel & resort in Mirissa, Sri Lanka offering ocean-view suites, fine dining, and holistic spa experiences.',
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Beach Road',
                    addressLocality: 'Mirissa',
                    addressCountry: 'LK',
                },
                telephone: '+94 11 234 5678',
                url: typeof window !== 'undefined' ? `${window.location.origin}/about` : undefined,
            },
        });
    }, []);

    return (
        <main className="min-h-screen bg-[#F7F3E8] text-[#061C2B] font-sans selection:bg-[#C9A24B] selection:text-[#061C2B]">

            {/* ── 1. HERO BANNER — matches OffersPage / FacilitiesPage / RoomsPage style ── */}
            <header
                className="relative h-[450px] md:h-[600px] bg-cover bg-center flex flex-col justify-center px-6 pt-20 md:px-12 md:pt-28"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(6, 59, 50, 0.85) 0%, rgba(6, 59, 50, 0.45) 40%, rgba(6, 59, 50, 0.1) 70%, rgba(6, 59, 50, 0) 90%), url(${hotelLobbyImg})`,
                }}
                role="banner"
                aria-label="About Serenity Bay Hotel & Resort"
            >
                <div className="max-w-7xl mx-auto w-full text-left animate-[fadeInUp_1s_ease-out]">
                    {/* Gold eyebrow label */}
                    <span className="text-[#C5A253] tracking-[0.2em] uppercase text-xs font-bold block mb-2">
                        SERENITY BAY HOTEL &amp; RESORT • MIRISSA
                    </span>

                    {/* Page title */}
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-normal mb-3 md:mb-4">
                        Where <span className="italic text-[#C9A24B]">Serenity</span> Begins
                    </h1>

                    {/* Subtitle */}
                    <p className="text-gray-200 text-xs sm:text-sm md:text-base font-light max-w-xl leading-relaxed">
                        Where Southern Coastal Elegance Meets Effortless<br className="hidden sm:block" />
                        Sri Lankan Hospitality — Est. 2014, Beach Road, Mirissa.
                    </p>
                </div>
            </header>

            {/* ── 2. RESORT HIGHLIGHTS STRIP ─────────────────────────────── */}
            <section
                aria-label="Resort Key Highlights"
                className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 mb-12 relative z-20"
            >
                <div className="bg-[#063B32] border border-[#C9A24B]/40 rounded-2xl px-4 sm:px-6 py-5 sm:py-6 shadow-xl text-white">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {RESORT_HIGHLIGHTS.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={item.label}
                                    className="flex items-center gap-3.5 sm:gap-4 justify-start lg:justify-center"
                                >
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#C9A24B] text-[#061C2B] flex items-center justify-center shrink-0 shadow-md">
                                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </div>
                                    <div>
                                        <p className="font-serif text-xl sm:text-2xl font-normal text-white leading-none">
                                            {item.value}
                                        </p>
                                        <p className="text-[11px] sm:text-xs text-gray-300 font-light mt-1">
                                            {item.label}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── 3. A LEGACY OF SERENITY ────────────────────────────────── */}
            <section className="py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
                    <div className="lg:col-span-6 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#063B32]/10 text-[#063B32] text-xs font-bold tracking-wider uppercase">
                            <Compass className="w-3.5 h-3.5 text-[#b8972e]" /> A Legacy of Serenity
                        </div>
                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#063B32] leading-tight">
                            Crafted for the Discerning Traveler
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
                            Nestled along the golden curve of Beach Road in Mirissa, Serenity Bay Hotel &amp; Resort was
                            born from a singular vision: to create an uncompromised sanctuary where architectural grace
                            meets the rhythm of the Indian Ocean.
                        </p>
                        <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
                            From tranquil sunrise mornings overlooking turquoise waters to intuitive 24/7 concierge
                            care, every detail of our resort is thoughtfully orchestrated to transform each stay into a
                            timeless coastal memory.
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-4">
                            <Link
                                to="/rooms"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="inline-flex items-center gap-2 bg-[#b8972e] hover:bg-[#a68525] text-black text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-md transition"
                            >
                                <span>Explore Suites</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link
                                to="/contact"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="inline-flex items-center gap-2 border border-[#061C2B]/25 hover:border-[#b8972e] text-[#061C2B] hover:text-[#b8972e] text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-xl transition"
                            >
                                <span>Speak with Concierge</span>
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-6 relative">
                        <div className="absolute -inset-3 sm:-inset-4 bg-[#C9A24B]/20 rounded-3xl transform rotate-1 blur-sm" />
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white">
                            <img
                                src={resortExteriorImg}
                                alt="Serenity Bay Resort Coastal View in Mirissa"
                                className="w-full h-[320px] sm:h-[440px] object-cover hover:scale-105 transition duration-700"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 4. OUR PHILOSOPHY ──────────────────────────────────────── */}
            <section className="bg-[#063B32] text-white py-20 sm:py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#C9A24B]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
                        <span className="font-serif text-xs tracking-[0.3em] text-[#C9A24B] font-bold uppercase">
                            Our Core Principles
                        </span>
                        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-white">
                            Our Philosophy
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-300 font-light">
                            Guided by excellence, integrity, and a profound respect for personal relaxation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                        {/* Mission */}
                        <div className="bg-[#061C2B]/85 backdrop-blur-md p-7 sm:p-9 rounded-3xl border border-[#C9A24B]/30 shadow-2xl flex flex-col justify-between hover:border-[#C9A24B] transition duration-300">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-[#C9A24B]/20 flex items-center justify-center text-[#C9A24B] mb-6">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-3 text-white">Our Mission</h3>
                                <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                                    To provide an immaculate coastal sanctuary where warm Sri Lankan hospitality,
                                    world-class amenities, and tranquil oceanfront surroundings deliver unmatched guest
                                    satisfaction.
                                </p>
                            </div>
                            <div className="mt-8 pt-4 border-t border-[#C9A24B]/20 text-[10px] tracking-widest uppercase text-[#C9A24B] font-bold">
                                Excellence in Stay
                            </div>
                        </div>

                        {/* Vision */}
                        <div className="bg-[#061C2B]/85 backdrop-blur-md p-7 sm:p-9 rounded-3xl border border-[#C9A24B]/30 shadow-2xl flex flex-col justify-between hover:border-[#C9A24B] transition duration-300">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-[#C9A24B]/20 flex items-center justify-center text-[#C9A24B] mb-6">
                                    <Compass className="w-6 h-6" />
                                </div>
                                <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-3 text-white">Our Vision</h3>
                                <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                                    To be recognized as Southern Sri Lanka&apos;s premier boutique destination for
                                    travelers seeking authentic luxury, serene seclusion, and impeccable personal
                                    service.
                                </p>
                            </div>
                            <div className="mt-8 pt-4 border-t border-[#C9A24B]/20 text-[10px] tracking-widest uppercase text-[#C9A24B] font-bold">
                                Unrivaled Standard
                            </div>
                        </div>

                        {/* Values */}
                        <div className="bg-[#061C2B]/85 backdrop-blur-md p-7 sm:p-9 rounded-3xl border border-[#C9A24B]/30 shadow-2xl flex flex-col justify-between hover:border-[#C9A24B] transition duration-300">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-[#C9A24B]/20 flex items-center justify-center text-[#C9A24B] mb-6">
                                    <Heart className="w-6 h-6" />
                                </div>
                                <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-3 text-white">Our Values</h3>
                                <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                                    Steeped in grace, coastal sustainability, and absolute discretion. We value genuine
                                    human connections, meticulous attention to detail, and joyful moments for every
                                    visitor.
                                </p>
                            </div>
                            <div className="mt-8 pt-4 border-t border-[#C9A24B]/20 text-[10px] tracking-widest uppercase text-[#C9A24B] font-bold">
                                Grace &amp; Integrity
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 5. THE SERENITY EXPERIENCE ─────────────────────────────── */}
            <section className="py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16 space-y-3">
                    <span className="font-serif text-xs tracking-[0.3em] text-[#C9A24B] font-bold uppercase">
                        Immersive Pleasures
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#063B32]">
                        The Serenity Experience
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 font-light">
                        Every facet of your stay is thoughtfully curated to indulge your senses.
                    </p>
                </div>

                <div className="space-y-12 sm:space-y-16">
                    {/* Row 1: Luxury Accommodation */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-6 rounded-3xl overflow-hidden shadow-xl border border-gray-200">
                            <img
                                src={luxurySuiteImg}
                                alt="Luxury Oceanfront Suites & Villas"
                                className="w-full h-[260px] sm:h-[320px] object-cover hover:scale-105 transition duration-700"
                            />
                        </div>
                        <div className="lg:col-span-6 space-y-4 lg:pl-6">
                            <div className="w-10 h-10 rounded-xl bg-[#C9A24B]/20 flex items-center justify-center text-[#b8972e]">
                                <Bed className="w-5 h-5" />
                            </div>
                            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#063B32]">
                                Luxury Accommodation
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                                Experience ocean-view rooms, suites, and private villas designed with bespoke coastal
                                aesthetics, plush king-sized bedding, and private balconies overlooking the bay.
                            </p>
                            <Link
                                to="/rooms"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#b8972e] hover:text-[#061C2B] transition"
                            >
                                <span>View Rooms &amp; Suites</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Row 2: Fine Dining */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-6 order-2 lg:order-1 space-y-4 lg:pr-6">
                            <div className="w-10 h-10 rounded-xl bg-[#C9A24B]/20 flex items-center justify-center text-[#b8972e]">
                                <Utensils className="w-5 h-5" />
                            </div>
                            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#063B32]">
                                Coastal Fine Dining
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                                Savor culinary creations crafted by master chefs. From freshly caught Mirissa seafood to
                                curated tasting menus and beachfront sunset dining, every meal is unforgettable.
                            </p>
                            <Link
                                to="/offers"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#b8972e] hover:text-[#061C2B] transition"
                            >
                                <span>Explore Dining &amp; Stay Offers</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <div className="lg:col-span-6 order-1 lg:order-2 rounded-3xl overflow-hidden shadow-xl border border-gray-200">
                            <img
                                src={fineDiningImg}
                                alt="Fine Dining at Serenity Bay"
                                className="w-full h-[260px] sm:h-[320px] object-cover hover:scale-105 transition duration-700"
                            />
                        </div>
                    </div>

                    {/* Row 3: Wellness & Spa */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-6 rounded-3xl overflow-hidden shadow-xl border border-gray-200">
                            <img
                                src={spaWellnessImg}
                                alt="Wellness & Ayurveda Spa Sanctuary"
                                className="w-full h-[260px] sm:h-[320px] object-cover hover:scale-105 transition duration-700"
                            />
                        </div>
                        <div className="lg:col-span-6 space-y-4 lg:pl-6">
                            <div className="w-10 h-10 rounded-xl bg-[#C9A24B]/20 flex items-center justify-center text-[#b8972e]">
                                <Waves className="w-5 h-5" />
                            </div>
                            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#063B32]">
                                Wellness &amp; Ayurveda Spa
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                                Rejuvenate body and mind at our holistic sanctuary. Enjoy traditional Ceylon Ayurveda
                                therapies, soothing ocean-breeze massages, and infinity pool relaxation.
                            </p>
                            <Link
                                to="/facilities"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#b8972e] hover:text-[#061C2B] transition"
                            >
                                <span>Discover Resort Facilities</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>

                    {/* Row 4: Concierge & Hospitality */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-6 order-2 lg:order-1 space-y-4 lg:pr-6">
                            <div className="w-10 h-10 rounded-xl bg-[#C9A24B]/20 flex items-center justify-center text-[#b8972e]">
                                <Users className="w-5 h-5" />
                            </div>
                            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#063B32]">
                                24/7 Concierge &amp; Hospitality
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                                Our dedicated hospitality team anticipates every need with genuine warmth—from private
                                airport transfers and whale-watching excursions to bespoke wedding celebrations.
                            </p>
                            <Link
                                to="/contact"
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#b8972e] hover:text-[#061C2B] transition"
                            >
                                <span>Contact Our Concierge</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                        <div className="lg:col-span-6 order-1 lg:order-2 rounded-3xl overflow-hidden shadow-xl border border-gray-200">
                            <img
                                src={hotelLobbyImg}
                                alt="Exceptional Hospitality & Reception"
                                className="w-full h-[260px] sm:h-[320px] object-cover hover:scale-105 transition duration-700"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── 6. CLOSING CTA ─────────────────────────────────────────── */}
            <section className="bg-[#061C2B] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,162,75,0.15)_0,transparent_70%)] pointer-events-none" />

                <div className="max-w-3xl mx-auto relative z-10 space-y-6">
                    <span className="font-serif text-xs tracking-[0.4em] text-[#C9A24B] font-bold uppercase block">
                        Begin Your Escape
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-tight">
                        Your Journey to Serenity Begins Here
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-300 font-light max-w-xl mx-auto">
                        Allow us to welcome you to a world of uncompromising luxury and peaceful coastal elegance in
                        Mirissa.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link
                            to="/availability"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="w-full sm:w-auto bg-[#b8972e] hover:bg-[#a68525] text-black px-8 py-4 rounded-xl text-xs font-bold tracking-widest uppercase transition shadow-lg flex items-center justify-center gap-2"
                        >
                            <span>Check Availability</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/rooms"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="w-full sm:w-auto bg-transparent border-2 border-[#C9A24B] text-[#C9A24B] hover:bg-[#C9A24B]/10 px-8 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase transition flex items-center justify-center gap-2"
                        >
                            <span>Explore Rooms</span>
                        </Link>
                    </div>
                </div>
            </section>

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
