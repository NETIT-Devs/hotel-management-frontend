import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Calendar, Users, Bed, Check, ArrowRight, X, Lock, CheckCircle2, BedDouble, FileText, Banknote, CreditCard, Info, Eye, Maximize, Moon, Waves, Wifi, Wind, DoorOpen, Utensils, Sparkles, Clock } from 'lucide-react';
// Import local hero banner image asset
import checkoutHeroImg from '../assets/checkoutPageHero.webp';
// Import local asset images for Payment Method step thumbnails
import hotelLobbyImg from '../assets/hotelLobbyImg.webp';   // Thumbnail image for "Pay at Hotel" card
import securePaymentImg from '../assets/securePaymentImg.webp'; // Thumbnail image for "Online Payment" card
import RoomsBanner from '../components/RoomsBanner';

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

    // Multi-step navigation state (1: Stay & Guest Details, 2: Payment Method)
    const [currentStep, setCurrentStep] = useState(1);

    // Form state variables
    const [checkInDate, setCheckInDate] = useState(location.state?.checkInDate || 'Nov 15, 2025');
    const [checkOutDate, setCheckOutDate] = useState(location.state?.checkOutDate || 'Nov 18, 2025');
    const [adults, setAdults] = useState(location.state?.adults || '2');
    const [children, setChildren] = useState(location.state?.children || '0');
    const [roomsCount, setRoomsCount] = useState(location.state?.roomsCount || '1');

    // Guest Information State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [specialRequests, setSpecialRequests] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('hotel'); // Default to Pay at Hotel
    const [agreedTerms, setAgreedTerms] = useState(false);

    // Modal states for success confirmation and cancellation policy view
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
    const [summaryHeight, setSummaryHeight] = useState(null);
    const formRef = useRef(null);

    // Calculate pricing details dynamically
    const basePriceNum = Number(room.price ? room.price.replace(/[^0-9.]/g, '') : 280);
    const nights = 3; // Default sample nights
    const roomRateTotal = basePriceNum * nights * Number(roomsCount);
    const taxesAndFees = Math.round(roomRateTotal * 0.15);

    // Dynamic Offer Discount: Display discount ONLY if room explicitly carries an offer
    const discount = room.discountAmount || 0;
    const totalAmount = roomRateTotal + taxesAndFees - discount;

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
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    /**
     * Handle final booking confirmation and trigger success modal popup.
     */
    const handleConfirmBooking = (e) => {
        e.preventDefault();

        const bookingPayload = {
            roomTitle: room.title,
            checkInDate,
            checkOutDate,
            adults,
            children,
            roomsCount,
            guest: { firstName, lastName, email, phone: `+94${phone}` },
            specialRequests,
            paymentMethod,
            totalAmount
        };
        console.log("Backend Booking Payload Ready:", bookingPayload);

        setIsSuccessModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-[#F8F5F0] text-[#061C2B] relative overflow-x-hidden">

            {/* SEO & Semantic Metadata Container */}
            <div className="sr-only" aria-hidden="false">
                <h1>Secure Booking &amp; Checkout | Serenity Bay Hotel &amp; Resort</h1>
                <p>Complete your luxury reservation at Serenity Bay Resort with best price guarantees and secure checkout options.</p>
            </div>

            {/* Hero Banner Section with Local Asset Image */}
            <header
                className="relative h-[420px] md:h-[550px] bg-cover bg-center flex flex-col justify-center px-6 pt-20 md:px-12 md:pt-28"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(6, 59, 50, 0.88) 0%, rgba(6, 59, 50, 0.5) 40%, rgba(6, 59, 50, 0.15) 70%, rgba(6, 59, 50, 0) 90%), url(${checkoutHeroImg})`
                }}
            >
                <div className="max-w-7xl mx-auto w-full text-left">
                    <span className="text-[#C5A253] tracking-[0.2em] uppercase text-xs font-bold block mb-2">
                        HOME &gt; ROOMS &amp; SUITES &gt; BOOKING
                    </span>
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal mb-3">
                        Reserve Your Stay
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
                                                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={checkInDate}
                                                    readOnly
                                                    aria-label="Check-in Date"
                                                    className="w-full bg-gray-100 border border-[#e5dfd4] rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-700 cursor-not-allowed select-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">Check-out Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                <input
                                                    type="text"
                                                    value={checkOutDate}
                                                    readOnly
                                                    aria-label="Check-out Date"
                                                    className="w-full bg-gray-100 border border-[#e5dfd4] rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-700 cursor-not-allowed select-none"
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
                                                window.scrollTo({ top: 400, behavior: 'smooth' });
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

                                    {/* Main Action CTA Button: Final Confirmation */}
                                    <button
                                        type="submit"
                                        className="w-full bg-[#C9A24B] text-[#061C2B] py-4 rounded-xl text-xs font-bold tracking-wider hover:bg-[#b49147] transition shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-4"
                                        aria-label="Confirm Booking and Review Reservation Details"
                                    >
                                        <span>Review &amp; Confirm</span>
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
                                    src={room.images ? room.images[0] : checkoutHeroImg}
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
                                        <span>{children} {Number(children) > 1 ? 'Children' : 'Child'}</span>
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

                        {/* Price Breakdown */}
                        <div className="space-y-2 text-xs font-light text-gray-200 mb-4 pb-4 border-b border-white/10">
                            <div className="flex justify-between">
                                <span>Room Rate ({nights} nights)</span>
                                <span className="font-medium">${roomRateTotal}.00</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Taxes &amp; Fees</span>
                                <span className="font-medium">${taxesAndFees}.00</span>
                            </div>

                            {discount > 0 && (
                                <div className="flex justify-between text-[#C9A24B]">
                                    <span>Offer Discount ({room.discountPercent || '15%'} OFF)</span>
                                    <span className="font-medium">-${discount}.00</span>
                                </div>
                            )}
                        </div>

                        {/* Total Amount */}
                        <div className="flex justify-between items-baseline mb-6">
                            <span className="text-sm font-medium text-white">Total Amount</span>
                            <span className="font-serif text-3xl font-normal text-[#C9A24B]">${totalAmount}.00</span>
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
                            <strong className="text-[#063B32] text-sm font-extrabold tracking-wider">SBHR-2025-00123</strong>
                        </p>

                        <div className="bg-white p-4 rounded-xl border border-[#e5dfd4] mb-5 text-left text-xs space-y-2 shadow-xs">
                            <div className="flex justify-between"><span className="text-gray-500">Guest Name:</span> <span className="font-medium text-[#061C2B]">{firstName || 'Valued Guest'} {lastName}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Room:</span> <span className="font-medium text-[#061C2B]">{room.title}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Rooms Reserved:</span> <span className="font-medium text-[#061C2B]">{roomsCount} {Number(roomsCount) > 1 ? 'Rooms' : 'Room'}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Check-in:</span> <span className="font-medium text-[#061C2B]">{checkInDate}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Check-out:</span> <span className="font-medium text-[#061C2B]">{checkOutDate}</span></div>
                            <div className="flex justify-between"><span className="text-gray-500">Payment:</span> <span className="font-medium text-[#063B32]">Pay at Hotel (Due at property)</span></div>
                            <div className="flex justify-between items-baseline pt-2 border-t border-gray-100"><span className="text-gray-700 font-semibold">Total Due:</span> <span className="font-serif text-xl font-bold text-[#C9A24B]">${totalAmount}.00</span></div>
                        </div>

                        <p className="text-[11px] text-gray-500 font-light mb-5">Thank you for choosing Serenity Bay Hotel &amp; Resort. We look forward to welcoming you soon!</p>

                        <button
                            type="button"
                            onClick={() => {
                                setIsSuccessModalOpen(false);
                                navigate('/my-bookings');
                            }}
                            className="w-full bg-[#C9A24B] text-[#061C2B] py-3.5 rounded-xl text-xs font-bold tracking-wider hover:bg-[#b49147] transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                        >
                            <span>View Booking Details</span>
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}