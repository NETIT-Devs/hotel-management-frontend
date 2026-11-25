import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
    Calendar,
    Users,
    BedDouble,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    ArrowLeft,
    Sparkles,
    Search,
    Maximize2,
    ShieldCheck,
    Clock,
    Tag,
    X,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { ROOMS_DATA } from '../constants/hotelData';
import { fetchLiveOffers } from '../services/publicHotelService';
import {
    calculateOfferRoomPricing,
    buildCheckoutRoomPayload,
    isRoomEligibleForOffer
} from '../utils/offerPricing';
import {
    CHILD_AGE_OPTIONS,
    extractChildAgesFromRoomsDetails,
    normalizeChildAges,
    evaluateChildPolicy
} from '../utils/childPolicy';
import { applyPageSEO } from '../utils/seo';
import RoomsBanner from '../components/RoomsBanner';
import roomsHeroImg from '../assets/roomsPageHero.webp';

/**
 * AvailabilityPage Component
 * Real-time luxury hotel room availability engine supporting:
 * - Live inventory verification by check-in/check-out dates, guests & room count
 * - Auto-applied Special Offers via URL query (?offerId=) or React Router state
 * - Shareable & auto-applied Promo Codes (?promoCode=) with instant validation
 * - Sri Lankan Resident (NIC) vs. Non-Resident (International) rate switching
 */
export default function AvailabilityPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // Parse optional deep-link parameters (?offerId=...&promoCode=...)
    const offerIdParam = searchParams.get('offerId');
    const promoCodeParam = searchParams.get('promoCode');

    // Format a Date object into YYYY-MM-DD for native date inputs
    const formatIso = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultCheckOut = new Date(today);
    defaultCheckOut.setDate(defaultCheckOut.getDate() + 3);

    const todayIso = formatIso(today);

    // Search & filter state initialized from BookingBar / Room / Offer navigation state
    const initialChildrenCount = Number(location.state?.totalChildren ?? location.state?.children) || 0;
    const initialRawChildAges =
        location.state?.childAges ||
        extractChildAgesFromRoomsDetails(location.state?.roomsDetails);

    const [checkIn, setCheckIn] = useState(location.state?.checkIn || todayIso);
    const [checkOut, setCheckOut] = useState(
        location.state?.checkOut || formatIso(defaultCheckOut)
    );
    const [adults, setAdults] = useState(Number(location.state?.totalAdults ?? location.state?.adults) || 2);
    const [children, setChildren] = useState(initialChildrenCount);
    const [childAges, setChildAges] = useState(() =>
        normalizeChildAges(initialRawChildAges, initialChildrenCount)
    );
    const [roomsCount, setRoomsCount] = useState(Number(location.state?.totalRooms ?? location.state?.roomsCount) || 1);
    const [selectedType, setSelectedType] = useState('ALL');

    // Promotional code validation state
    const [promoCode, setPromoCode] = useState(
        location.state?.promoCode || promoCodeParam || ''
    );
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [promoError, setPromoError] = useState('');
    const [promoLoading, setPromoLoading] = useState(false);

    // Guest residency rate tier state (normalizes both BookingBar & direct route labels)
    const [residency, setResidency] = useState(() => {
        const incoming = String(location.state?.residency || '');
        return incoming === 'Resident' || incoming.toLowerCase().includes('sri lankan')
            ? 'Resident'
            : 'Non-Resident';
    });

    // Active special offer state (persists across direct URL visits & page reloads via ?offerId=)
    const [activeOffer, setActiveOffer] = useState(location.state?.selectedOffer || null);

    // Controls collapsible visibility of non-offer suites during single-room exclusive offers
    const [showOtherRooms, setShowOtherRooms] = useState(false);

    // Highlighted suite ID (from direct Room booking or Offer's linked room_id)
    const stateSelectedRoomId = location.state?.selectedRoomId
        ? Number(location.state.selectedRoomId)
        : null;
    const selectedRoomId =
        stateSelectedRoomId ||
        (activeOffer?.room_id ? Number(activeOffer.room_id) : null);

    const [availabilityData, setAvailabilityData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastChecked, setLastChecked] = useState('');

    // Calculate total length of stay in nights (minimum 1 night)
    const inTime = new Date(checkIn).getTime();
    const outTime = new Date(checkOut).getTime();
    const nights = Math.max(1, Math.round((outTime - inTime) / (1000 * 60 * 60 * 24)) || 1);

    // Evaluate real-world hotel Child Age & Bedding Policy (Infants free, 3-5 free sharing, 6-11 extra bed)
    const childPolicy = evaluateChildPolicy({
        childAges: children > 0 ? normalizeChildAges(childAges, children) : [],
        nights,
        residency,
    });

    // Keep childAges array length synchronized whenever Children dropdown changes
    const handleChildrenCountChange = (nextCount) => {
        const count = Math.max(0, Number(nextCount) || 0);
        setChildren(count);
        setChildAges((prev) => normalizeChildAges(prev, count));
    };

    const handleSingleChildAgeChange = (idx, nextAge) => {
        setChildAges((prev) => {
            const copy = normalizeChildAges(prev, children);
            copy[idx] = nextAge;
            return copy;
        });
    };

    const fetchLiveAvailability = async (customIn = checkIn, customOut = checkOut, customAdults = adults, customChild = children, customRooms = roomsCount) => {
        setLoading(true);
        try {
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const totalGuests = Number(customAdults) + Number(customChild);
            const params = new URLSearchParams({
                checkIn: customIn,
                checkOut: customOut,
                guests: String(totalGuests),
                roomsCount: String(customRooms)
            });

            const res = await fetch(`${API_BASE}/rooms/availability?${params.toString()}`);
            const data = await res.json();

            if (res.ok && Array.isArray(data.rooms) && data.rooms.length > 0) {
                const enriched = data.rooms.map((dbRoom) => {
                    const staticMatch =
                        ROOMS_DATA.find((sr) => Number(sr.id) === Number(dbRoom.id)) ||
                        ROOMS_DATA.find(
                            (sr) => sr.title.toLowerCase() === String(dbRoom.room_name).toLowerCase()
                        ) ||
                        ROOMS_DATA[0];

                    const nightlyRate = Number(dbRoom.price_per_night) || 280;
                    const residentRate =
                        Number(dbRoom.resident_price_per_night) > 0
                            ? Number(dbRoom.resident_price_per_night)
                            : Math.round(nightlyRate * 0.75);
                    const childExtraBedRate =
                        dbRoom.child_extra_bed_price !== null && dbRoom.child_extra_bed_price !== undefined
                            ? Math.max(0, Number(dbRoom.child_extra_bed_price))
                            : 25;
                    const residentChildExtraBedRate =
                        dbRoom.resident_child_extra_bed_price !== null && dbRoom.resident_child_extra_bed_price !== undefined
                            ? Math.max(0, Number(dbRoom.resident_child_extra_bed_price))
                            : 15;

                    return {
                        ...staticMatch,
                        id: dbRoom.id,
                        title: dbRoom.room_name || staticMatch.title,
                        room_type: dbRoom.room_type || 'DELUXE',
                        description: dbRoom.description || staticMatch.description,
                        price: `$${nightlyRate.toFixed(0)}`,
                        price_per_night: nightlyRate,
                        resident_price_per_night: residentRate,
                        child_extra_bed_price: childExtraBedRate,
                        resident_child_extra_bed_price: residentChildExtraBedRate,
                        bed: dbRoom.bed_type || staticMatch.bed || 'King Bed',
                        size: dbRoom.size_sqm ? `${Number(dbRoom.size_sqm)} m²` : staticMatch.size,
                        guests: `${dbRoom.capacity || 2} Guests`,
                        capacity: Number(dbRoom.capacity) || 2,
                        images: dbRoom.image_url ? [dbRoom.image_url, ...(staticMatch.images || [])] : staticMatch.images,
                        status: dbRoom.status || 'ACTIVE',
                        total_units: Number(dbRoom.total_units) || 8,
                        booked_units: Number(dbRoom.booked_units) || 0,
                        available_units: Number(dbRoom.available_units) ?? 8,
                        is_available: Boolean(dbRoom.is_available),
                        meets_capacity: Boolean(dbRoom.meets_capacity)
                    };
                });
                setAvailabilityData(enriched);
            } else {
                // Fallback to static rooms if backend unavailable
                setAvailabilityData(
                    ROOMS_DATA.map((r) => {
                        const base = Number(String(r.price).replace(/[^0-9.]/g, '')) || 280;
                        return {
                            ...r,
                            room_type: r.category?.toUpperCase().includes('SUITE') ? 'SUITE' : 'DELUXE',
                            price_per_night: base,
                            resident_price_per_night: Math.round(base * 0.75),
                            capacity: 2,
                            status: 'ACTIVE',
                            total_units: 8,
                            booked_units: 0,
                            available_units: 8,
                            is_available: true,
                            meets_capacity: true
                        };
                    })
                );
            }
            setLastChecked(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        } catch {
            setAvailabilityData(
                ROOMS_DATA.map((r) => {
                    const base = Number(String(r.price).replace(/[^0-9.]/g, '')) || 280;
                    return {
                        ...r,
                        room_type: 'DELUXE',
                        price_per_night: base,
                        resident_price_per_night: Math.round(base * 0.75),
                        capacity: 2,
                        status: 'ACTIVE',
                        total_units: 8,
                        booked_units: 0,
                        available_units: 8,
                        is_available: true,
                        meets_capacity: true
                    };
                })
            );
        } finally {
            setLoading(false);
        }
    };

    const handleApplyPromo = async (codeOverride) => {
        const clean = String(codeOverride ?? promoCode).trim().toUpperCase();
        if (!clean) {
            setAppliedPromo(null);
            setPromoError('');
            return;
        }
        setPromoLoading(true);
        setPromoError('');
        try {
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_BASE}/promo-codes/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: clean,
                    nights,
                    residency,
                    subtotal: 0
                })
            });
            const data = await res.json();
            if (!res.ok || !data.valid) {
                setAppliedPromo(null);
                setPromoError(data.message || 'Invalid promo code.');
            } else {
                setPromoCode(data.promo.code);
                setAppliedPromo(data.promo);
                setPromoError('');
            }
        } catch {
            setPromoError('Could not validate promo code.');
        } finally {
            setPromoLoading(false);
        }
    };

    // Dynamically update SEO title, meta description & canonical URL
    useEffect(() => {
        const seoTitle = activeOffer
            ? `${activeOffer.title} (${activeOffer.discount}) — Live Availability`
            : 'Check Live Room Availability & Best Rates';
        const seoDesc = activeOffer
            ? `Book ${activeOffer.title} at Serenity Bay Resort with ${activeOffer.discount}. Verify real-time suite availability and instant stay pricing.`
            : 'Check real-time luxury room and suite availability at Serenity Bay Hotel & Resort. Instant stay rates, resident pricing, and best rate guarantee.';
        return applyPageSEO({
            title: seoTitle,
            description: seoDesc,
            canonicalPath: offerIdParam ? `/availability?offerId=${offerIdParam}` : '/availability'
        });
    }, [activeOffer, offerIdParam]);

    // Hydrate active offer if user opened a direct/reloaded ?offerId= URL
    useEffect(() => {
        if (!offerIdParam) return;
        if (activeOffer && String(activeOffer.id) === String(offerIdParam)) return;

        let cancelled = false;
        fetchLiveOffers().then((offers) => {
            if (cancelled || !Array.isArray(offers)) return;
            const matched = offers.find((item) => String(item.id) === String(offerIdParam));
            if (matched) {
                setActiveOffer(matched);
            }
        });
        return () => {
            cancelled = true;
        };
    }, [offerIdParam]);

    // Initial availability check & automatic promo validation on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchLiveAvailability();
        const initialPromo = location.state?.promoCode || promoCodeParam;
        if (initialPromo) {
            handleApplyPromo(initialPromo);
        }
    }, []);

    // Re-validate applied promo code whenever length of stay or guest residency changes
    useEffect(() => {
        if (appliedPromo?.code) {
            handleApplyPromo(appliedPromo.code);
        }
    }, [nights, residency]);

    // Remove the currently applied special offer and clean the ?offerId query parameter
    const handleRemoveOffer = () => {
        setActiveOffer(null);
        setShowOtherRooms(false);
        if (searchParams.has('offerId')) {
            const nextParams = new URLSearchParams(searchParams);
            nextParams.delete('offerId');
            setSearchParams(nextParams, { replace: true });
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchLiveAvailability(checkIn, checkOut, adults, children, roomsCount);
    };

    // Determine whether the active offer is restricted to a single specific room category
    const isExclusiveRoomOffer = Boolean(activeOffer && activeOffer.room_id);

    const filteredRooms = availabilityData.filter((room) => {
        if (selectedType === 'ALL' || isExclusiveRoomOffer) return true;
        return String(room.room_type).toUpperCase() === selectedType;
    });

    const selectedRoomItem = selectedRoomId
        ? availabilityData.find((r) => Number(r.id) === selectedRoomId)
        : null;
    const otherRooms = selectedRoomItem
        ? filteredRooms.filter((r) => Number(r.id) !== selectedRoomId)
        : filteredRooms;

    const offerEligibleRooms = activeOffer
        ? filteredRooms.filter((r) => isRoomEligibleForOffer(r, activeOffer))
        : filteredRooms;
    const availableRoomsCount = isExclusiveRoomOffer
        ? selectedRoomItem?.is_available
            ? 1
            : 0
        : offerEligibleRooms.filter((r) => r.is_available).length;
    const isResident = residency === 'Resident';

    // Resolve the display name of the offer's linked suite (from live rooms or offer metadata)
    const activeOfferRoomLabel =
        (isExclusiveRoomOffer && selectedRoomItem?.title) || activeOffer?.room_name || '';
    const availabilityHeroTitle = activeOffer?.title || 'Check Live Room Availability';
    const availabilityHeroTitleParts = availabilityHeroTitle.trim().split(/\s+/);
    const availabilityHeroAccent = availabilityHeroTitleParts.pop();
    const availabilityHeroTitlePrefix = availabilityHeroTitleParts.join(' ');

    return (
        <main className="min-h-screen bg-[#F8F5F0] text-[#061C2B] overflow-x-hidden">
            {/* ================= HERO BANNER ================= */}
            <header
                className="relative h-[450px] md:h-[600px] bg-cover bg-center flex flex-col justify-center px-6 pt-20 md:px-12 md:pt-28"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(6, 59, 50, 0.85) 0%, rgba(6, 59, 50, 0.45) 40%, rgba(6, 59, 50, 0.1) 70%, rgba(6, 59, 50, 0) 90%), url(${roomsHeroImg})`
                }}
                role="banner"
                aria-label="Live Room Availability Header"
            >
                <div className="max-w-7xl mx-auto w-full text-left animate-[fadeInUp_1s_ease-out]">
                    {activeOffer && (
                        <Link
                            to={`/offers/${activeOffer.id}`}
                            className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-white/90 hover:text-[#C9A24B] transition mb-3"
                            aria-label={`Return to ${activeOffer.title} offer details`}
                        >
                            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>Back to Offer Details</span>
                        </Link>
                    )}
                    <span className="text-[#C9A24B] tracking-[0.25em] uppercase text-[11px] sm:text-xs font-bold block mb-2">
                        {activeOffer ? `SPECIAL OFFER · ${activeOffer.discount}` : 'REAL-TIME RESERVATION ENGINE'}
                    </span>
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-normal mb-3 md:mb-4">
                        {activeOffer ? (
                            <>
                                {availabilityHeroTitlePrefix}{availabilityHeroTitlePrefix && ' '}
                                <span className="italic text-[#C9A24B]">{availabilityHeroAccent}</span>
                            </>
                        ) : (
                            <>
                                Check Live<br />
                                Room <span className="italic text-[#C9A24B]">Availability</span>
                            </>
                        )}
                    </h1>
                    <p className="text-gray-200 text-xs sm:text-sm md:text-base font-light max-w-xl leading-relaxed">
                        {isExclusiveRoomOffer
                            ? 'Step 2 of 3: Choose your check-in and check-out dates below to verify live availability for your offer suite and proceed to checkout.'
                            : activeOffer
                            ? 'Step 2 of 3: Choose your dates below and select any eligible suite — your exclusive offer discount is already applied.'
                            : 'Select your preferred check-in and check-out dates to view real-time suite inventory, instant total stay rates, and reserve your coastal sanctuary.'}
                    </p>
                </div>
            </header>

            {/* ================= LIVE AVAILABILITY SEARCH BAR ================= */}
            <section
                className="max-w-7xl mx-auto px-4 sm:px-6 -mt-14 relative z-20 mb-8 md:mb-10"
                aria-label="Room Availability Search Form"
            >
                <form
                    onSubmit={handleSearchSubmit}
                    className="bg-white rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl border border-[#C9A24B]/40"
                >
                    {/* Step 1 + Residency Switcher Row */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 mb-5 border-b border-gray-100">
                        <nav
                            aria-label="Reservation Progress"
                            className="flex flex-wrap items-center gap-2 text-[11px] font-semibold"
                        >
                            {activeOffer ? (
                                <>
                                    <span className="bg-[#C9A24B] text-[#063B32] px-3 py-1 rounded-full font-extrabold">
                                        1. Offer Auto-Applied
                                    </span>
                                    <span className="text-gray-400" aria-hidden="true">→</span>
                                    <span className="bg-[#063B32] text-[#C9A24B] px-3 py-1 rounded-full">
                                        2. Check Dates &amp; Select Suite
                                    </span>
                                    <span className="text-gray-400" aria-hidden="true">→</span>
                                    <span className="bg-[#FAF8F5] text-gray-500 border border-gray-200 px-3 py-1 rounded-full">
                                        3. Confirm &amp; Checkout
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span className="bg-[#063B32] text-[#C9A24B] px-3 py-1 rounded-full">
                                        1. Select Dates &amp; Residency
                                    </span>
                                    <span className="text-gray-400" aria-hidden="true">→</span>
                                    <span className="bg-[#FAF8F5] text-[#061C2B] border border-[#C9A24B]/30 px-3 py-1 rounded-full">
                                        2. Verify Live Availability
                                    </span>
                                    <span className="text-gray-400" aria-hidden="true">→</span>
                                    <span className="bg-[#FAF8F5] text-gray-500 border border-gray-200 px-3 py-1 rounded-full">
                                        3. Confirm &amp; Checkout
                                    </span>
                                </>
                            )}
                        </nav>

                        {/* Resident vs Non-Resident Toggle */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                Guest Residency:
                            </span>
                            <div
                                className="inline-flex bg-[#FAF8F5] p-1 rounded-xl border border-[#C9A24B]/35 w-full sm:w-auto"
                                role="group"
                                aria-label="Guest Residency Rate Selector"
                            >
                                <button
                                    type="button"
                                    onClick={() => setResidency('Non-Resident')}
                                    aria-pressed={residency === 'Non-Resident'}
                                    className={`flex-1 sm:flex-none px-3 sm:px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer ${
                                        residency === 'Non-Resident'
                                            ? 'bg-[#063B32] text-[#C9A24B] shadow-sm'
                                            : 'text-gray-600 hover:text-[#061C2B]'
                                    }`}
                                >
                                    Non-Resident (Intl)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setResidency('Resident')}
                                    aria-pressed={residency === 'Resident'}
                                    className={`flex-1 sm:flex-none px-3 sm:px-3.5 py-1.5 rounded-lg text-[11px] sm:text-xs font-bold transition cursor-pointer ${
                                        residency === 'Resident'
                                            ? 'bg-[#063B32] text-[#C9A24B] shadow-sm'
                                            : 'text-gray-600 hover:text-[#061C2B]'
                                    }`}
                                >
                                    Sri Lankan (NIC)
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Active Special Offer Banner (Auto-Applied from Offers / OfferDetails / URL) */}
                    {activeOffer && (
                        <div
                            role="status"
                            aria-live="polite"
                            className="mb-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#063B32] via-[#07473c] to-[#063B32] text-white border border-[#C9A24B]/60 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                            <div className="flex items-start sm:items-center gap-3.5">
                                {activeOffer.images?.[0] || activeOffer.image ? (
                                    <img
                                        src={activeOffer.images?.[0] || activeOffer.image}
                                        alt={activeOffer.title}
                                        className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-[#C9A24B]/60 shrink-0 shadow-md"
                                    />
                                ) : (
                                    <div
                                        className="w-12 h-12 rounded-xl bg-[#C9A24B]/20 border border-[#C9A24B]/50 flex items-center justify-center shrink-0"
                                        aria-hidden="true"
                                    >
                                        <Sparkles className="w-5 h-5 text-[#C9A24B]" />
                                    </div>
                                )}
                                <div>
                                    <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#C9A24B]">
                                            SPECIAL OFFER APPLIED
                                        </span>
                                        <span className="bg-[#C9A24B] text-[#063B32] text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                                            {activeOffer.discount || 'EXCLUSIVE'}
                                        </span>
                                        {activeOffer.validUntil && (
                                            <span className="text-[10px] text-gray-300 font-medium">
                                                Valid until {activeOffer.validUntil}
                                            </span>
                                        )}
                                    </div>
                                    <h2 className="font-serif text-lg sm:text-xl font-medium text-white leading-snug">
                                        {activeOffer.title}
                                    </h2>
                                    <p className="text-[11px] sm:text-xs text-gray-200 font-light mt-0.5 leading-relaxed">
                                        {isExclusiveRoomOffer && activeOfferRoomLabel
                                            ? `Included Suite: ${activeOfferRoomLabel} — Choose your stay dates below and click "Book with Offer".`
                                            : 'Valid on all eligible suites below — Choose your stay dates and select your preferred suite to reserve with this discount.'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5 self-start md:self-center shrink-0">
                                <Link
                                    to={`/offers/${activeOffer.id}`}
                                    className="text-[11px] font-bold text-[#C9A24B] hover:underline px-2 py-1.5"
                                >
                                    Offer Terms
                                </Link>
                                <button
                                    type="button"
                                    onClick={handleRemoveOffer}
                                    className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-xl text-[11px] font-bold transition cursor-pointer"
                                    aria-label={`Exit ${activeOffer.title} offer and view standard room rates`}
                                >
                                    <X className="w-3.5 h-3.5" aria-hidden="true" />
                                    <span>Exit Offer</span>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
                        {/* Check-in */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                                Check-In Date
                            </label>
                            <div className="relative">
                                <Calendar className="w-4 h-4 text-[#C9A24B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="date"
                                    min={todayIso}
                                    value={checkIn}
                                    onChange={(e) => {
                                        const nextIn = e.target.value;
                                        setCheckIn(nextIn);
                                        if (checkOut <= nextIn) {
                                            const d = new Date(nextIn);
                                            d.setDate(d.getDate() + 1);
                                            setCheckOut(formatIso(d));
                                        }
                                    }}
                                    className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl pl-10 pr-3 py-3 text-xs font-semibold text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                                />
                            </div>
                        </div>

                        {/* Check-out */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                                Check-Out Date
                            </label>
                            <div className="relative">
                                <Calendar className="w-4 h-4 text-[#C9A24B] absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="date"
                                    min={checkIn || todayIso}
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl pl-10 pr-3 py-3 text-xs font-semibold text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                                />
                            </div>
                        </div>

                        {/* Rooms Count */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                                Rooms Needed
                            </label>
                            <select
                                value={roomsCount}
                                onChange={(e) => setRoomsCount(Number(e.target.value))}
                                className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl px-3.5 py-3 text-xs font-semibold text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                            >
                                {[1, 2, 3, 4, 5].map((n) => (
                                    <option key={n} value={n}>
                                        {n} {n === 1 ? 'Room' : 'Rooms'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Adults */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                                Adults (13+)
                            </label>
                            <select
                                value={adults}
                                onChange={(e) => setAdults(Number(e.target.value))}
                                className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl px-3.5 py-3 text-xs font-semibold text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                            >
                                {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                                    <option key={n} value={n}>
                                        {n} {n === 1 ? 'Adult' : 'Adults'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Children (0-11 yrs) */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                                Children (0-11)
                            </label>
                            <select
                                value={children}
                                onChange={(e) => handleChildrenCountChange(e.target.value)}
                                aria-label="Number of children aged 0 to 11"
                                className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl px-3.5 py-3 text-xs font-semibold text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                            >
                                {[0, 1, 2, 3, 4, 5, 6].map((n) => (
                                    <option key={n} value={n}>
                                        {n} {n === 1 ? 'Child' : 'Children'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#C9A24B] to-[#b49147] text-[#061C2B] py-3 px-5 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:opacity-95 transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Search className="w-4 h-4" />
                                <span>Check Now</span>
                            </button>
                        </div>
                    </div>

                    {/* Interactive Child Ages & Luxury Bedding Policy Bar (Appears whenever Children > 0) */}
                    {children > 0 && (
                        <div
                            className="mt-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#C9A24B]/35 space-y-3"
                            aria-label="Child Ages and Bedding Policy"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#063B32]">
                                    Specify Child Ages (Determines Baby Cot &amp; Extra Bed Policy)
                                </span>
                                <span className="text-[10.5px] text-gray-600 font-medium">
                                    0–2 yrs: Free Baby Cot · 3–5 yrs: Free Sharing Bed · 6–11 yrs: Suite Extra Bed rate (Kids Stay Free in Family Suites)
                                </span>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                                {normalizeChildAges(childAges, children).map((ageVal, idx) => (
                                    <div key={idx}>
                                        <label
                                            htmlFor={`avail-child-age-${idx}`}
                                            className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1"
                                        >
                                            Child {idx + 1} Age
                                        </label>
                                        <select
                                            id={`avail-child-age-${idx}`}
                                            value={ageVal}
                                            onChange={(e) => handleSingleChildAgeChange(idx, e.target.value)}
                                            className="w-full bg-white border border-[#C9A24B]/40 rounded-xl px-2.5 py-2 text-xs font-semibold text-[#061C2B] focus:outline-none focus:border-[#063B32]"
                                        >
                                            {CHILD_AGE_OPTIONS.map((opt) => (
                                                <option key={opt} value={opt}>
                                                    {opt === 'Under 1' ? 'Under 1 yr (Infant)' : `${opt} ${opt === '1' ? 'yr' : 'yrs'}`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>

                            {childPolicy.housekeepingSummary && (
                                <p className="text-[11px] text-[#063B32] font-semibold flex flex-wrap items-center gap-1.5 pt-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" aria-hidden="true" />
                                    <span>Room Bedding Setup: {childPolicy.housekeepingSummary}</span>
                                    {childPolicy.childSupplementTotal > 0 && (
                                        <span className="text-[#8a6414] font-bold">
                                            (+$
                                            {childPolicy.childSupplementTotal.toLocaleString()} for {nights}{' '}
                                            {nights === 1 ? 'night' : 'nights'})
                                        </span>
                                    )}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Summary Strip inside Search Box */}
                    <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-600">
                        <div className="flex flex-wrap items-center gap-4">
                            <span className="inline-flex items-center gap-1.5 font-semibold text-[#063B32] bg-[#063B32]/10 px-3 py-1 rounded-full">
                                <Clock className="w-3.5 h-3.5 text-[#C9A24B]" />
                                {nights} {nights === 1 ? 'Night' : 'Nights'} Stay ({checkIn} → {checkOut})
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Users className="w-3.5 h-3.5 text-[#C9A24B]" />
                                {adults + children} Total Guests · {roomsCount} {roomsCount === 1 ? 'Room' : 'Rooms'}
                            </span>
                            {/* Interactive Promo Code Box */}
                            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                                <div className="relative flex items-center flex-1 sm:flex-initial">
                                    <Tag className="w-3.5 h-3.5 text-[#C9A24B] absolute left-2.5" aria-hidden="true" />
                                    <input
                                        type="text"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                                        placeholder="Promo code (e.g. SERENITY20)"
                                        aria-label="Enter promotional code"
                                        className="bg-[#FAF8F5] border border-gray-200 rounded-lg pl-8 pr-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#061C2B] focus:outline-none focus:border-[#C9A24B] w-full sm:w-48"
                                    />
                                </div>
                                <button
                                    type="button"
                                    disabled={promoLoading}
                                    onClick={() => handleApplyPromo(promoCode)}
                                    className="bg-[#063B32] text-[#C9A24B] px-3 py-1.5 rounded-lg text-[11px] font-bold hover:opacity-95 cursor-pointer"
                                >
                                    {promoLoading ? '...' : 'Apply'}
                                </button>
                                {appliedPromo && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAppliedPromo(null);
                                            setPromoCode('');
                                            setPromoError('');
                                        }}
                                        className="text-[11px] text-red-600 font-bold hover:underline cursor-pointer"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>

                        {appliedPromo && (
                            <div className="w-full mt-2 px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                                <span>
                                    Promo &quot;{appliedPromo.code}&quot; applied —{' '}
                                    {appliedPromo.discount_type === 'PERCENTAGE'
                                        ? `${appliedPromo.discount_value}% OFF`
                                        : `$${appliedPromo.discount_value} OFF`}{' '}
                                    ({appliedPromo.title})
                                </span>
                            </div>
                        )}
                        {promoError && (
                            <div className="w-full mt-2 px-3.5 py-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] font-semibold flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 shrink-0" />
                                <span>{promoError}</span>
                            </div>
                        )}

                        {/* Room Type Filter Pills (Hidden during single-room exclusive offers to keep UI focused) */}
                        {!isExclusiveRoomOffer && (
                            <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Filter suites by room type">
                                {['ALL', 'DELUXE', 'SUITE', 'FAMILY'].map((type) => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setSelectedType(type)}
                                        aria-pressed={selectedType === type}
                                        className={`px-3.5 py-1.5 rounded-full text-[11px] font-bold transition cursor-pointer ${
                                            selectedType === type
                                                ? 'bg-[#063B32] text-[#C9A24B]'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        {type === 'ALL' ? 'All Suites' : type}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </form>
            </section>

            {/* ================= RESULTS HEADER ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 pb-6" aria-label="Availability Status Summary">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#063B32] text-white px-5 sm:px-6 py-4 rounded-2xl border border-[#C9A24B]/30 shadow-md">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#C9A24B] shrink-0" aria-hidden="true" />
                        <div>
                            <h2 className="font-serif text-base sm:text-xl font-normal">
                                {loading
                                    ? 'Checking real-time room inventory...'
                                    : isExclusiveRoomOffer
                                    ? availableRoomsCount > 0
                                        ? `Exclusive Offer Suite Available for Your Dates`
                                        : `Exclusive Offer Suite Unavailable for Selected Dates`
                                    : activeOffer
                                    ? `${availableRoomsCount} of ${offerEligibleRooms.length} Offer-Eligible Suites Available`
                                    : `${availableRoomsCount} of ${filteredRooms.length} Room Categories Available for Your Dates`}
                            </h2>
                            <p className="text-[11px] text-gray-300 font-light">
                                {isExclusiveRoomOffer
                                    ? availableRoomsCount > 0
                                        ? `${activeOffer.discount || 'Special rate'} locked in for ${nights} ${nights === 1 ? 'night' : 'nights'} · Verified ${lastChecked ? `at ${lastChecked}` : 'live'}`
                                        : 'Try adjusting your check-in / check-out dates above or view other suites below.'
                                    : activeOffer
                                    ? `Select any suite below to reserve with ${activeOffer.discount || 'your special offer'} auto-applied ${lastChecked ? `· Verified at ${lastChecked}` : ''}`
                                    : `Live inventory verified against current hotel reservations ${lastChecked ? `at ${lastChecked}` : ''}`}
                            </p>
                        </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#C9A24B] uppercase tracking-widest shrink-0">
                        {activeOffer ? `${activeOffer.discount || 'OFFER RATE'}` : 'Best Rate Guaranteed'}
                    </span>
                </div>
            </section>

            {/* ================= AVAILABILITY CARDS ================= */}
            <section
                className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 pb-20"
                aria-label="Available Rooms and Suites"
            >
                {loading ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-md border border-[#C9A24B]/20">
                        <p className="text-sm text-gray-500">Checking live room availability for {checkIn} to {checkOut}...</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {(() => {
                            /**
                             * Renders a single responsive room availability card with
                             * residency pricing, auto-applied offer savings, promo discounts, and checkout CTA.
                             */
                            const renderRoomCard = (room, isHighlighted = false) => {
                                // Compute base vs. offer-discounted nightly rates via shared pricing engine
                                const offerPricing = calculateOfferRoomPricing({
                                    room,
                                    offer: activeOffer,
                                    isResident
                                });
                                const isOfferEligible = isRoomEligibleForOffer(room, activeOffer);
                                const regularRate = Number(room.price_per_night) || 280;
                                const activeRate = offerPricing.finalNightlyRate;
                                // Evaluate per-room child extra bed rate (supports $0 Kids Stay Free on Family Suites)
                                const roomChildPolicy = evaluateChildPolicy({
                                    childAges: children > 0 ? normalizeChildAges(childAges, children) : [],
                                    nights,
                                    residency,
                                    childExtraBedPrice: room.child_extra_bed_price,
                                    residentChildExtraBedPrice: room.resident_child_extra_bed_price,
                                });
                                const childBedSupplement = roomChildPolicy.childSupplementTotal;
                                const preOfferStayTotal =
                                    offerPricing.preOfferNightlyRate * nights * roomsCount + childBedSupplement;
                                const rawStayTotal =
                                    activeRate * nights * roomsCount + childBedSupplement;
                                const totalOfferSavings = Math.max(
                                    0,
                                    (offerPricing.preOfferNightlyRate - activeRate) * nights * roomsCount
                                );

                                // Compute stackable promo code discount on top of discounted room + bedding subtotal
                                let roomPromoDiscount = 0;
                                if (appliedPromo) {
                                    const roomOk =
                                        !appliedPromo.applicable_room_id ||
                                        Number(appliedPromo.applicable_room_id) === Number(room.id);
                                    const spendOk =
                                        !appliedPromo.min_amount ||
                                        rawStayTotal >= Number(appliedPromo.min_amount);
                                    if (roomOk && spendOk) {
                                        if (appliedPromo.discount_type === 'PERCENTAGE') {
                                            roomPromoDiscount = (rawStayTotal * Number(appliedPromo.discount_value)) / 100;
                                            if (appliedPromo.max_discount) {
                                                roomPromoDiscount = Math.min(roomPromoDiscount, Number(appliedPromo.max_discount));
                                            }
                                        } else {
                                            roomPromoDiscount = Math.min(Number(appliedPromo.discount_value), rawStayTotal);
                                        }
                                        roomPromoDiscount = Math.round(roomPromoDiscount);
                                    }
                                }

                                const totalStayPrice = Math.max(0, rawStayTotal - roomPromoDiscount);
                                const isAvailable = room.is_available;
                                const isLowStock = isAvailable && room.available_units <= 3;

                                // Infant- & extra-bed-aware capacity check:
                                // Infants (0-2) do not consume adult bed capacity; up to 1 child (3-11) per room shares/uses extra bed.
                                const baseCapacity = (Number(room.capacity) || 2) * roomsCount;
                                const nonInfantGuests = Math.max(adults, adults + children - childPolicy.infantCount);
                                const maxAllowedWithChildBedding =
                                    children > 0 ? baseCapacity + roomsCount : baseCapacity;
                                const exceedsCapacity =
                                    adults > baseCapacity || nonInfantGuests > maxAllowedWithChildBedding;

                                // Show struck-through comparison rate when Offer or Resident discount lowers price
                                const strikeRate = offerPricing.isOfferApplied
                                    ? offerPricing.preOfferNightlyRate
                                    : isResident && regularRate > activeRate
                                    ? regularRate
                                    : null;

                                return (
                                    <article
                                        key={`${isHighlighted ? 'selected-' : ''}${room.id}`}
                                        className={`bg-white rounded-3xl overflow-hidden shadow-md border transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 ${
                                            isHighlighted
                                                ? 'border-2 border-[#C9A24B] shadow-2xl ring-4 ring-[#C9A24B]/15'
                                                : isAvailable
                                                ? 'border-[#C9A24B]/35 hover:shadow-xl'
                                                : 'border-gray-200 opacity-85'
                                        }`}
                                    >
                                        {/* Room Image Column (4 Cols) */}
                                        <div className="lg:col-span-4 relative min-h-[220px] sm:min-h-[250px] bg-gray-100">
                                            <img
                                                src={room.images?.[0] || roomsHeroImg}
                                                alt={`${room.title} luxury accommodation at Serenity Bay Resort`}
                                                loading="lazy"
                                                className="w-full h-full object-cover"
                                            />
                                            <span className="absolute top-4 left-4 bg-[#061C2B]/85 text-[#C9A24B] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                                                {isHighlighted && activeOffer && isOfferEligible
                                                    ? 'OFFER ELIGIBLE SUITE'
                                                    : isHighlighted
                                                    ? 'YOUR SELECTED SUITE'
                                                    : room.room_type}
                                            </span>

                                            {/* Special Offer Discount Pill on Image */}
                                            {offerPricing.isOfferApplied && (
                                                <span className="absolute top-4 right-4 bg-[#C9A24B] text-[#063B32] text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full shadow-lg">
                                                    {offerPricing.discountLabel}
                                                </span>
                                            )}

                                            {/* Live Inventory Status Pill */}
                                            <span
                                                className={`absolute bottom-4 left-4 px-3.5 py-1.5 rounded-full text-xs font-extrabold shadow-md flex items-center gap-1.5 ${
                                                    !isAvailable
                                                        ? 'bg-red-600 text-white'
                                                        : isLowStock
                                                        ? 'bg-[#C9A24B] text-[#061C2B]'
                                                        : 'bg-[#063B32] text-white'
                                                }`}
                                            >
                                                {isAvailable ? (
                                                    <>
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A24B]" aria-hidden="true" />
                                                        <span>
                                                            {room.available_units} {room.available_units === 1 ? 'Room' : 'Rooms'} Available
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle className="w-3.5 h-3.5" aria-hidden="true" />
                                                        <span>
                                                            {room.status === 'MAINTENANCE' ? 'Under Maintenance' : 'Sold Out for Selected Dates'}
                                                        </span>
                                                    </>
                                                )}
                                            </span>
                                        </div>

                                        {/* Room Details Column (5 Cols) */}
                                        <div className="lg:col-span-5 p-5 sm:p-7 flex flex-col justify-between">
                                            <div>
                                                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#061C2B]">
                                                        {room.title}
                                                    </h3>
                                                    {offerPricing.isOfferApplied && (
                                                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#063B32] bg-[#C9A24B]/20 border border-[#C9A24B]/40 px-2.5 py-1 rounded-full">
                                                            <Sparkles className="w-3 h-3 text-[#C9A24B]" aria-hidden="true" />
                                                            Offer Applied
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed mb-4">
                                                    {room.description}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-gray-700 py-3 border-y border-gray-100 mb-4">
                                                    <span className="flex items-center gap-1.5">
                                                        <BedDouble className="w-4 h-4 text-[#C9A24B]" aria-hidden="true" /> {room.bed}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Users className="w-4 h-4 text-[#C9A24B]" aria-hidden="true" /> Up to {room.capacity} Guests / Room
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Maximize2 className="w-4 h-4 text-[#C9A24B]" aria-hidden="true" /> {room.size}
                                                    </span>
                                                </div>

                                                {exceedsCapacity && isAvailable && (
                                                    <div className="mb-3 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold flex items-center gap-2">
                                                        <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                                                        <span>
                                                            {roomsCount} {roomsCount === 1 ? 'room' : 'rooms'} holds up to {room.capacity * roomsCount} guests. Increase &quot;Rooms Needed&quot; above for {adults + children} guests.
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="flex flex-wrap gap-2">
                                                    {(room.amenities || ['Ocean View', 'Free Wi-Fi', 'Air Conditioning']).map((am, i) => (
                                                        <span
                                                            key={i}
                                                            className="text-[11px] bg-[#FAF8F5] text-[#061C2B] px-3 py-1 rounded-lg border border-[#C9A24B]/30 font-medium"
                                                        >
                                                            {am}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                                                <Link
                                                    to={`/rooms/${room.id}`}
                                                    className="font-bold text-[#C9A24B] hover:underline inline-flex items-center gap-1"
                                                >
                                                    <span>View Room Details &amp; Gallery</span>
                                                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                                                </Link>
                                                <span className="text-gray-400">
                                                    Total Inventory: {room.total_units} rooms
                                                </span>
                                            </div>
                                        </div>

                                        {/* Rate & Checkout CTA Column (3 Cols) */}
                                        <div className="lg:col-span-3 bg-[#FAF8F5] p-5 sm:p-7 border-t lg:border-t-0 lg:border-l border-[#C9A24B]/25 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                                        {offerPricing.isOfferApplied
                                                            ? 'Special Offer Rate'
                                                            : isResident
                                                            ? 'Sri Lankan Resident Rate'
                                                            : 'Non-Resident Rate'}
                                                    </span>
                                                    {isResident && (
                                                        <span className="text-[10px] font-bold bg-[#063B32] text-[#C9A24B] px-2 py-0.5 rounded-full">
                                                            LOCAL RATE
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-baseline gap-2 mt-1 flex-wrap">
                                                    {strikeRate && strikeRate > activeRate && (
                                                        <span className="text-sm text-gray-400 line-through">
                                                            ${strikeRate}
                                                        </span>
                                                    )}
                                                    <span className="font-serif text-2xl font-bold text-[#061C2B]">
                                                        ${activeRate}
                                                    </span>
                                                    <span className="text-xs text-gray-500">/ night</span>
                                                </div>

                                                {offerPricing.isOfferApplied && (
                                                    <span className="inline-block mt-1.5 text-[10px] font-extrabold text-[#063B32] bg-[#C9A24B]/25 px-2.5 py-0.5 rounded-md">
                                                        Save ${offerPricing.perNightSavings}/night ({offerPricing.discountLabel})
                                                    </span>
                                                )}

                                                <div className="mt-4 p-3.5 bg-white rounded-2xl border border-[#C9A24B]/30">
                                                    <span className="text-[10px] uppercase tracking-wider text-gray-400 block">
                                                        Estimated Stay Total ({nights} {nights === 1 ? 'Night' : 'Nights'} · {roomsCount} {roomsCount === 1 ? 'Room' : 'Rooms'})
                                                    </span>
                                                    <div className="flex items-baseline gap-2 mt-0.5">
                                                        {totalOfferSavings > 0 && (
                                                            <span className="text-xs text-gray-400 line-through">
                                                                ${preOfferStayTotal.toLocaleString()}
                                                            </span>
                                                        )}
                                                        <span className="font-serif text-2xl font-bold text-[#063B32]">
                                                            ${totalStayPrice.toLocaleString()}
                                                        </span>
                                                    </div>
                                                    {totalOfferSavings > 0 && (
                                                        <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">
                                                            Offer savings: -${totalOfferSavings.toLocaleString()}
                                                        </span>
                                                    )}
                                                    {childBedSupplement > 0 && (
                                                        <span className="text-[10px] font-bold text-[#063B32] block mt-0.5">
                                                            Includes Extra Child Bed (+${childBedSupplement.toLocaleString()} · ${roomChildPolicy.ratePerExtraBedNight}/night)
                                                        </span>
                                                    )}
                                                    {children > 0 && childBedSupplement === 0 && (
                                                        <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">
                                                            {roomChildPolicy.olderChildCount > 0
                                                                ? 'Kids Stay Free in this Suite (Complimentary Extra Bed)'
                                                                : roomChildPolicy.infantCount > 0
                                                                ? 'Infant stays free · Baby cot available'
                                                                : 'Child stays free (sharing bedding)'}
                                                        </span>
                                                    )}
                                                    {roomPromoDiscount > 0 && (
                                                        <span className="text-[10px] font-bold text-[#C9A24B] block mt-0.5">
                                                            Includes {appliedPromo.code} (-${roomPromoDiscount})
                                                        </span>
                                                    )}
                                                    <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
                                                        <ShieldCheck className="w-3 h-3 text-[#C9A24B]" aria-hidden="true" />
                                                        {isResident ? 'Valid Sri Lankan NIC required at check-in' : 'Free cancellation (24h)'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-5">
                                                {isAvailable ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const checkoutRoom = buildCheckoutRoomPayload({
                                                                room,
                                                                offer: activeOffer,
                                                                pricing: offerPricing
                                                            });
                                                            navigate('/checkout', {
                                                                state: {
                                                                    room: checkoutRoom,
                                                                    checkIn,
                                                                    checkOut,
                                                                    adults: String(adults),
                                                                    children: String(children),
                                                                    childAges: childPolicy.normalizedAges,
                                                                    roomsCount: String(roomsCount),
                                                                    residency,
                                                                    promoCode: appliedPromo?.code || ''
                                                                }
                                                            });
                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        }}
                                                        aria-label={
                                                            offerPricing.isOfferApplied
                                                                ? `Book ${room.title} with ${activeOffer.title} offer`
                                                                : `Proceed to checkout for ${room.title}`
                                                        }
                                                        className="w-full bg-gradient-to-r from-[#C9A24B] to-[#b49147] text-[#061C2B] py-3.5 px-5 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:opacity-95 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                                                    >
                                                        <span>
                                                            {offerPricing.isOfferApplied ? 'Book with Offer' : 'Proceed to Checkout'}
                                                        </span>
                                                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        disabled
                                                        className="w-full bg-gray-200 text-gray-500 py-3.5 px-5 rounded-xl text-xs font-bold uppercase tracking-wider cursor-not-allowed"
                                                    >
                                                        Unavailable for Dates
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                );
                            };

                            return (
                                <>
                                    {/* Highlighted / Offer-Eligible Primary Suite */}
                                    {selectedRoomItem && (
                                        <div className="space-y-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#063B32]">
                                                    {isExclusiveRoomOffer
                                                        ? `Included Offer Suite — ${selectedRoomItem.title}`
                                                        : activeOffer && isRoomEligibleForOffer(selectedRoomItem, activeOffer)
                                                        ? `Featured Offer Suite — ${activeOffer.title}`
                                                        : 'Your Selected Room'}
                                                </h3>
                                                <span className="text-xs text-gray-500">
                                                    {selectedRoomItem.is_available
                                                        ? isExclusiveRoomOffer
                                                            ? 'Click "Book with Offer" to proceed to checkout'
                                                            : 'Ready to reserve for your dates'
                                                        : 'Sold out for these dates — adjust dates or compare other suites below'}
                                                </span>
                                            </div>
                                            {renderRoomCard(selectedRoomItem, true)}
                                        </div>
                                    )}

                                    {/* Collapsible Non-Offer Suites Toggle (Exclusive Room Offer Mode) */}
                                    {isExclusiveRoomOffer && selectedRoomItem && otherRooms.length > 0 && (
                                        <div className="pt-2 space-y-5">
                                            <div className="bg-white/80 rounded-2xl border border-[#C9A24B]/30 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                                                <div>
                                                    <p className="text-xs sm:text-sm font-semibold text-[#061C2B]">
                                                        Looking for a different room category?
                                                    </p>
                                                    <p className="text-[11px] sm:text-xs text-gray-500 font-light mt-0.5">
                                                        Other rooms are shown at standard rates (this exclusive offer applies only to {selectedRoomItem.title}).
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowOtherRooms((prev) => !prev)}
                                                    aria-expanded={showOtherRooms}
                                                    className="inline-flex items-center justify-center gap-2 bg-[#FAF8F5] hover:bg-[#063B32] text-[#063B32] hover:text-[#C9A24B] border border-[#C9A24B]/50 px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
                                                >
                                                    <span>
                                                        {showOtherRooms
                                                            ? 'Hide Other Suites'
                                                            : `View ${otherRooms.length} Other Suites`}
                                                    </span>
                                                    {showOtherRooms ? (
                                                        <ChevronUp className="w-4 h-4" aria-hidden="true" />
                                                    ) : (
                                                        <ChevronDown className="w-4 h-4" aria-hidden="true" />
                                                    )}
                                                </button>
                                            </div>

                                            {showOtherRooms && (
                                                <div className="space-y-6">
                                                    <h3 className="font-serif text-xl font-semibold text-[#063B32]">
                                                        Other Rooms &amp; Suites (Standard Rates)
                                                    </h3>
                                                    {otherRooms.map((room) => renderRoomCard(room, false))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Standard or Property-Wide Offer Rooms List */}
                                    {(!isExclusiveRoomOffer || !selectedRoomItem) && otherRooms.length > 0 && (
                                        <div className="space-y-6">
                                            {activeOffer && !selectedRoomItem ? (
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#063B32]">
                                                        Eligible Suites for {activeOffer.title}
                                                    </h3>
                                                    <span className="text-xs text-gray-500">
                                                        Choose your preferred suite below — {activeOffer.discount || 'offer rate'} is already applied
                                                    </span>
                                                </div>
                                            ) : selectedRoomItem ? (
                                                <h3 className="font-serif text-xl font-semibold text-[#063B32] pt-2">
                                                    Other Available Rooms &amp; Suites
                                                </h3>
                                            ) : null}
                                            {otherRooms.map((room) => renderRoomCard(room, false))}
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                )}
            </section>

            <RoomsBanner />
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
