import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Calendar, Users, Bed, Check, ArrowRight, X, Lock, CheckCircle2, BedDouble, FileText, Banknote, CreditCard, Info, Eye, Maximize, Moon, Waves, Wifi, Wind, DoorOpen, Utensils, Sparkles, Clock, AlertCircle } from 'lucide-react';
// Import local hero banner image asset
import checkoutHeroImg from '../assets/checkoutPageHero.webp';
// Import local asset images for Payment Method step thumbnails
import hotelLobbyImg from '../assets/hotelLobbyImg.webp';   // Thumbnail image for "Pay at Hotel" card
import securePaymentImg from '../assets/securePaymentImg.webp'; // Thumbnail image for "Online Payment" card
import RoomsBanner from '../components/RoomsBanner';
import { ROOMS_DATA } from '../constants/hotelData';
import { applyPageSEO } from '../utils/seo';
import {
    CHILD_AGE_OPTIONS,
    normalizeChildAges,
    evaluateChildPolicy
} from '../utils/childPolicy';

/**
 * Amenity Icons Mapping Object for Dynamic Summary Display
 */
const amenityIcons = {
    'Ocean View': Waves,
    'Garden View': Sparkles,
    'Pool View': Waves,
    'Free Wi-Fi': Wifi,
    'Air Conditioning': Wind,
    Balcony: DoorOpen,
    'In-room Dining': Utensils,
    'Breakfast Included': Utensils,
    'Living Area': Sparkles,
    Terrace: DoorOpen
};

const viewIcons = {
    'Ocean View': Waves,
    'Pool View': Waves,
    'Garden View': Sparkles
};

/**
 * CheckoutPage Component - Luxury Hotel Booking Flow
 */
export default function CheckoutPage() {
    const location = useLocation();
    const navigate = useNavigate();

    // Get selected room from navigation state or fallback to the first room in data
    const room = location.state?.room || ROOMS_DATA[0];

    // Helper to format Date to YYYY-MM-DD
    const formatIsoDate = (d) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const todayDate = new Date();
    const todayIso = formatIsoDate(todayDate);
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const defaultCheckIn = location.state?.checkIn || location.state?.checkInDate || formatIsoDate(tomorrowDate);
    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 4);
    const defaultCheckOut = location.state?.checkOut || location.state?.checkOutDate || formatIsoDate(threeDaysLater);

    // Multi-step navigation state (1: Stay & Guest Details, 2: Payment Method)
    const [currentStep, setCurrentStep] = useState(1);

    // Form state variables
    const [checkInDate, setCheckInDate] = useState(defaultCheckIn);
    const [checkOutDate, setCheckOutDate] = useState(defaultCheckOut);
    const [adults, setAdults] = useState(location.state?.adults || '2');
    const [children, setChildren] = useState(location.state?.children || '0');
    const [childAges, setChildAges] = useState(() =>
        normalizeChildAges(
            location.state?.childAges || [],
            Number(location.state?.children) || 0
        )
    );
    const [roomsCount, setRoomsCount] = useState(location.state?.roomsCount || '1');
    const [residency, setResidency] = useState(
        location.state?.residency === 'Resident' ? 'Resident' : 'Non-Resident'
    );
    const [guestIdNumber, setGuestIdNumber] = useState('');

    // Promo Code State
    const [promoInput, setPromoInput] = useState(location.state?.promoCode || '');
    const [appliedPromo, setAppliedPromo] = useState(null);
    const [promoDiscount, setPromoDiscount] = useState(0);
    const [promoError, setPromoError] = useState('');
    const [promoLoading, setPromoLoading] = useState(false);

    // Guest Information State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('hotel'); // Default to Pay at Hotel
    const [agreedTerms, setAgreedTerms] = useState(false);

    // Booking submission status states
    const [bookingError, setBookingError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmedBookingId, setConfirmedBookingId] = useState(null);

    // Auto-fill logged-in user profile if available
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const u = JSON.parse(storedUser);
                if (u.email) setEmail(u.email);
                if (u.fullName || u.full_name) {
                    const nameParts = (u.fullName || u.full_name).trim().split(' ');
                    setFirstName(nameParts[0] || '');
                    setLastName(nameParts.slice(1).join(' ') || '');
                }
                if (u.phone) {
                    setPhone(u.phone.replace('+94', '').trim());
                }
            } catch (e) {
                console.error('Failed to parse user session for checkout', e);
            }
        }
    }, []);

    // Modal states for success confirmation and cancellation policy view
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [summaryHeight, setSummaryHeight] = useState(null);
    const formRef = useRef(null);

    // Calculate pricing details dynamically based on dates, residency & special offers
    const parseMoney = (val) => {
        if (val === undefined || val === null || val === '') return 0;
        return Number(String(val).replace(/[^0-9.]/g, '')) || 0;
    };

    const offerOriginalNightly = parseMoney(room.originalPrice || room.original_price);
    const offerDiscountedNightly = parseMoney(room.discountedPrice || room.discounted_price);
    const isOfferBooking = Boolean(
        offerDiscountedNightly > 0 && (offerOriginalNightly > 0 || room.discount)
    );

    const rawPriceStr = String(room.price || room.discountedPrice || room.discounted_price || room.originalPrice || '280');
    const nonResidentBase = Number(room.price_per_night) || parseMoney(rawPriceStr) || 280;
    const residentBase = Number(room.resident_price_per_night) > 0
        ? Number(room.resident_price_per_night)
        : Math.round(nonResidentBase * 0.75);

    const effectiveNightlyRate = isOfferBooking
        ? offerDiscountedNightly
        : residency === 'Resident'
            ? residentBase
            : nonResidentBase;

    const regularNightlyRate =
        isOfferBooking && offerOriginalNightly > offerDiscountedNightly
            ? offerOriginalNightly
            : effectiveNightlyRate;

    const checkInTime = new Date(checkInDate).getTime();
    const checkOutTime = new Date(checkOutDate).getTime();
    const nights = Math.max(1, Math.round((checkOutTime - checkInTime) / (1000 * 60 * 60 * 24)) || 1);
    const calculatedNights = nights;
    const roomsQty = Math.max(1, Number(roomsCount) || 1);

    const regularStayTotal = Math.round(regularNightlyRate * nights * roomsQty * 100) / 100;
    const roomRateTotal = Math.round(effectiveNightlyRate * nights * roomsQty * 100) / 100;
    const discount =
        isOfferBooking && regularStayTotal > roomRateTotal
            ? Math.round((regularStayTotal - roomRateTotal) * 100) / 100
            : Number(room.discountAmount) || 0;

    // Evaluate real-world hotel Child Age & Bedding Policy using room-specific DB rates (supports $0 Family Suites)
    const childrenNum = Number(children) || 0;
    const childPolicy = evaluateChildPolicy({
        childAges: childrenNum > 0 ? normalizeChildAges(childAges, childrenNum) : [],
        nights,
        residency,
        childExtraBedPrice: room.child_extra_bed_price,
        residentChildExtraBedPrice: room.resident_child_extra_bed_price,
    });
    const childSupplement = childPolicy.childSupplementTotal;
    const staySubtotalWithBedding = Math.round((roomRateTotal + childSupplement) * 100) / 100;

    const taxesAndFees = Math.round(staySubtotalWithBedding * 0.15);
    const totalSavings = Math.round((discount + promoDiscount) * 100) / 100;
    const totalAmount = Math.max(
        0,
        Math.round((staySubtotalWithBedding + taxesAndFees - promoDiscount) * 100) / 100
    );

    const validateCheckoutPromo = async (codeToCheck) => {
        const clean = String(codeToCheck ?? promoInput).trim().toUpperCase();
        if (!clean) {
            setAppliedPromo(null);
            setPromoDiscount(0);
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
                    subtotal: roomRateTotal,
                    nights,
                    roomId: Number(room.room_id || room.id) || 1,
                    residency
                })
            });
            const data = await res.json();
            if (!res.ok || !data.valid) {
                setAppliedPromo(null);
                setPromoDiscount(0);
                setPromoError(data.message || 'Invalid promo code.');
            } else {
                setPromoInput(data.promo.code);
                setAppliedPromo(data.promo);
                setPromoDiscount(Number(data.discountAmount) || 0);
                setPromoError('');
            }
        } catch {
            setPromoError('Unable to validate promo code right now.');
        } finally {
            setPromoLoading(false);
        }
    };

    useEffect(() => {
        if (location.state?.promoCode) {
            validateCheckoutPromo(location.state.promoCode);
        }
    }, []);

    // Synchronize document SEO metadata for the Checkout page
    useEffect(() => {
        return applyPageSEO({
            title: isOfferBooking
                ? `Checkout — ${room.offerTitle || room.title} (${room.discount || 'Special Offer'})`
                : `Secure Checkout — ${room.title || 'Suite Reservation'}`,
            description:
                'Complete your luxury reservation at Serenity Bay Hotel & Resort with instant confirmation, best rate guarantee, and secure checkout.',
            canonicalPath: '/checkout'
        });
    }, [isOfferBooking, room.offerTitle, room.title, room.discount]);

    useEffect(() => {
        if (appliedPromo?.code) {
            validateCheckoutPromo(appliedPromo.code);
        }
    }, [roomRateTotal, nights, residency]);

    useEffect(() => {
        const syncSummaryHeight = () => {
            if (window.matchMedia('(min-width: 1024px)').matches) {
                setSummaryHeight(formRef.current?.offsetHeight || null);
            } else {
                setSummaryHeight(null);
            }
        };

        syncSummaryHeight();
        const resizeObserver = new ResizeObserver(syncSummaryHeight);
        if (formRef.current) {
            resizeObserver.observe(formRef.current);
        }
        window.addEventListener('resize', syncSummaryHeight);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', syncSummaryHeight);
        };
    }, [currentStep]);

    /**
     * Handle transition from Step 1 to Step 2 with strict Phone Number Validation
     */
    const handleContinueToPayment = (e) => {
        e.preventDefault();

        // Validate Sri Lankan phone number (strictly 9 digits required)
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length !== 9) {
            alert('Please enter a valid 9-digit phone number. (e.g., 771234567)');
            return;
        }

        setCurrentStep(2);
        // Ensure smooth scroll to top of the checkout form when moving to step 2
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    /**
     * Handle final booking confirmation and send request to backend API.
     */
    const handleConfirmBooking = async (e) => {
        e.preventDefault();
        setBookingError('');
        setIsSubmitting(true);

        try {
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const token = localStorage.getItem('token');

            const payload = {
                roomId: Number(room.room_id || room.id) || 1,
                checkIn: checkInDate,
                checkOut: checkOutDate,
                adults: Number(adults) || 1,
                children: childrenNum,
                child_ages: childPolicy.normalizedAges,
                child_supplement: childSupplement,
                guests: (Number(adults) || 1) + childrenNum,
                roomsCount: Number(roomsCount) || 1,
                guest_first_name: firstName,
                guest_last_name: lastName,
                guest_email: email,
                guest_phone: phone ? `+94${phone}` : '',
                residency,
                guest_id_number: guestIdNumber,
                promo_code: appliedPromo?.code || null,
                offer_discount: discount,
                discount_amount: totalSavings,
                special_requests: specialRequests,
                payment_method: paymentMethod === 'hotel' ? 'PAY_AT_HOTEL' : 'ONLINE',
                total_price: totalAmount,
                totalAmount: totalAmount
            };

            const response = await fetch(`${API_BASE}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to complete booking reservation.');
            }

            if (data.booking?.id) {
                setConfirmedBookingId(data.booking.id);
            }

            setIsSuccessModalOpen(true);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error('Booking submission error:', err);
            setBookingError(err.message || 'Could not complete reservation. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F5F0] text-[#061C2B] relative overflow-x-hidden">

            {/* SEO & Semantic Metadata Container */}
            <div className="sr-only" aria-hidden="false">
                <h1>Secure Booking &amp; Checkout | Serenity Bay Hotel &amp; Resort</h1>
                <p>Complete your luxury reservation at Serenity Bay Resort with best price guarantees and secure checkout options.</p>
            </div>

            {/* Hero Banner Section with Local Asset Image & Smooth Fade-In Animation */}
            <header
                className="relative h-[450px] md:h-[600px] bg-cover bg-center flex flex-col justify-center px-6 pt-20 md:px-12 md:pt-28"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(6, 59, 50, 0.85) 0%, rgba(6, 59, 50, 0.45) 40%, rgba(6, 59, 50, 0.1) 70%, rgba(6, 59, 50, 0) 90%), url(${checkoutHeroImg})`
                }}
            >
                <div className="max-w-7xl mx-auto w-full text-left animate-[fadeInUp_1s_ease-out]">
                    <span className="text-[#C5A253] tracking-[0.2em] uppercase text-xs font-bold block mb-2">
                        HOME &gt; ROOMS &amp; SUITES &gt; BOOKING
                    </span>
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-normal mb-3 md:mb-4">
                        Reserve Your <span className="italic text-[#C9A24B]">Stay</span>
                    </h1>
                    <p className="text-gray-200 text-xs sm:text-sm md:text-base font-light max-w-xl leading-relaxed">
                        Your dream escape is just a few steps away.<br />
                        Fill in your details and secure your perfect stay at Serenity Bay Hotel &amp; Resort.
                    </p>
                </div>
            </header>

            {/* Responsive 4-Step Progress Bar */}
            <nav aria-label="Checkout Progress" className="max-w-6xl mx-auto px-4 -mt-8 relative z-20 mb-12">
                <div className="bg-[#063B32] border border-[#C9A24B]/40 rounded-2xl px-4 sm:px-6 py-4 shadow-xl text-white flex items-center justify-between text-xs">

                    {/* Step 1 Indicator */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold flex items-center justify-center text-xs shadow-md shrink-0 bg-[#C9A24B] text-[#061C2B]">
                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </span>
                        <div className="hidden sm:block">
                            <span className="font-semibold block text-white text-xs">Your Stay</span>
                            <span className="text-[10px] text-gray-300 font-light">Select dates &amp; room details</span>
                        </div>
                    </div>

                    <div className="h-[1px] flex-1 bg-[#C9A24B]/30 mx-2 sm:mx-4" />

                    {/* Step 2 Indicator */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold flex items-center justify-center text-xs shadow-md shrink-0 bg-[#C9A24B] text-[#061C2B]">
                            {currentStep > 1 ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : '2'}
                        </span>
                        <div className="hidden sm:block">
                            <span className="font-semibold block text-white text-xs">Guest Details</span>
                            <span className="text-[10px] text-gray-300 font-light">Tell us about yourself</span>
                        </div>
                    </div>

                    <div className="h-[1px] flex-1 bg-[#C9A24B]/30 mx-2 sm:mx-4" />

                    {/* Step 3 Indicator */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        <span className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold flex items-center justify-center text-xs shadow-md shrink-0 ${currentStep === 2 ? 'bg-[#C9A24B] text-[#061C2B]' : 'border border-[#C9A24B]/60 text-[#C9A24B] opacity-70'}`}>3</span>
                        <div className="hidden sm:block">
                            <span className={`font-semibold block text-xs ${currentStep === 2 ? 'text-white' : 'text-gray-300 opacity-70'}`}>Payment Method</span>
                            <span className="text-[10px] text-gray-300 font-light">Choose your option</span>
                        </div>
                    </div>

                    <div className="h-[1px] flex-1 bg-[#C9A24B]/30 mx-2 sm:mx-4" />

                    {/* Step 4 Indicator */}
                    <div className="flex items-center gap-2 sm:gap-3 opacity-70">
                        <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#C9A24B]/60 text-[#C9A24B] font-semibold flex items-center justify-center text-xs shrink-0">
                            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </span>
                        <div className="hidden sm:block">
                            <span className="font-medium block text-gray-300 text-xs">Confirmation</span>
                            <span className="text-[10px] text-gray-400 font-light">You're all set!</span>
                        </div>
                    </div>

                </div>
            </nav>

            {/* Main Checkout Grid Layout with items-start */}
            <main className="max-w-[1440px] mx-auto mt-12 px-4 sm:px-6 md:px-12 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

                {/* Left Side: Multi-Step Form Container */}
                <section
                    ref={formRef}
                    className={`lg:col-span-7 bg-[#F7F3E8] p-6 md:p-8 rounded-2xl shadow-sm border border-[#C9A24B]/20 ${currentStep === 2 ? 'lg:flex lg:flex-col' : ''}`}
                >

                    {/* ========================================================================= */}
                    {/* ======================= STEP 1: STAY & GUEST DETAILS ==================== */}
                    {/* ========================================================================= */}
                    {currentStep === 1 ? (
                        <div>
                            <div className="mb-6 pb-4 border-b border-[#C9A24B]/30">
                                <h2 className="font-serif text-2xl font-medium text-[#061C2B]">Complete Your Reservation</h2>
                                <p className="text-xs text-gray-500 font-light mt-1">Please review your stay details and fill in guest information.</p>
                            </div>

                            <form onSubmit={handleContinueToPayment} className="space-y-8">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2 text-sm font-semibold text-[#061C2B]">
                                            <Calendar className="w-4 h-4 text-[#C9A24B]" />
                                            <span>1. Stay Details</span>
                                        </div>
                                        <span className="text-[10px] bg-[#063B32]/10 text-[#063B32] px-2.5 py-0.5 rounded-full font-medium">Verified Dates</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Check-in Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3 w-4 h-4 text-[#C9A24B]" />
                                                <input
                                                    type="date"
                                                    min={todayIso}
                                                    value={checkInDate}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        setCheckInDate(val);
                                                        if (checkOutDate <= val) {
                                                            const d = new Date(val);
                                                            d.setDate(d.getDate() + 1);
                                                            setCheckOutDate(formatIsoDate(d));
                                                        }
                                                    }}
                                                    aria-label="Check-in Date"
                                                    className="w-full bg-white border border-[#e5dfd4] rounded-xl pl-10 pr-4 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#C9A24B]"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Check-out Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3 w-4 h-4 text-[#C9A24B]" />
                                                <input
                                                    type="date"
                                                    min={checkInDate}
                                                    value={checkOutDate}
                                                    onChange={(e) => setCheckOutDate(e.target.value)}
                                                    aria-label="Check-out Date"
                                                    className="w-full bg-white border border-[#e5dfd4] rounded-xl pl-10 pr-4 py-2 text-xs text-gray-700 focus:outline-none focus:border-[#C9A24B]"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Adults</label>
                                            <div className="relative">
                                                <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={`${adults} Adults`}
                                                    readOnly
                                                    aria-label="Number of Adults"
                                                    className="w-full bg-gray-100 border border-[#e5dfd4] rounded-xl pl-10 pr-3 py-2.5 text-xs text-gray-700 cursor-not-allowed select-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Children (0-12)</label>
                                            <div className="relative">
                                                <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={`${children} Children`}
                                                    readOnly
                                                    aria-label="Number of Children"
                                                    className="w-full bg-gray-100 border border-[#e5dfd4] rounded-xl pl-10 pr-3 py-2.5 text-xs text-gray-700 cursor-not-allowed select-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Rooms</label>
                                            <div className="relative">
                                                <Bed className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={`${roomsCount} Room`}
                                                    readOnly
                                                    aria-label="Number of Rooms"
                                                    className="w-full bg-gray-100 border border-[#e5dfd4] rounded-xl pl-10 pr-3 py-2.5 text-xs text-gray-700 cursor-not-allowed select-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Child Ages & Bedding Policy Verification (Shown when Children > 0) */}
                                    {childrenNum > 0 && (
                                        <div className="mt-4 p-4 rounded-2xl bg-[#FAF8F5] border border-[#C9A24B]/35 space-y-2.5">
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <span className="text-[11px] font-bold uppercase tracking-wider text-[#063B32]">
                                                    Child Ages &amp; Bedding Policy
                                                </span>
                                                <span className="text-[10.5px] text-gray-500">
                                                    0–2: Free Baby Cot · 3–5: Free Sharing ·{' '}
                                                    {childPolicy.ratePerExtraBedNight === 0
                                                        ? '6–11: Free Extra Bed (Family Suite)'
                                                        : `6–11: +$${childPolicy.ratePerExtraBedNight}/night Extra Bed`}
                                                </span>
                                            </div>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                                                {normalizeChildAges(childAges, childrenNum).map((ageVal, idx) => (
                                                    <div key={idx}>
                                                        <label
                                                            htmlFor={`checkout-child-age-${idx}`}
                                                            className="block text-[10px] font-semibold text-gray-500 mb-1"
                                                        >
                                                            Child {idx + 1} Age
                                                        </label>
                                                        <select
                                                            id={`checkout-child-age-${idx}`}
                                                            value={ageVal}
                                                            onChange={(e) => {
                                                                const next = normalizeChildAges(childAges, childrenNum);
                                                                next[idx] = e.target.value;
                                                                setChildAges(next);
                                                            }}
                                                            className="w-full bg-white border border-[#e5dfd4] rounded-xl px-2.5 py-2 text-xs font-semibold text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                                                        >
                                                            {CHILD_AGE_OPTIONS.map((opt) => (
                                                                <option key={opt} value={opt}>
                                                                    {opt === 'Under 1' ? 'Under 1 yr' : `${opt} ${opt === '1' ? 'yr' : 'yrs'}`}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                ))}
                                            </div>
                                            {childPolicy.housekeepingSummary && (
                                                <p className="text-[11px] font-semibold text-[#063B32]">
                                                    Room Setup: {childPolicy.housekeepingSummary}
                                                </p>
                                            )}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Guest Residency *</label>
                                            <select
                                                value={residency}
                                                onChange={(e) => setResidency(e.target.value)}
                                                className="w-full bg-white border border-[#e5dfd4] rounded-xl px-4 py-2.5 text-xs text-[#061C2B] font-semibold focus:outline-none focus:border-[#C9A24B]"
                                            >
                                                <option value="Non-Resident">Non-Resident (International Guest)</option>
                                                <option value="Resident">Sri Lankan Resident (Local ID Rate)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                {residency === 'Resident' ? 'Sri Lankan NIC Number *' : 'Passport Number (Optional)'}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={residency === 'Resident' ? 'e.g. 199812345678 or 981234567V' : 'Enter passport number'}
                                                value={guestIdNumber}
                                                onChange={(e) => setGuestIdNumber(e.target.value)}
                                                required={residency === 'Resident'}
                                                className="w-full bg-white border border-[#e5dfd4] rounded-xl px-4 py-2.5 text-xs text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-[#C9A24B]/20">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-[#061C2B] mb-4">
                                        <Users className="w-4 h-4 text-[#C9A24B]" />
                                        <span>2. Guest Information</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">First Name *</label>
                                            <input
                                                type="text"
                                                placeholder="Enter your first name"
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="w-full bg-white border border-[#e5dfd4] rounded-xl px-4 py-2.5 text-xs text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Last Name *</label>
                                            <input
                                                type="text"
                                                placeholder="Enter your last name"
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="w-full bg-white border border-[#e5dfd4] rounded-xl px-4 py-2.5 text-xs text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Email Address *</label>
                                            <input
                                                type="email"
                                                placeholder="you@example.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-white border border-[#e5dfd4] rounded-xl px-4 py-2.5 text-xs text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number *</label>
                                            <div className="flex gap-2">
                                                <span className="bg-white border border-[#e5dfd4] rounded-xl px-3 py-2.5 text-xs flex items-center gap-1.5 text-gray-700 shadow-sm shrink-0">
                                                    <img
                                                        src="https://flagcdn.com/w20/lk.png"
                                                        srcSet="https://flagcdn.com/w40/lk.png 2x"
                                                        width="20"
                                                        alt="Sri Lanka Flag"
                                                        className="rounded-xs object-cover shadow-xs"
                                                    />
                                                    <span className="font-medium">+94</span>
                                                </span>
                                                <input
                                                    type="tel"
                                                    placeholder="77 123 4567"
                                                    value={phone}
                                                    onChange={(e) => {
                                                        const onlyNums = e.target.value.replace(/\D/g, '').slice(0, 9);
                                                        setPhone(onlyNums);
                                                    }}
                                                    pattern="[0-9]{9}"
                                                    maxLength={9}
                                                    className="w-full bg-white border border-[#e5dfd4] rounded-xl px-4 py-2.5 text-xs text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Guest Residency *</label>
                                            <select
                                                value={residency}
                                                onChange={(e) => setResidency(e.target.value)}
                                                className="w-full bg-white border border-[#e5dfd4] rounded-xl px-4 py-2.5 text-xs text-[#061C2B] font-semibold focus:outline-none focus:border-[#C9A24B]"
                                            >
                                                <option value="Non-Resident">Non-Resident (International Guest)</option>
                                                <option value="Resident">Sri Lankan Resident (Local ID Rate)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">
                                                {residency === 'Resident' ? 'Sri Lankan NIC Number *' : 'Passport Number (Optional)'}
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={residency === 'Resident' ? 'e.g. 199812345678 or 981234567V' : 'Enter passport number'}
                                                value={guestIdNumber}
                                                onChange={(e) => setGuestIdNumber(e.target.value)}
                                                required={residency === 'Resident'}
                                                className="w-full bg-white border border-[#e5dfd4] rounded-xl px-4 py-2.5 text-xs text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-[#C9A24B]/20">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-[#061C2B] mb-2">
                                        <FileText className="w-4 h-4 text-[#C9A24B]" />
                                        <span>3. Special Requests</span>
                                    </div>
                                    <textarea
                                        rows="3"
                                        placeholder="Any special requests? (e.g. high floor, extra bed, late check-in, etc.)"
                                        value={specialRequests}
                                        onChange={(e) => setSpecialRequests(e.target.value)}
                                        maxLength="500"
                                        className="w-full bg-white border border-[#e5dfd4] rounded-xl p-3 text-xs text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                                    ></textarea>
                                    <div className="text-[10px] text-right text-gray-400 mt-1">{specialRequests.length}/500</div>
                                </div>

                                <div className="pt-2 flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={agreedTerms}
                                        onChange={(e) => setAgreedTerms(e.target.checked)}
                                        className="accent-[#C9A24B] w-4 h-4 rounded cursor-pointer"
                                        required
                                    />
                                    <label htmlFor="terms" className="text-xs text-gray-600 select-none">
                                        I agree to the <span className="text-[#063B32] underline font-medium cursor-pointer">Terms &amp; Conditions</span> and <span className="text-[#063B32] underline font-medium cursor-pointer">Privacy Policy</span>.
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-[#C9A24B] text-[#061C2B] py-3.5 rounded-xl text-xs font-bold tracking-wider hover:bg-[#b49147] transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Lock className="w-4 h-4" />
                                    <span>Continue To Payment</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    ) : (
                        <>
                            {/* ========================================================================= */}
                            {/* ======================= STEP 2: PAYMENT METHOD (PAY AT HOTEL) =========== */}
                            {/* ========================================================================= */}
                            <div className="space-y-6 lg:flex lg:flex-1 lg:flex-col lg:justify-between" aria-label="Payment Method Selection">

                                {/* Navigation & Step Header Block */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setCurrentStep(1);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="text-xs text-gray-600 hover:text-[#061C2B] flex items-center gap-1 font-medium cursor-pointer transition-colors"
                                            aria-label="Return to Guest Details Step"
                                        >
                                            ← Back to Guest Details
                                        </button>
                                    </div>

                                    <div className="pb-4 border-b border-[#C9A24B]/30">
                                        <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#061C2B]">Choose Your Payment Method</h2>
                                        <p className="text-xs text-gray-500 font-light mt-1">Select a convenient payment option to complete your booking. You can always pay at the hotel during your stay.</p>
                                    </div>
                                </div>

                                {/* Payment Options Form Section */}
                                <form onSubmit={handleConfirmBooking} className="space-y-5 lg:flex lg:flex-1 lg:flex-col lg:justify-between" aria-label="Checkout Payment Form">
                                    <div className="space-y-4">

                                        {/* Active Option: Pay at Hotel with Taller Image Container */}
                                        <label className="block p-5 sm:p-6 rounded-2xl border-2 border-[#C9A24B] bg-white shadow-md cursor-pointer relative overflow-hidden transition hover:shadow-lg">
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-5 mb-4">

                                                {/* Left side: Radio, Icon, Title and Description */}
                                                <div className="flex items-start gap-4 w-full sm:w-[58%]">
                                                    <div className="w-5 h-5 rounded-full border-2 border-[#C9A24B] flex items-center justify-center shrink-0 mt-1">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-[#C9A24B]" />
                                                    </div>
                                                    <div className="w-12 h-12 rounded-2xl bg-[#063B32]/10 text-[#063B32] flex items-center justify-center shrink-0 shadow-xs">
                                                        <Banknote className="w-6 h-6 text-[#C9A24B]" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                                                            <span className="text-sm font-bold text-[#061C2B]">Pay at Hotel</span>
                                                            <span className="text-[9px] bg-[#C9A24B] text-[#061C2B] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">Recommended</span>
                                                        </div>
                                                        <span className="text-xs text-gray-500 font-light block leading-relaxed">No payment required now. You can pay at the hotel during your stay.</span>
                                                    </div>
                                                </div>

                                                {/* Right side: Increased height container (h-32) for full image clarity */}
                                                <div className="w-full sm:w-[38%] h-32 sm:h-28 rounded-xl overflow-hidden relative shadow-xs border border-[#C9A24B]/30 shrink-0 bg-black/5 flex items-center justify-center">
                                                    <img
                                                        src={hotelLobbyImg}
                                                        alt="Serenity Bay Hotel Reception Lobby"
                                                        className="w-full h-full object-cover object-center"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            </div>

                                            {/* Dynamic Feature Badges with proper spacing */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3.5 border-t border-gray-100 text-[11px] text-gray-600 font-medium">
                                                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" /> No upfront payment</span>
                                                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" /> Pay at check-in/out</span>
                                                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" /> Secure &amp; hassle-free</span>
                                            </div>
                                        </label>

                                        {/* Disabled / Future State: Online Payment Option with Taller Image Container */}
                                        <div
                                            aria-disabled="true"
                                            aria-label="Online Payment Option Currently Unavailable"
                                            className="group p-5 sm:p-6 rounded-2xl border border-gray-200 bg-white opacity-85 relative overflow-hidden select-none cursor-not-allowed shadow-md"
                                        >
                                            <div className="flex flex-col sm:flex-row items-center justify-between gap-5 mb-4">

                                                {/* Left side: Radio, Icon, Title and Description */}
                                                <div className="flex items-start gap-4 w-full sm:w-[58%]">
                                                    <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center shrink-0 bg-gray-100 mt-1" />
                                                    <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-500 flex items-center justify-center shrink-0 shadow-xs">
                                                        <CreditCard className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                                                            <span className="text-sm font-bold text-gray-700">Online Payment</span>
                                                            <Lock className="w-3.5 h-3.5 text-gray-400" />
                                                            <span className="text-[9px] bg-gray-200 text-gray-600 px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider border border-gray-300/50">Coming Soon</span>
                                                        </div>
                                                        <span className="text-xs text-gray-400 font-light block leading-relaxed">Pay securely online using your credit or debit card.</span>
                                                    </div>
                                                </div>

                                                {/* Right side: Increased height container (h-32) with Lock Overlay */}
                                                <div className="w-full sm:w-[38%] h-32 sm:h-28 rounded-xl overflow-hidden relative shadow-xs border border-gray-200 shrink-0 bg-black/40 flex items-center justify-center">
                                                    <img
                                                        src={securePaymentImg}
                                                        alt="Secure Online Payment Preview"
                                                        className="w-full h-full object-cover object-center absolute inset-0 opacity-50"
                                                        loading="lazy"
                                                    />
                                                    <div className="relative z-10 w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center shadow-md border border-white/20">
                                                        <Lock className="w-4 h-4 text-[#C9A24B]" />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Security Verification Badges */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3.5 border-t border-gray-200/60 text-[11px] text-gray-400 font-medium">
                                                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-gray-400 shrink-0" /> SSL Encrypted</span>
                                                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" /> Multiple Cards</span>
                                                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-gray-400 shrink-0" /> Fast &amp; Secure</span>
                                            </div>
                                        </div>

                                        {/* Hotel Guarantee and Policy Container */}
                                        <div className="p-4 bg-[#FFFDF9] rounded-xl border border-[#e5dfd4] space-y-1.5 text-xs shadow-xs">
                                            <div className="flex items-center gap-2 font-semibold text-[#061C2B]">
                                                <ShieldCheck className="w-4 h-4 text-[#C9A24B]" />
                                                <span>Serenity Bay Guarantee &amp; Check-in Policies</span>
                                            </div>
                                            <ul className="text-[11px] text-gray-600 font-light space-y-1 pl-5 list-disc">
                                                <li>Standard check-in begins at 14:00 PM. Early check-in is subject to room availability upon arrival.</li>
                                                <li>Accepted payment methods include Cash (LKR, USD, EUR) or Credit Cards at the front desk.</li>
                                                <li>Free cancellation available up to 24 hours prior to check-in date.</li>
                                            </ul>
                                        </div>

                                        {/* Informational Email Confirmation Notice Box */}
                                        <div className="p-3.5 bg-[#C9A24B]/10 rounded-xl border border-[#C9A24B]/30 text-xs text-[#061C2B] flex items-start gap-2.5">
                                            <Info className="w-4 h-4 text-[#C9A24B] shrink-0 mt-0.5" />
                                            <p className="font-light text-[11px]">Once you confirm your booking, you'll receive a confirmation email with your reservation details, including payment instructions (if applicable).</p>
                                        </div>
                                    </div>

                                    {bookingError && (
                                        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2.5 mt-3">
                                            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                                            <span>{bookingError}</span>
                                        </div>
                                    )}

                                    {/* Main Action CTA Button: Final Confirmation */}
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full bg-[#C9A24B] text-[#061C2B] py-4 rounded-xl text-xs font-bold tracking-wider hover:bg-[#b49147] transition shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-4 disabled:opacity-60"
                                        aria-label="Confirm Booking and Review Reservation Details"
                                    >
                                        <span>{isSubmitting ? 'Processing Reservation...' : 'Review & Confirm Reservation'}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </section>

                {/* Right Side: Booking Summary Sidebar */}
                <aside className="lg:col-span-5">
                    <div
                        style={summaryHeight ? { minHeight: `${summaryHeight}px` } : undefined}
                        className="bg-[#063B32] text-white p-5 md:p-7 rounded-2xl shadow-xl border border-[#C9A24B]/30"
                    >
                        <h3 className="font-serif text-2xl font-normal mb-1">Booking Summary</h3>
                        <p className="text-xs text-gray-300 font-light mb-4">Here's a quick overview of your reservation.</p>

                        <div className="bg-black/20 rounded-xl overflow-hidden mb-4 border border-white/10">
                            <div className="h-40 relative overflow-hidden">
                                <img
                                    src={room.images?.[0] || room.image_url || room.image || checkoutHeroImg}
                                    alt={room.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-3">
                                <h4 className="font-serif text-lg font-medium text-white mb-1">{room.title}</h4>
                                <p className="text-xs text-gray-300 font-light line-clamp-2">{room.description}</p>
                            </div>
                        </div>

                        {/* Render Bed, Size, View and Amenities */}
                        <div className="grid grid-cols-2 gap-2.5 text-xs text-gray-200 py-4 border-t border-white/10 mb-5 font-light">
                            <span className="flex items-center gap-2"><BedDouble className="w-4 h-4 text-[#C9A24B] shrink-0" /> {room.bed || 'King Bed'}</span>
                            <span className="flex items-center gap-2"><Maximize className="w-4 h-4 text-[#C9A24B] shrink-0" /> {room.size || '42 m²'}</span>

                            {room.view && (() => {
                                const ViewIconComponent = viewIcons[room.view] || Eye;
                                return (
                                    <span className="flex items-center gap-2">
                                        <ViewIconComponent className="w-4 h-4 text-[#C9A24B] shrink-0" /> {room.view}
                                    </span>
                                );
                            })()}

                            {room.amenities && room.amenities
                                .filter(amenity => !amenity.toLowerCase().includes('view'))
                                .map((amenity, index) => {
                                    const AmenityIconComponent = amenityIcons[amenity] || Sparkles;
                                    return (
                                        <span key={index} className="flex items-center gap-2">
                                            <AmenityIconComponent className="w-4 h-4 text-[#C9A24B] shrink-0" /> {amenity}
                                        </span>
                                    );
                                })
                            }
                        </div>

                        {/* Check-in / Check-out & Stay Details */}
                        <div className="py-4 border-t border-b border-white/10 mb-6 space-y-4">

                            {/* Rooms, Adults & Children Info (Aligned nicely together) */}
                            <div className="flex items-center justify-start gap-5 text-xs text-gray-200 font-light px-1 flex-wrap">
                                <span className="flex items-center gap-1.5">
                                    <Bed className="w-4 h-4 text-[#C9A24B] shrink-0" />
                                    <span>{roomsCount} {Number(roomsCount) > 1 ? 'Rooms' : 'Room'}</span>
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Users className="w-4 h-4 text-[#C9A24B] shrink-0" />
                                    <span>{adults} {Number(adults) > 1 ? 'Adults' : 'Adult'}</span>
                                </span>
                                {Number(children) > 0 && (
                                    <span className="flex items-center gap-1.5">
                                        <Users className="w-4 h-4 text-[#C9A24B] shrink-0" />
                                        <span>
                                            {children} {Number(children) > 1 ? 'Children' : 'Child'}
                                            {childPolicy.agesDisplay ? ` (${childPolicy.agesDisplay})` : ''}
                                        </span>
                                    </span>
                                )}
                            </div>

                            {/* Check-in and Check-out Dates Grid */}
                            <div className="grid grid-cols-2 gap-4 relative pt-1">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-[#C9A24B]/10 border border-[#C9A24B]/40 flex items-center justify-center shrink-0">
                                        <Calendar className="w-5 h-5 text-[#C9A24B]" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-400 block font-medium uppercase tracking-wider">Check-in</span>
                                        <span className="text-xs font-semibold text-white">{checkInDate}</span>
                                    </div>
                                </div>

                                <div className="absolute left-1/2 top-1 bottom-1 w-[1px] bg-white/10 -translate-x-1/2" />

                                <div className="flex items-center gap-2 pl-2">
                                    <div className="w-9 h-9 rounded-lg bg-[#C9A24B]/10 border border-[#C9A24B]/40 flex items-center justify-center shrink-0">
                                        <Calendar className="w-5 h-5 text-[#C9A24B]" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-400 block font-medium uppercase tracking-wider">Check-out</span>
                                        <span className="text-xs font-semibold text-white">{checkOutDate}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1 text-xs text-gray-300 font-light">
                                <Moon className="w-4 h-4 text-[#C9A24B]" />
                                <span>{nights} Nights</span>
                            </div>
                        </div>

                        {/* Promo Code Input inside Booking Summary */}
                        <div className="mb-4 pb-4 border-b border-white/10">
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#C9A24B] mb-2">
                                Have a Promo Code?
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={promoInput}
                                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                                    placeholder="e.g. SERENITY20"
                                    className="flex-1 bg-black/30 border border-white/15 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider text-white placeholder-gray-400 focus:outline-none focus:border-[#C9A24B]"
                                />
                                {appliedPromo ? (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setAppliedPromo(null);
                                            setPromoDiscount(0);
                                            setPromoInput('');
                                            setPromoError('');
                                        }}
                                        className="px-3 py-2 rounded-xl bg-red-500/20 border border-red-400/40 text-red-200 text-xs font-bold hover:bg-red-500/30 cursor-pointer"
                                    >
                                        Remove
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        disabled={promoLoading}
                                        onClick={() => validateCheckoutPromo(promoInput)}
                                        className="px-4 py-2 rounded-xl bg-[#C9A24B] text-[#061C2B] text-xs font-extrabold hover:bg-[#b58d35] transition cursor-pointer"
                                    >
                                        {promoLoading ? '...' : 'Apply'}
                                    </button>
                                )}
                            </div>
                            {appliedPromo && (
                                <p className="text-[11px] text-emerald-300 mt-1.5 font-medium flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" />
                                    <span>{appliedPromo.code} applied ({appliedPromo.title})</span>
                                </p>
                            )}
                            {promoError && (
                                <p className="text-[11px] text-red-300 mt-1.5 font-medium">
                                    {promoError}
                                </p>
                            )}
                        </div>

                        {/* Special Offer Banner inside Summary */}
                        {isOfferBooking && discount > 0 && (
                            <div className="mb-4 p-3.5 rounded-xl bg-gradient-to-r from-[#C9A24B]/20 to-[#C9A24B]/10 border border-[#C9A24B]/50 flex items-center justify-between gap-3">
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#C9A24B] block">
                                        SPECIAL OFFER APPLIED · {room.discount || 'EXCLUSIVE'}
                                    </span>
                                    <span className="text-xs text-white font-medium">
                                        {room.offerTitle || room.title}
                                    </span>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-[11px] text-gray-300 line-through block">
                                        ${regularNightlyRate.toFixed(0)}/night
                                    </span>
                                    <span className="font-serif text-base font-bold text-[#C9A24B]">
                                        ${effectiveNightlyRate.toFixed(0)}/night
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Price Breakdown */}
                        <div className="space-y-2.5 text-xs font-light text-gray-200 mb-4 pb-4 border-b border-white/10">
                            {isOfferBooking && discount > 0 ? (
                                <>
                                    <div className="flex justify-between items-center text-gray-300">
                                        <span>
                                            Regular Rate ({nights} {nights === 1 ? 'night' : 'nights'} × ${regularNightlyRate.toFixed(0)})
                                        </span>
                                        <span className="line-through text-gray-400">
                                            ${regularStayTotal.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-[#C9A24B] font-semibold">
                                        <span>
                                            Offer Discount ({room.discount || 'Special Offer'})
                                        </span>
                                        <span>-${discount.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-white font-medium pt-1 border-t border-white/10">
                                        <span>Discounted Room Subtotal</span>
                                        <span>${roomRateTotal.toFixed(2)}</span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex justify-between">
                                    <span>Room Rate ({nights} {nights === 1 ? 'night' : 'nights'})</span>
                                    <span className="font-medium">${roomRateTotal.toFixed(2)}</span>
                                </div>
                            )}

                            {childrenNum > 0 && (
                                <div className="flex justify-between items-center">
                                    <span>
                                        {childSupplement > 0
                                            ? `Child Extra Bed (${childPolicy.olderChildCount} × $${childPolicy.ratePerExtraBedNight}/night)`
                                            : childPolicy.olderChildCount > 0
                                                ? 'Child Extra Bed (Kids Stay Free)'
                                                : childPolicy.infantCount > 0
                                                    ? 'Infant Baby Cot & Bedding'
                                                    : 'Child Sharing Bedding'}
                                    </span>
                                    <span className={childSupplement > 0 ? 'font-medium text-white' : 'font-semibold text-emerald-300'}>
                                        {childSupplement > 0 ? `+$${childSupplement.toFixed(2)}` : 'Complimentary'}
                                    </span>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <span>Taxes &amp; Fees (15%)</span>
                                <span className="font-medium">${taxesAndFees.toFixed(2)}</span>
                            </div>

                            {promoDiscount > 0 && appliedPromo && (
                                <div className="flex justify-between text-[#C9A24B] font-semibold">
                                    <span>Promo Code ({appliedPromo.code})</span>
                                    <span>-${promoDiscount.toFixed(2)}</span>
                                </div>
                            )}
                        </div>

                        {/* Total Amount */}
                        <div className="mb-6">
                            <div className="flex justify-between items-baseline">
                                <span className="text-sm font-medium text-white">Total Amount</span>
                                <span className="font-serif text-3xl font-normal text-[#C9A24B]">
                                    ${Number(totalAmount).toFixed(2)}
                                </span>
                            </div>
                            {totalSavings > 0 && (
                                <div className="mt-2 inline-flex items-center gap-1.5 bg-[#C9A24B]/15 border border-[#C9A24B]/40 text-[#C9A24B] px-3 py-1 rounded-full text-[11px] font-bold">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    <span>You save ${totalSavings.toFixed(2)} on this reservation!</span>
                                </div>
                            )}
                        </div>

                        {/* Free Cancellation Card */}
                        <div className="bg-black/30 p-4 rounded-xl border border-white/10 flex items-start gap-3">
                            <ShieldCheck className="w-5 h-5 text-[#C9A24B] shrink-0 mt-0.5" />
                            <div className="flex-1 text-xs">
                                <span className="font-medium block text-white mb-0.5">Free Cancellation</span>
                                <p className="text-[10px] text-gray-300 font-light mb-1.5">Cancel up to 24 hours before check-in for a full refund.</p>
                                <button
                                    type="button"
                                    onClick={() => setIsPolicyModalOpen(true)}
                                    className="text-[11px] text-[#C9A24B] hover:underline font-medium flex items-center gap-1 cursor-pointer"
                                >
                                    View Cancellation Policy →
                                </button>
                            </div>
                        </div>

                    </div>
                </aside>

            </main>

            {/* Rooms Banner Component - Positioned directly above the footer */}
            <RoomsBanner />

            {/* Cancellation Policy Modal Popup */}
            {isPolicyModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-300">
                    <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl overflow-hidden shadow-2xl border border-[#C9A24B]/30 p-6 sm:p-8 text-left animate-in fade-in zoom-in-95 duration-200">

                        {/* Luxury Golden Top Accent Line */}
                        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#063B32] via-[#C9A24B] to-[#063B32]" />

                        {/* Close Button */}
                        <button
                            type="button"
                            onClick={() => setIsPolicyModalOpen(false)}
                            className="absolute top-5 right-5 text-gray-400 hover:text-[#061C2B] p-2 rounded-full hover:bg-[#063B32]/5 transition-colors cursor-pointer"
                            aria-label="Close Cancellation Policy"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Header Section */}
                        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#C9A24B]/20">
                            <div className="w-12 h-12 rounded-2xl bg-[#063B32] text-[#C9A24B] flex items-center justify-center shrink-0 shadow-md">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#061C2B] tracking-tight">
                                    Cancellation Policy
                                </h3>
                                <p className="text-xs text-[#C9A24B] font-medium tracking-wide uppercase mt-0.5">
                                    Serenity Bay Hotel &amp; Resort Guidelines
                                </p>
                            </div>
                        </div>

                        {/* Policy Details Container */}
                        <div className="space-y-3.5 text-xs text-gray-700 font-light leading-relaxed max-h-[55vh] overflow-y-auto pr-1 sm:pr-2 custom-scrollbar">

                            {/* Free Cancellation Block */}
                            <div className="p-4 bg-white rounded-2xl border border-[#E8E2D5] space-y-1.5 shadow-xs transition hover:border-[#C9A24B]/50 hover:shadow-sm">
                                <div className="flex items-center gap-2 text-[#063B32] font-semibold text-xs">
                                    <CheckCircle2 className="w-4 h-4 text-[#C9A24B] shrink-0" />
                                    <span>Free Cancellation Period</span>
                                </div>
                                <p className="text-gray-600 pl-6 leading-relaxed">
                                    You can cancel your reservation free of charge up to <strong className="font-medium text-[#061C2B]">24 hours</strong> before your scheduled check-in date (14:00 local time).
                                </p>
                            </div>

                            {/* Late Cancellation / No-Show Block */}
                            <div className="p-4 bg-white rounded-2xl border border-[#E8E2D5] space-y-1.5 shadow-xs transition hover:border-[#C9A24B]/50 hover:shadow-sm">
                                <div className="flex items-center gap-2 text-[#063B32] font-semibold text-xs">
                                    <Clock className="w-4 h-4 text-[#C9A24B] shrink-0" />
                                    <span>Late Cancellation / No-Show</span>
                                </div>
                                <p className="text-gray-600 pl-6 leading-relaxed">
                                    If cancelled within 24 hours of check-in or in the event of a no-show, the <strong className="font-medium text-[#061C2B]">first night's room rate</strong> plus applicable taxes will be charged.
                                </p>
                            </div>

                            {/* Refund Processing Block */}
                            <div className="p-4 bg-white rounded-2xl border border-[#E8E2D5] space-y-1.5 shadow-xs transition hover:border-[#C9A24B]/50 hover:shadow-sm">
                                <div className="flex items-center gap-2 text-[#063B32] font-semibold text-xs">
                                    <CreditCard className="w-4 h-4 text-[#C9A24B] shrink-0" />
                                    <span>Refund Processing</span>
                                </div>
                                <p className="text-gray-600 pl-6 leading-relaxed">
                                    Eligible refunds will be credited back to your original payment method within <strong className="font-medium text-[#061C2B]">5 to 7 business days</strong>.
                                </p>
                            </div>

                        </div>

                        {/* Action CTA Button */}
                        <button
                            type="button"
                            onClick={() => setIsPolicyModalOpen(false)}
                            className="w-full mt-6 bg-[#C9A24B] hover:bg-[#b49147] text-[#061C2B] py-3.5 rounded-xl text-xs font-bold tracking-wider transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer active:scale-[0.99]"
                        >
                            I Understand &amp; Close
                        </button>
                    </div>
                </div>
            )}

            {/* Success Confirmation Modal Popup with comprehensive details breakdown */}
            {isSuccessModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="relative w-full max-w-lg bg-[#F8F5F0] rounded-2xl overflow-hidden shadow-2xl border border-[#C9A24B]/40 p-7 text-center">
                        <button
                            type="button"
                            onClick={() => setIsSuccessModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-[#061C2B] cursor-pointer"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="w-14 h-14 bg-[#063B32] text-[#C9A24B] rounded-full flex items-center justify-center mx-auto mb-3 shadow-md border border-[#C9A24B]">
                            <CheckCircle2 className="w-7 h-7" />
                        </div>

                        <div className="mb-3 px-2">
                            <h3 className="font-serif text-2xl sm:text-3xl leading-tight font-semibold tracking-tight text-[#063B32]">
                                Your escape is reserved!
                            </h3>
                            <div className="mx-auto mt-2 h-0.5 w-12 rounded-full bg-[#C9A24B]" />
                        </div>
                        <p className="text-xs text-gray-500 font-light mb-4">
                            Booking Reference:{' '}
                            <strong className="text-[#063B32] text-sm font-extrabold tracking-wider">
                                SBHR-2026-{String(confirmedBookingId || '00123').padStart(5, '0')}
                            </strong>
                        </p>

                        <div className="bg-white p-4 rounded-xl border border-[#e5dfd4] mb-5 text-left text-xs space-y-2 shadow-xs">
                            <div className="flex justify-between"><span className="text-gray-500">Guest Name:</span> <span className="font-medium text-[#061C2B]">{firstName || 'Valued Guest'} {lastName}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Room:</span> <span className="font-medium text-[#061C2B]">{room.title}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Rooms Reserved:</span> <span className="font-medium text-[#061C2B]">{roomsCount} {Number(roomsCount) > 1 ? 'Rooms' : 'Room'}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Check-in:</span> <span className="font-medium text-[#061C2B]">{checkInDate}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Check-out:</span> <span className="font-medium text-[#061C2B]">{checkOutDate}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Payment:</span> <span className="font-medium text-[#063B32]">{paymentMethod === 'hotel' ? 'Pay at Hotel (Due at property)' : 'Online Payment'}</span></div>
                            <div className="flex justify-between items-baseline pt-2 border-t border-gray-100"><span className="text-gray-700 font-semibold">Total Due:</span> <span className="font-serif text-xl font-bold text-[#C9A24B]">${totalAmount}.00</span></div>
                        </div>

                        <p className="text-[11px] text-gray-500 font-light mb-5">Thank you for choosing Serenity Bay Hotel &amp; Resort. Your booking request has been submitted to the management.</p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSuccessModalOpen(false);
                                    navigate('/my-bookings', {
                                        state: {
                                            recentBooking: {
                                                id: confirmedBookingId,
                                                room_id: Number(room.room_id || room.id) || 1,
                                                room_name: room.title,
                                                image_url: room.images?.[0] || room.image || checkoutHeroImg,
                                                check_in: checkInDate,
                                                check_out: checkOutDate,
                                                guests: (Number(adults) || 1) + (Number(children) || 0),
                                                adults: Number(adults) || 1,
                                                children: Number(children) || 0,
                                                rooms_count: Number(roomsCount) || 1,
                                                total_price: totalAmount,
                                                status: 'PENDING',
                                                payment_method: paymentMethod === 'hotel' ? 'PAY_AT_HOTEL' : 'ONLINE',
                                                special_requests: specialRequests,
                                                guest_first_name: firstName,
                                                guest_last_name: lastName,
                                                guest_email: email,
                                                guest_phone: phone ? `+94${phone}` : '',
                                                residency,
                                                guest_id_number: guestIdNumber,
                                            },
                                        },
                                    });
                                }}
                                className="flex-1 bg-[#063B32] text-[#C9A24B] py-3.5 rounded-xl text-xs font-bold tracking-wider hover:opacity-95 transition shadow-md cursor-pointer flex items-center justify-center gap-2 border border-[#C9A24B]/40"
                            >
                                <span>View My Booking</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsSuccessModalOpen(false);
                                    navigate('/');
                                }}
                                className="flex-1 bg-[#C9A24B] text-[#061C2B] py-3.5 rounded-xl text-xs font-bold tracking-wider hover:bg-[#b49147] transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                            >
                                <span>Back to Home</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
        </div>
    );
}