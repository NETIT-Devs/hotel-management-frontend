import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
    ArrowRight,
    ChevronRight,
    ChevronLeft,
    ShieldCheck,
    Calendar,
    Clock,
    BedDouble,
    Utensils,
    Phone,
    Camera,
    Check,
    Sparkles,
    Award,
    Clock3,
    Wifi,
    Wind,
    Waves,
    Car,
    Coffee
} from 'lucide-react';

// Centralized Data Import from hotelData.js
import { OFFERS_DATA as offers } from '../constants/hotelData';
import BookingBar from '../components/BookingBar';
import hotelLobbyImg from '../assets/hotelLobbyImg.webp';

// Helper function to map text features to correct icons dynamically (Included 'wi-fi' with hyphen)
const getFeatureIcon = (featureTitle) => {
    const text = typeof featureTitle === 'string' ? featureTitle.toLowerCase() : '';
    if (text.includes('wifi') || text.includes('wi-fi') || text.includes('internet') || text.includes('connect')) return Wifi;
    if (text.includes('breakfast') || text.includes('food') || text.includes('dining') || text.includes('coffee')) return Utensils;
    if (text.includes('checkout') || text.includes('time') || text.includes('late')) return Clock3;
    if (text.includes('room') || text.includes('stay') || text.includes('accommodation') || text.includes('minimum')) return BedDouble;
    if (text.includes('ac') || text.includes('air') || text.includes('conditioning')) return Wind;
    if (text.includes('pool') || text.includes('swim') || text.includes('beach')) return Waves;
    if (text.includes('parking') || text.includes('car')) return Car;
    return Award;
};

// Other Offer Card Component optimized for Horizontal Scrolling and Accessibility
function OtherOfferCard({ offer }) {
    const displayImage = offer.image || (offer.images && offer.images[0]);
    const navigate = useNavigate();

    return (
        <article
            onClick={() => {
                navigate(`/offers/${offer.id}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    navigate(`/offers/${offer.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }}
            role="link"
            tabIndex={0}
            className="group flex w-[340px] shrink-0 snap-start cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A24B]/70 hover:bg-white/[0.12] hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#C9A24B] sm:w-[380px] md:w-[400px]"
        >
            <div className="relative h-40 w-full overflow-hidden">
                <img
                    src={displayImage}
                    alt={offer.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                />
                <span className="absolute left-3 top-3 rounded-full border border-[#C9A24B]/60 bg-[#061C2B]/80 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-[#C9A24B] backdrop-blur-sm">
                    {offer.category}
                </span>
                <span className="absolute right-3 top-3 rounded-full bg-[#C9A24B] px-2.5 py-1 text-[9px] font-extrabold text-[#063B32] shadow-lg uppercase tracking-wider">
                    {offer.discount}
                </span>
            </div>

            <div className="flex flex-1 flex-col justify-between space-y-3 p-4 text-white">
                <div>
                    <h3 className="font-serif text-xl text-white transition-colors group-hover:text-[#C9A24B] line-clamp-1">{offer.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs font-light leading-relaxed text-gray-300">{offer.description}</p>

                    {offer.originalPrice && offer.discountedPrice && (
                        <div className="mt-3 flex items-baseline justify-between border-t border-white/10 pt-3">
                            <span className="text-xs font-light text-gray-400 line-through">
                                {offer.originalPrice} / night
                            </span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-[10px] text-gray-300">From</span>
                                <span className="text-base font-semibold text-[#C9A24B]">
                                    {offer.discountedPrice}
                                </span>
                                <span className="text-[10px] font-light text-gray-300">/ night</span>
                                <div className="ml-2 flex h-8 w-8 items-center justify-center rounded-full border border-[#C9A24B]/40 transition-all group-hover:border-[#C9A24B] group-hover:bg-[#C9A24B]">
                                    <ArrowRight className="h-3.5 w-3.5 text-[#C9A24B] transition-colors group-hover:text-[#063B32]" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </article>
    );
}

export default function OfferDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const offer = offers.find((item) => String(item.id) === String(id));
    const otherOffers = offers.filter((item) => String(item.id) !== String(id));
    const otherOffersRef = useRef(null);
    const [otherOffersScroll, setOtherOffersScroll] = useState({ left: false, right: false });

    // Image slider state for the main offer image gallery
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Update scroll indicators based on container position
    useEffect(() => {
        const scrollContainer = otherOffersRef.current;
        if (!scrollContainer) return undefined;

        const updateScrollState = () => {
            setOtherOffersScroll({
                left: scrollContainer.scrollLeft > 0,
                right: scrollContainer.scrollLeft + scrollContainer.clientWidth < scrollContainer.scrollWidth - 1
            });
        };

        updateScrollState();
        scrollContainer.addEventListener('scroll', updateScrollState);
        window.addEventListener('resize', updateScrollState);
        return () => {
            scrollContainer.removeEventListener('scroll', updateScrollState);
            window.removeEventListener('resize', updateScrollState);
        };
    }, [otherOffers.length]);

    // Handle smooth horizontal scrolling for secondary offers
    const scrollOtherOffers = (direction) => {
        if (!otherOffersRef.current) return;
        otherOffersRef.current.scrollBy({
            left: direction === 'left' ? -380 : 380,
            behavior: 'smooth'
        });
    };

    if (!offer) {
        return (
            <main className="min-h-[50vh] bg-[#F8F5F0] px-5 py-24 text-center">
                <h1 className="font-serif text-3xl text-[#063B32]">Offer Not Found</h1>
                <p className="mt-4 text-sm text-gray-600">This offer may no longer be available.</p>
                <Link
                    to="/offers"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="mt-6 inline-flex items-center gap-2 bg-[#063B32] px-6 py-3 text-sm text-white rounded-xl"
                >
                    View All Offers <ArrowRight className="h-4 w-4" />
                </Link>
            </main>
        );
    }

    // Handle image list (support single image string or images array)
    const imageList = offer.images && offer.images.length > 0
        ? offer.images
        : [offer.image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1400&q=85'];

    const handlePrevImage = () => {
        setActiveImageIndex((prev) => (prev === 0 ? imageList.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setActiveImageIndex((prev) => (prev === imageList.length - 1 ? 0 : prev + 1));
    };

    return (
        <main className="min-h-screen bg-[#F8F5F0] text-[#063B32] overflow-x-hidden">
            {/* ================= HERO SECTION ================= */}
            <header
                className="relative h-[450px] md:h-[600px] bg-cover bg-center flex flex-col justify-center px-6 pt-20 md:px-12 md:pt-28"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(6, 59, 50, 0.85) 0%, rgba(6, 59, 50, 0.45) 40%, rgba(6, 59, 50, 0.1) 70%, rgba(6, 59, 50, 0) 90%), url(${imageList[0]})`
                }}
                role="banner"
                aria-label="Offer details header"
            >
                <div className="max-w-7xl mx-auto w-full text-left animate-[fadeInUp_1s_ease-out]">
                    <Link
                        to="/offers"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-white hover:text-[#C9A24B] transition-colors mb-4 uppercase cursor-pointer"
                    >
                        <ArrowRight className="w-4 h-4 rotate-180" />
                        <span>Back to Offers</span>
                    </Link>
                    <span className="text-[#C9A24B] tracking-[0.25em] uppercase text-xs font-bold block mb-2">
                        EXCLUSIVE OFFERS / {offer.category}
                    </span>
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-normal mb-3 md:mb-4">
                        {offer.title}
                    </h1>
                    <p className="text-gray-200 text-xs sm:text-sm md:text-base font-light max-w-xl leading-relaxed">
                        {offer.subtitle || 'Create unforgettable moments together at Serenity Bay Resort.'}
                    </p>
                </div>
            </header>

            {/* Booking Bar Component Integration */}
            <div className="w-full max-w-[1350px] mx-auto px-4 -mt-10 md:-mt-14 relative z-20 mb-12">
                <BookingBar />
            </div>

            {/* ================= MAIN CONTENT SECTION (Unified Professional Grid) ================= */}
            <section className="max-w-[1440px] mx-auto px-5 md:px-12 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" aria-label="Offer Booking Section">

                    {/* Left Column: Image Gallery & Thumbnails (Span 5) */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="relative h-[330px] sm:h-[400px] rounded-3xl overflow-hidden bg-gray-100 shadow-xl border border-[#C9A24B]/30">
                            <img
                                src={imageList[activeImageIndex]}
                                alt={`${offer.title} view ${activeImageIndex + 1}`}
                                className="w-full h-full object-cover transition-all duration-500"
                            />
                            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 shadow-md">
                                <Camera className="w-3.5 h-3.5 text-[#C9A24B]" />
                                <span>{activeImageIndex + 1} / {imageList.length}</span>
                            </div>

                            {imageList.length > 1 && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handlePrevImage}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#061C2B]/60 hover:bg-[#061C2B] text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 shadow-md cursor-pointer"
                                        aria-label="Previous image"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNextImage}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#061C2B]/60 hover:bg-[#061C2B] text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 shadow-md cursor-pointer"
                                        aria-label="Next image"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails Grid */}
                        {imageList.length > 1 && (
                            <div className="grid gap-2.5" style={{ gridTemplateColumns: `repeat(${imageList.length}, minmax(0, 1fr))` }}>
                                {imageList.map((img, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`h-16 sm:h-20 rounded-2xl overflow-hidden border-2 cursor-pointer transition shadow-xs ${activeImageIndex === idx ? 'border-[#C9A24B] scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    >
                                        <img src={img} alt="thumb" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Middle & Right Combined Column: Details & Booking Card (Span 7) */}
                    <div className="lg:col-span-7 bg-white rounded-3xl shadow-2xl border border-[#C9A24B]/30 overflow-hidden grid grid-cols-1 md:grid-cols-12">

                        {/* Offer Details Content (Span 7 inside) */}
                        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between relative">
                            {/* Subtle background golden aura */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C9A24B]/5 rounded-full blur-2xl pointer-events-none" aria-hidden="true"></div>

                            <div>
                                {/* Category & Discount Badges */}
                                <div className="flex items-center justify-between mb-4">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C9A24B]/15 px-3.5 py-1 text-[11px] font-bold text-[#063B32] border border-[#C9A24B]/40 uppercase tracking-wider">
                                        <Sparkles className="w-3 h-3 text-[#C9A24B]" aria-hidden="true" /> {offer.category || 'Special Offer'}
                                    </span>
                                    <span className="rounded-full bg-[#C9A24B] px-3.5 py-1 text-xs font-extrabold text-[#063B32] shadow-sm uppercase tracking-wider">
                                        {offer.discount || '15% OFF'}
                                    </span>
                                </div>

                                {/* Title */}
                                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#063B32] mb-3">
                                    {offer.title}
                                </h2>

                                {/* Description (Loaded from longDescription or description) */}
                                <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed mb-6">
                                    {offer.longDescription || offer.description}
                                </p>

                                {/* Redesigned Premium Pricing Box matching Golden Theme */}
                                {offer.originalPrice && offer.discountedPrice && (
                                    <div className="bg-gradient-to-r from-[#FAF8F5] to-white p-4 sm:p-5 rounded-2xl border border-[#C9A24B]/35 mb-6 shadow-md relative overflow-hidden">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-gray-400 font-light line-through">
                                                {offer.originalPrice} / night
                                            </span>
                                            {offer.saveAmount && (
                                                <span className="rounded-lg bg-[#C9A24B]/15 text-[#C9A24B] px-2.5 py-0.5 text-[10px] font-extrabold tracking-wider uppercase shadow-xs">
                                                    {offer.saveAmount}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-baseline justify-between pt-2 border-t border-[#C9A24B]/20">
                                            <span className="text-xs text-[#063B32] font-bold tracking-wider uppercase">Special Rate</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xs text-gray-600">From</span>
                                                <span className="font-serif text-2xl sm:text-3xl font-bold text-[#061C2B]">{offer.discountedPrice}</span>
                                                <span className="text-xs text-gray-600">/ night</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Offer Highlights */}
                            {offer.features && offer.features.length > 0 && (
                                <div className="border-t border-[#C9A24B]/20 pt-5 mt-6">
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#061C2B] mb-4">
                                        Offer Highlights
                                    </h3>
                                    <div className="flex flex-wrap justify-center gap-2.5">
                                        {offer.features.map((feature, idx) => {
                                            const featureTitle = typeof feature === 'string' ? feature : feature.title;
                                            const IconComp = getFeatureIcon(featureTitle);
                                            return (
                                                <div
                                                    key={idx}
                                                    className="flex flex-col items-center justify-between text-center p-3 rounded-2xl bg-[#FAF8F5] border border-[#C9A24B]/30 w-[30%] min-w-[95px] flex-grow transition-all duration-300 hover:border-[#C9A24B] hover:shadow-sm"
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-[#C9A24B]/15 flex items-center justify-center text-[#C9A24B] mb-2 flex-shrink-0" aria-hidden="true">
                                                        <IconComp className="w-4 h-4 text-[#C9A24B]" />
                                                    </div>
                                                    <span className="text-[10px] font-bold text-[#063B32] leading-tight">{featureTitle}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sticky Booking & Lobby Image Section (Span 5 inside) */}
                        <div className="md:col-span-5 bg-[#063B32] text-white flex flex-col justify-between relative border-t md:border-t-0 md:border-l border-[#C9A24B]/30">

                            {/* Upper Part: Booking & Support Content */}
                            <div className="p-6 sm:p-7 relative">
                                <div className="absolute inset-0 opacity-10 bg-cover bg-center pointer-events-none" aria-hidden="true"></div>

                                {/* Limited Time Offer Header */}
                                <div className="flex flex-col items-center text-center mb-6 pb-6 border-b border-[#C9A24B]/30">
                                    <div className="w-11 h-11 rounded-2xl bg-[#C9A24B]/20 flex items-center justify-center text-[#C9A24B] mb-3 shadow-sm" aria-hidden="true">
                                        <Clock className="w-5 h-5 text-[#C9A24B]" />
                                    </div>
                                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A24B] font-extrabold block mb-2">
                                        Limited Time Offer
                                    </span>
                                    <span className="text-xs text-gray-200 font-light block mb-1">Valid until</span>
                                    {/* Improved Date Visibility with Clearer Font Style */}
                                    <div className="flex items-center gap-2 text-white font-serif text-lg font-bold tracking-wide">
                                        <Calendar className="w-4 h-4 text-[#C9A24B]" aria-hidden="true" />
                                        <span>{offer.validUntil || 'Dec 31, 2026'}</span>
                                    </div>
                                </div>

                                {/* Book Offer Button - Changed text case to 'Book offer' (B and O capitalized) */}
                                <button
                                    type="button"
                                    onClick={() => {
                                        navigate('/checkout', { state: { room: offer } });
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="w-full bg-gradient-to-r from-[#C9A24B] to-[#B38E38] text-[#063B32] py-3.5 px-4 rounded-2xl text-xs font-bold hover:opacity-95 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mb-6"
                                    aria-label="Proceed to book this special offer"
                                >
                                    <span className="normal-case font-extrabold text-sm tracking-normal">Book offer</span>
                                    <ArrowRight className="w-4 h-4 text-[#063B32]" aria-hidden="true" />
                                </button>

                                {/* Need Help Section - Enhanced phone number clarity */}
                                <div className="text-center pt-2">
                                    <span className="text-xs text-gray-200 font-light block mb-2">Need Help?</span>
                                    <a
                                        href="tel:+94112345678"
                                        className="font-serif text-base font-bold text-white hover:text-[#C9A24B] transition-colors inline-flex items-center justify-center gap-2 mb-1 whitespace-nowrap"
                                        aria-label="Call hotel support hotline"
                                    >
                                        <div className="w-7 h-7 rounded-lg bg-[#C9A24B]/20 flex items-center justify-center text-[#C9A24B] shrink-0" aria-hidden="true">
                                            <Phone className="w-4 h-4 text-[#C9A24B]" />
                                        </div>
                                        <span className="tracking-wider text-amber-100">+94 11 234 5678</span>
                                    </a>
                                    <p className="text-[11px] text-gray-300 font-medium mt-1">24/7 Assistance</p>
                                </div>
                            </div>

                            {/* Lower Part: Integrated Hotel Lobby Image (Removed text overlay as requested) */}
                            <div className="p-3 pt-0 bg-[#063B32]">
                                <div className="relative h-48 rounded-2xl overflow-hidden shadow-inner">
                                    <img
                                        src={hotelLobbyImg}
                                        alt="Serenity Bay Hotel lobby and reception desk view"
                                        className="w-full h-full object-cover object-center"
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                        </div>

                    </div>

                </div>

                {/* Terms & Conditions Section */}
                {offer.terms && offer.terms.length > 0 && (
                    <div className="max-w-[1440px] mx-auto mt-12 bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#C9A24B]/30">
                        <h3 className="font-serif text-xl font-medium text-[#063B32] mb-5 flex items-center gap-2">
                            <span>Terms &amp; Conditions</span>
                            <span className="h-[1px] flex-1 bg-[#C9A24B]/30 ml-4"></span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-600">
                            {offer.terms.map((term, idx) => (
                                <div key={idx} className="flex items-start gap-2.5">
                                    <div className="w-4 h-4 rounded-full bg-[#C9A24B]/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <Check className="w-2.5 h-2.5 text-[#C9A24B]" />
                                    </div>
                                    <span className="font-light leading-relaxed">{term}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* ================= OTHER OFFERS SECTION ================= */}
            <section
                aria-label="Other Offers"
                className="relative left-1/2 mt-10 w-screen -translate-x-1/2 overflow-hidden bg-[#063B32] px-6 py-16 text-white shadow-2xl md:px-12"
            >
                <div className="relative z-10 mx-auto max-w-7xl space-y-8">
                    <div className="flex flex-col justify-between gap-6 border-b border-[#C9A24B]/25 pb-6 sm:flex-row sm:items-end">
                        <div>
                            <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#C9A24B]">Discover More</span>
                            <h2 className="mt-1 font-serif text-3xl text-white sm:text-4xl">Other Offers</h2>
                            <p className="mt-2 max-w-lg text-xs font-light leading-relaxed text-gray-300">
                                Explore refined packages designed for unforgettable stays at Serenity Bay.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => scrollOtherOffers('left')}
                                aria-label="Previous offers"
                                disabled={!otherOffersScroll.left}
                                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${otherOffersScroll.left
                                        ? 'border-[#C9A24B]/50 text-[#C9A24B] hover:border-[#C9A24B] hover:bg-[#C9A24B] hover:text-[#063B32]'
                                        : 'cursor-not-allowed border-white/20 text-white/30 opacity-50'
                                    }`}
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                type="button"
                                onClick={() => scrollOtherOffers('right')}
                                aria-label="Next offers"
                                disabled={!otherOffersScroll.right}
                                className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${otherOffersScroll.right
                                        ? 'border-[#C9A24B]/50 text-[#C9A24B] hover:border-[#C9A24B] hover:bg-[#C9A24B] hover:text-[#063B32]'
                                        : 'cursor-not-allowed border-white/20 text-white/30 opacity-50'
                                    }`}
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    <div
                        ref={otherOffersRef}
                        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                    >
                        {otherOffers.map((item) => (
                            <OtherOfferCard key={item.id} offer={item} />
                        ))}
                    </div>
                </div>
            </section>

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