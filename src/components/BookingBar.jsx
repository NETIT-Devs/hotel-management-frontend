import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, Users, Globe, Sparkles, Tag, ArrowRight, Plus, Minus } from 'lucide-react';

/**
 * BookingBar Component
 * Fully responsive hotel search floating bar with interactive popovers.
 * Features:
 * - Dynamic date inputs with min-date validations
 * - Fully accessible ARIA attributes for strong SEO compliance
 * - Clean English code documentation and mobile-first responsive layout
 */
export default function BookingBar() {
    // Form state management
    const [residency, setResidency] = useState('Sri Lankan Resident (LKR)');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [adults, setAdults] = useState(2);
    const [children, setChildren] = useState(0);
    const [experience, setExperience] = useState('All Rooms & Suites');
    const [promoCode, setPromoCode] = useState('');

    // Refs for explicit date picker triggers
    const checkInInputRef = useRef(null);
    const checkOutInputRef = useRef(null);

    // Dropdown visibility toggle states
    const [isResidencyOpen, setIsResidencyOpen] = useState(false);
    const [isGuestOpen, setIsGuestOpen] = useState(false);
    const [isExperienceOpen, setIsExperienceOpen] = useState(false);
    const [showPromoInput, setShowPromoInput] = useState(false);

    // Refs for outside click detection
    const residencyRef = useRef(null);
    const guestRef = useRef(null);
    const experienceRef = useRef(null);

    // Get today's ISO date string to prevent selecting past dates
    const today = new Date().toISOString().split('T')[0];

    useEffect(() => {
        function handleClickOutside(event) {
            if (residencyRef.current && !residencyRef.current.contains(event.target)) {
                setIsResidencyOpen(false);
            }
            if (guestRef.current && !guestRef.current.contains(event.target)) {
                setIsGuestOpen(false);
            }
            if (experienceRef.current && !experienceRef.current.contains(event.target)) {
                setIsExperienceOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Format ISO date string for clean UI display
    const formatDateDisplay = (dateString) => {
        if (!dateString) return 'Select date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    // Safely trigger native browser calendar picker
    const triggerDatePicker = (inputRef) => {
        if (inputRef.current) {
            if ('showPicker' in HTMLInputElement.prototype) {
                try {
                    inputRef.current.showPicker();
                } catch {
                    inputRef.current.focus();
                }
            } else {
                inputRef.current.focus();
            }
        }
    };

    // Form submission handler
    const handleSearch = (e) => {
        e.preventDefault();
        const searchPayload = {
            residency,
            checkIn: checkIn || 'Not selected',
            checkOut: checkOut || 'Not selected',
            adults,
            children,
            experience,
            promoCode: promoCode.trim() || null
        };
        console.log("Submitting Search Payload:", searchPayload);
    };

    return (
        <form
            onSubmit={handleSearch}
            aria-label="Hotel Room Availability Search"
            className="w-full bg-white/95 backdrop-blur-md rounded-2xl md:rounded-3xl p-4 md:p-3 shadow-2xl border border-white/60 flex flex-col gap-3 text-black relative z-30"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 items-center">

                {/* 1. Residency / Currency Selector */}
                <div className="relative px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-200" ref={residencyRef}>
                    <button
                        type="button"
                        onClick={() => {
                            setIsResidencyOpen(!isResidencyOpen);
                            setIsGuestOpen(false);
                            setIsExperienceOpen(false);
                        }}
                        className="flex items-center gap-3 w-full text-left focus:outline-none cursor-pointer"
                        aria-expanded={isResidencyOpen}
                        aria-haspopup="listbox"
                    >
                        <Globe className="w-5 h-5 text-[#b8972e] shrink-0" />
                        <div className="flex flex-col w-full">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                                RESIDENCY / CURRENCY
                            </span>
                            <span className="text-xs md:text-sm font-semibold text-gray-800 truncate">
                                {residency}
                            </span>
                        </div>
                    </button>

                    {isResidencyOpen && (
                        <div className="absolute top-full sm:top-auto sm:bottom-full left-0 mt-2 sm:mt-0 sm:mb-3 w-full min-w-[220px] bg-white p-2 rounded-xl shadow-2xl border border-gray-100 z-50 flex flex-col">
                            <button
                                type="button"
                                onClick={() => { setResidency('Non-Resident (USD)'); setIsResidencyOpen(false); }}
                                className="text-left text-xs px-3 py-2.5 rounded-lg hover:bg-gray-100 font-medium transition cursor-pointer"
                            >
                                Non-Resident (USD $)
                            </button>
                            <button
                                type="button"
                                onClick={() => { setResidency('Sri Lankan Resident (LKR)'); setIsResidencyOpen(false); }}
                                className="text-left text-xs px-3 py-2.5 rounded-lg hover:bg-gray-100 font-medium transition border-t border-gray-50 cursor-pointer"
                            >
                                Sri Lankan Resident (LKR Rs)
                            </button>
                        </div>
                    )}
                </div>

                {/* 2. Check-In Date Field */}
                <div
                    onClick={() => triggerDatePicker(checkInInputRef)}
                    className="relative px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-200 cursor-pointer group"
                >
                    <div className="flex items-center gap-3 w-full">
                        <CalendarIcon className="w-5 h-5 text-[#b8972e] shrink-0" />
                        <div className="flex flex-col w-full">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                                CHECK-IN
                            </span>
                            <span className="text-xs md:text-sm font-semibold text-gray-800">
                                {formatDateDisplay(checkIn)}
                            </span>
                            <input
                                ref={checkInInputRef}
                                type="date"
                                min={today}
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer pointer-events-auto"
                                aria-label="Select Check-in date"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Check-Out Date Field */}
                <div
                    onClick={() => triggerDatePicker(checkOutInputRef)}
                    className="relative px-3 py-2 border-b sm:border-b-0 lg:border-r border-gray-200 cursor-pointer group"
                >
                    <div className="flex items-center gap-3 w-full">
                        <CalendarIcon className="w-5 h-5 text-[#b8972e] shrink-0" />
                        <div className="flex flex-col w-full">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                                CHECK-OUT
                            </span>
                            <span className="text-xs md:text-sm font-semibold text-gray-800">
                                {formatDateDisplay(checkOut)}
                            </span>
                            <input
                                ref={checkOutInputRef}
                                type="date"
                                min={checkIn || today}
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer pointer-events-auto"
                                aria-label="Select Check-out date"
                            />
                        </div>
                    </div>
                </div>

                {/* 4. Guest Counter Popover */}
                <div className="relative px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-200" ref={guestRef}>
                    <button
                        type="button"
                        onClick={() => {
                            setIsGuestOpen(!isGuestOpen);
                            setIsResidencyOpen(false);
                            setIsExperienceOpen(false);
                        }}
                        className="flex items-center gap-3 w-full text-left focus:outline-none cursor-pointer"
                        aria-expanded={isGuestOpen}
                        aria-haspopup="dialog"
                    >
                        <Users className="w-5 h-5 text-[#b8972e] shrink-0" />
                        <div className="flex flex-col w-full">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                                GUESTS
                            </span>
                            <span className="text-xs md:text-sm font-semibold text-gray-800 truncate">
                                {adults} Adults · {children} Children
                            </span>
                        </div>
                    </button>

                    {isGuestOpen && (
                        <div className="absolute top-full sm:top-auto sm:bottom-full left-0 mt-2 sm:mt-0 sm:mb-3 w-64 bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-gray-800">Adults</p>
                                    <p className="text-[10px] text-gray-400">Ages 13 and above</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setAdults(Math.max(1, adults - 1))}
                                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                                        aria-label="Decrease adults"
                                    >
                                        <Minus className="w-3 h-3 text-gray-600" />
                                    </button>
                                    <span className="text-xs font-bold w-4 text-center">{adults}</span>
                                    <button
                                        type="button"
                                        onClick={() => setAdults(adults + 1)}
                                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                                        aria-label="Increase adults"
                                    >
                                        <Plus className="w-3 h-3 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                                <div>
                                    <p className="text-xs font-bold text-gray-800">Children</p>
                                    <p className="text-[10px] text-gray-400">Ages 0 - 12 years</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setChildren(Math.max(0, children - 1))}
                                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                                        aria-label="Decrease children"
                                    >
                                        <Minus className="w-3 h-3 text-gray-600" />
                                    </button>
                                    <span className="text-xs font-bold w-4 text-center">{children}</span>
                                    <button
                                        type="button"
                                        onClick={() => setChildren(children + 1)}
                                        className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 cursor-pointer"
                                        aria-label="Increase children"
                                    >
                                        <Plus className="w-3 h-3 text-gray-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 5. Experience Package Selector */}
                <div className="relative px-3 py-2 border-b sm:border-b-0 lg:border-r border-gray-200" ref={experienceRef}>
                    <button
                        type="button"
                        onClick={() => {
                            setIsExperienceOpen(!isExperienceOpen);
                            setIsResidencyOpen(false);
                            setIsGuestOpen(false);
                        }}
                        className="flex items-center gap-3 w-full text-left focus:outline-none cursor-pointer"
                        aria-expanded={isExperienceOpen}
                        aria-haspopup="listbox"
                    >
                        <Sparkles className="w-5 h-5 text-[#b8972e] shrink-0" />
                        <div className="flex flex-col w-full">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                                EXPERIENCE PACKAGE
                            </span>
                            <span className="text-xs md:text-sm font-semibold text-gray-800 truncate">
                                {experience}
                            </span>
                        </div>
                    </button>

                    {isExperienceOpen && (
                        <div className="absolute top-full sm:top-auto sm:bottom-full left-0 mt-2 sm:mt-0 sm:mb-3 w-full min-w-[240px] bg-white p-2 rounded-xl shadow-2xl border border-gray-100 z-50 flex flex-col">
                            {[
                                'All Rooms & Suites',
                                'Honeymoon & Romantic Getaway',
                                'Luxury Private Pool Villa',
                                'Wellness & Ayurveda Retreat'
                            ].map((item, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => { setExperience(item); setIsExperienceOpen(false); }}
                                    className="text-left text-xs px-3 py-2.5 rounded-lg hover:bg-gray-100 font-medium transition cursor-pointer"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* 6. Check Availability Submit CTA */}
                <div className="p-1">
                    <button
                        type="submit"
                        className="w-full bg-[#b8972e] hover:bg-[#a68525] text-black font-semibold text-xs md:text-sm py-3.5 px-6 rounded-xl md:rounded-2xl transition duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                        Check Availability <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

            </div>

            {/* Bottom Row: Compact Promo Code Toggle & Input */}
            <div className="flex flex-wrap items-center justify-between pt-2 border-t border-gray-100 px-2 text-xs gap-2">
                <button
                    type="button"
                    onClick={() => setShowPromoInput(!showPromoInput)}
                    className="text-[#b8972e] hover:underline font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                    <Tag className="w-3.5 h-3.5" />
                    {showPromoInput ? 'Hide promo code' : 'I have a promo code'}
                </button>

                {showPromoInput && (
                    <div className="flex items-center gap-2 my-0.5">
                        <input
                            type="text"
                            placeholder="Promo code (e.g., SERENITY20)"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="w-48 sm:w-56 bg-gray-50 border border-gray-300 text-xs px-3 py-1.5 rounded-lg text-gray-800 placeholder-gray-400 font-medium focus:outline-none focus:border-[#b8972e] focus:bg-white transition-all shadow-inner"
                            autoFocus
                        />
                    </div>
                )}

                <span className="text-[11px] text-gray-400 hidden sm:inline shrink-0">
                    Best Rate Guaranteed · Secure Booking
                </span>
            </div>
        </form>
    );
}