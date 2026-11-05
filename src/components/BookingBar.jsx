import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, Users, Globe, Sparkles, Tag, ArrowRight, Plus, Minus, Trash2 } from 'lucide-react';

const cloneRooms = (roomsToClone) =>
    roomsToClone.map((room) => ({
        ...room,
        childAges: [...room.childAges]
    }));

/**
 * BookingBar Component - Professional Luxury Hotel Search Bar
 * 
 * Final Precise Corrections:
 * - Fixed summary display to be completely clean on both desktop and mobile without unwanted line breaks or stray commas.
 * - Restored proper mobile view layout for promo code input section so it never gets cut off.
 * - Maintained automatic live check-in and check-out default dates.
 */
export default function BookingBar() {
    // Get today's and tomorrow's ISO date strings for default live values
    const formatIsoDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const todayObj = new Date();
    const todayIso = formatIsoDate(todayObj);

    const tomorrowObj = new Date(todayObj);
    tomorrowObj.setDate(tomorrowObj.getDate() + 1);
    const tomorrowIso = formatIsoDate(tomorrowObj);

    // Form state management with live default dates
    const [residency, setResidency] = useState('Sri Lankan Resident (LKR)');
    const [checkIn, setCheckIn] = useState(todayIso);
    const [checkOut, setCheckOut] = useState(tomorrowIso);

    // Multi-room state management (Default: 1 Room, 1 Adult, 0 Children)
    const [rooms, setRooms] = useState([
        { id: 1, adults: 1, children: 0, childAges: [] }
    ]);
    const [draftRooms, setDraftRooms] = useState([
        { id: 1, adults: 1, children: 0, childAges: [] }
    ]);

    const [experience, setExperience] = useState('All Rooms & Suites');
    const [promoCode, setPromoCode] = useState('');
    const [ageError, setAgeError] = useState('');

    // Explicit date picker triggers
    const checkInInputRef = useRef(null);
    const checkOutInputRef = useRef(null);

    // Dropdown visibility toggle states
    const [isResidencyOpen, setIsResidencyOpen] = useState(false);
    const [isGuestOpen, setIsGuestOpen] = useState(false);
    const [isExperienceOpen, setIsExperienceOpen] = useState(false);
    const [showPromoInput, setShowPromoInput] = useState(false);
    const [popoverPlacement, setPopoverPlacement] = useState('above');

    // Refs for outside click detection
    const residencyRef = useRef(null);
    const guestRef = useRef(null);
    const experienceRef = useRef(null);

    const updatePopoverPlacement = (targetRef, estimatedHeight) => {
        const target = targetRef.current;
        if (!target) return;

        const bounds = target.getBoundingClientRect();
        const spaceAbove = bounds.top;
        const spaceBelow = window.innerHeight - bounds.bottom;
        setPopoverPlacement(
            spaceBelow < estimatedHeight && spaceAbove > spaceBelow ? 'above' : 'below'
        );
    };

    useEffect(() => {
        const openPopover = isGuestOpen
            ? { ref: guestRef, height: 520 }
            : isResidencyOpen
                ? { ref: residencyRef, height: 150 }
                : isExperienceOpen
                    ? { ref: experienceRef, height: 190 }
                    : null;

        if (!openPopover) return undefined;

        const updatePlacement = () => {
            updatePopoverPlacement(openPopover.ref, openPopover.height);
        };

        updatePlacement();
        window.addEventListener('resize', updatePlacement);
        window.addEventListener('scroll', updatePlacement, true);
        return () => {
            window.removeEventListener('resize', updatePlacement);
            window.removeEventListener('scroll', updatePlacement, true);
        };
    }, [isGuestOpen, isResidencyOpen, isExperienceOpen]);

    useEffect(() => {
        function handleClickOutside(event) {
            if (residencyRef.current && !residencyRef.current.contains(event.target)) {
                setIsResidencyOpen(false);
            }
            if (guestRef.current && !guestRef.current.contains(event.target)) {
                setDraftRooms(cloneRooms(rooms));
                setIsGuestOpen(false);
            }
            if (experienceRef.current && !experienceRef.current.contains(event.target)) {
                setIsExperienceOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [rooms]);

    // Format ISO date string for clean UI display
    const formatDateDisplay = (dateString) => {
        if (!dateString) return 'Select date';
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    // Trigger native calendar picker
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

    // Handler to add a new room configuration
    const handleAddRoom = () => {
        if (draftRooms.length < 5) {
            setDraftRooms([...draftRooms, { id: draftRooms.length + 1, adults: 1, children: 0, childAges: [] }]);
        }
    };

    // Handler to remove a room configuration
    const handleRemoveRoom = (indexToRemove) => {
        if (draftRooms.length > 1) {
            const updatedRooms = draftRooms.filter((_, index) => index !== indexToRemove);
            setDraftRooms(updatedRooms.map((room, idx) => ({ ...room, id: idx + 1 })));
        }
    };

    // Handler to update adult or child count for a room
    const handleRoomGuestChange = (index, type, delta) => {
        const updatedRooms = cloneRooms(draftRooms);
        if (type === 'adults') {
            updatedRooms[index].adults = Math.max(1, updatedRooms[index].adults + delta);
        } else if (type === 'children') {
            const newCount = Math.max(0, updatedRooms[index].children + delta);
            updatedRooms[index].children = newCount;

            if (newCount > updatedRooms[index].childAges.length) {
                updatedRooms[index].childAges.push('');
            } else {
                updatedRooms[index].childAges = updatedRooms[index].childAges.slice(0, newCount);
            }
        }
        setDraftRooms(updatedRooms);
        setAgeError('');
    };

    // Handler to update child age
    const handleChildAgeChange = (roomIndex, childIndex, ageValue) => {
        const updatedRooms = cloneRooms(draftRooms);
        updatedRooms[roomIndex].childAges[childIndex] = ageValue;
        setDraftRooms(updatedRooms);
        setAgeError('');
    };

    // Summary counters
    const totalRooms = rooms.length;
    const totalAdults = rooms.reduce((sum, room) => sum + room.adults, 0);
    const totalChildren = rooms.reduce((sum, room) => sum + room.children, 0);

    // Validate child ages before closing guest dropdown
    const handleDoneSelectingGuests = () => {
        for (let room of draftRooms) {
            for (let age of room.childAges) {
                if (age === '' || age === undefined) {
                    setAgeError("Specify the child's age");
                    return;
                }
            }
        }
        setAgeError('');
        setRooms(cloneRooms(draftRooms));
        setIsGuestOpen(false);
    };

    // Form submission handler
    const handleSearch = (e) => {
        e.preventDefault();

        for (let room of rooms) {
            for (let age of room.childAges) {
                if (age === '' || age === undefined) {
                    setIsGuestOpen(true);
                    setAgeError("Specify the child's age");
                    return;
                }
            }
        }

        const searchPayload = {
            residency,
            checkIn: checkIn || todayIso,
            checkOut: checkOut || tomorrowIso,
            roomsDetails: rooms,
            totalRooms,
            totalAdults,
            totalChildren,
            experience,
            promoCode: promoCode.trim() || null
        };
        console.log("Submitting Luxury Booking Payload:", searchPayload);
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
                            updatePopoverPlacement(residencyRef, 150);
                            setIsResidencyOpen(!isResidencyOpen);
                            setIsGuestOpen(false);
                            setIsExperienceOpen(false);
                        }}
                        className="flex items-center gap-3 w-full text-left focus:outline-none cursor-pointer"
                        aria-expanded={isResidencyOpen}
                        aria-haspopup="listbox"
                    >
                        <Globe className="w-5 h-5 text-[#C9A24B] shrink-0" />
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
                        <div className={`absolute ${popoverPlacement === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'} left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-[280px] md:left-0 md:translate-x-0 md:w-full md:min-w-[220px] md:max-w-none bg-white p-2 rounded-xl shadow-2xl border border-gray-100 z-50 flex flex-col`}>
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
                        <CalendarIcon className="w-5 h-5 text-[#C9A24B] shrink-0" />
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
                                min={todayIso}
                                value={checkIn}
                                onChange={(e) => {
                                    const nextCheckIn = e.target.value;
                                    const nextCheckOut = new Date(`${nextCheckIn}T00:00:00`);
                                    nextCheckOut.setDate(nextCheckOut.getDate() + 1);
                                    setCheckIn(nextCheckIn);
                                    setCheckOut(formatIsoDate(nextCheckOut));
                                }}
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
                        <CalendarIcon className="w-5 h-5 text-[#C9A24B] shrink-0" />
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
                                min={checkIn || todayIso}
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer pointer-events-auto"
                                aria-label="Select Check-out date"
                            />
                        </div>
                    </div>
                </div>

                {/* 4. Multi-Room & Guest Popover */}
                <div className="relative px-3 py-2 border-b sm:border-b-0 sm:border-r border-gray-200" ref={guestRef}>
                    <button
                        type="button"
                        onClick={() => {
                            updatePopoverPlacement(guestRef, 520);
                            if (!isGuestOpen) {
                                setDraftRooms(cloneRooms(rooms));
                            } else {
                                setDraftRooms(cloneRooms(rooms));
                            }
                            setIsGuestOpen(!isGuestOpen);
                            setIsResidencyOpen(false);
                            setIsExperienceOpen(false);
                        }}
                        className="flex items-center gap-3 w-full text-left focus:outline-none cursor-pointer"
                        aria-expanded={isGuestOpen}
                        aria-haspopup="dialog"
                    >
                        <Users className="w-5 h-5 text-[#C9A24B] shrink-0" />
                        <div className="flex flex-col w-full">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
                                GUESTS &amp; ROOMS
                            </span>
                            <span className="text-xs md:text-sm font-semibold text-gray-800 whitespace-normal leading-tight">
                                {totalRooms} {totalRooms === 1 ? 'Room' : 'Rooms'}, {totalAdults} {totalAdults === 1 ? 'Adult' : 'Adults'}
                                {totalChildren > 0 && (
                                    <>
                                        <span className="md:hidden">
                                            , {totalChildren} {totalChildren === 1 ? 'Child' : 'Children'}
                                        </span>
                                        <span className="hidden md:block">
                                            {totalChildren} {totalChildren === 1 ? 'Child' : 'Children'}
                                        </span>
                                    </>
                                )}
                            </span>
                        </div>
                    </button>

                    {isGuestOpen && (
                        <div className={`absolute ${popoverPlacement === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'} left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-[400px] md:left-0 md:translate-x-0 md:w-[400px] bg-white p-4 md:p-5 rounded-2xl shadow-2xl border border-gray-100 z-50 flex flex-col gap-4 max-h-[70vh] md:max-h-[480px] overflow-y-auto`}>
                            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">Guests &amp; Rooms</h4>
                                <span className="text-[10px] text-gray-400 font-medium">Max 5 rooms</span>
                            </div>

                            {/* Map through each room configuration */}
                            <div className="space-y-4">
                                {draftRooms.map((room, roomIndex) => (
                                    <div key={room.id} className="p-4 bg-gray-50/90 rounded-xl border border-gray-200 space-y-3 shadow-xs">
                                        <div className="flex items-center justify-between pb-1">
                                            {/* Room title colored in luxury gold */}
                                            <span className="text-xs font-bold text-[#C9A24B] uppercase tracking-wider">
                                                ROOM {room.id}
                                            </span>
                                            {draftRooms.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveRoom(roomIndex)}
                                                    className="text-red-500 hover:text-red-700 p-1 transition cursor-pointer"
                                                    aria-label={`Remove Room ${room.id}`}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Side-by-Side 2-Column Grid for Adults and Children */}
                                        <div className="grid grid-cols-2 gap-3 items-center">
                                            {/* Adults Box */}
                                            <div className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col justify-between h-full shadow-xs">
                                                <div className="mb-2">
                                                    <p className="text-xs font-bold text-gray-800">Adults</p>
                                                    <p className="text-[10px] text-gray-400">Ages 13+</p>
                                                </div>
                                                <div className="flex items-center justify-between bg-gray-50 p-1.5 rounded-md border border-gray-200">
                                                    <button
                                                        type="button"
                                                        disabled={room.adults <= 1}
                                                        onClick={() => handleRoomGuestChange(roomIndex, 'adults', -1)}
                                                        className={`w-7 h-7 rounded flex items-center justify-center transition ${room.adults <= 1
                                                            ? 'text-gray-300 cursor-not-allowed'
                                                            : 'text-gray-700 hover:bg-gray-200 cursor-pointer'
                                                            }`}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-xs font-bold">{room.adults}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRoomGuestChange(roomIndex, 'adults', 1)}
                                                        className="w-7 h-7 rounded text-gray-700 hover:bg-gray-200 flex items-center justify-center transition cursor-pointer"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Children Box */}
                                            <div className="bg-white p-3 rounded-lg border border-gray-200 flex flex-col justify-between h-full shadow-xs">
                                                <div className="mb-2">
                                                    <p className="text-xs font-bold text-gray-800 leading-tight">Children</p>
                                                    <p className="text-[10px] text-gray-400">Under 12 yrs</p>
                                                </div>
                                                <div className="flex items-center justify-between bg-gray-50 p-1.5 rounded-md border border-gray-200">
                                                    <button
                                                        type="button"
                                                        disabled={room.children <= 0}
                                                        onClick={() => handleRoomGuestChange(roomIndex, 'children', -1)}
                                                        className={`w-7 h-7 rounded flex items-center justify-center transition ${room.children <= 0
                                                            ? 'text-gray-300 cursor-not-allowed'
                                                            : 'text-gray-700 hover:bg-gray-200 cursor-pointer'
                                                            }`}
                                                    >
                                                        <Minus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-xs font-bold">{room.children}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRoomGuestChange(roomIndex, 'children', 1)}
                                                        className="w-7 h-7 rounded text-gray-700 hover:bg-gray-200 flex items-center justify-center transition cursor-pointer"
                                                    >
                                                        <Plus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dynamic Child Age Selectors */}
                                        {room.children > 0 && (
                                            <div className="space-y-2.5 pt-3 border-t border-gray-200">
                                                {room.childAges.map((age, childIdx) => (
                                                    <div key={childIdx} className="grid grid-cols-2 items-center gap-3">
                                                        <span className="text-xs text-gray-700 font-medium">
                                                            {childIdx + 1}{childIdx === 0 ? 'st' : childIdx === 1 ? 'nd' : childIdx === 2 ? 'rd' : 'th'} child's age
                                                        </span>
                                                        <select
                                                            value={age}
                                                            onChange={(e) => handleChildAgeChange(roomIndex, childIdx, e.target.value)}
                                                            className="bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:border-[#C9A24B] shadow-xs"
                                                        >
                                                            <option value="">Select age</option>
                                                            <option value="Under 1">under 1 year old</option>
                                                            <option value="1">1 year old</option>
                                                            <option value="2">2 years old</option>
                                                            <option value="3">3 years old</option>
                                                            <option value="4">4 years old</option>
                                                            <option value="5">5 years old</option>
                                                            <option value="6">6 years old</option>
                                                            <option value="7">7 years old</option>
                                                            <option value="8">8 years old</option>
                                                            <option value="9">9 years old</option>
                                                            <option value="10">10 years old</option>
                                                            <option value="11">11 years old</option>
                                                        </select>
                                                    </div>
                                                ))}

                                                {/* Error banner */}
                                                {ageError && room.childAges.some(a => !a) && (
                                                    <div className="bg-red-500 text-white text-[11px] px-3 py-1.5 rounded-md text-center font-medium shadow-sm">
                                                        {ageError}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Add Room Button & Gold Done CTA */}
                            <div className="pt-2 flex flex-col gap-2">
                                {draftRooms.length < 5 && (
                                    <button
                                        type="button"
                                        onClick={handleAddRoom}
                                        className="w-full py-2.5 border border-dashed border-[#C9A24B] text-[#C9A24B] rounded-xl text-xs font-semibold hover:bg-[#C9A24B]/5 transition cursor-pointer flex items-center justify-center gap-1.5"
                                    >
                                        <Plus className="w-4 h-4" /> Add another room
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={handleDoneSelectingGuests}
                                    className="w-full bg-[#C9A24B] text-[#061C2B] py-3 rounded-xl text-xs font-bold hover:bg-[#b49147] transition cursor-pointer shadow-md"
                                >
                                    Done
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 5. Experience Package Selector */}
                <div className="relative px-3 py-2 border-b sm:border-b-0 lg:border-r border-gray-200" ref={experienceRef}>
                    <button
                        type="button"
                        onClick={() => {
                            updatePopoverPlacement(experienceRef, 190);
                            setIsExperienceOpen(!isExperienceOpen);
                            setIsResidencyOpen(false);
                            setDraftRooms(cloneRooms(rooms));
                            setIsGuestOpen(false);
                        }}
                        className="flex items-center gap-3 w-full text-left focus:outline-none cursor-pointer"
                        aria-expanded={isExperienceOpen}
                        aria-haspopup="listbox"
                    >
                        <Sparkles className="w-5 h-5 text-[#C9A24B] shrink-0" />
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
                        <div className={`absolute ${popoverPlacement === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'} left-1/2 -translate-x-1/2 w-[calc(100vw-2rem)] max-w-[300px] md:left-0 md:translate-x-0 md:w-full md:min-w-[240px] md:max-w-none bg-white p-2 rounded-xl shadow-2xl border border-gray-100 z-50 flex flex-col`}>
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
                        className="w-full bg-[#C9A24B] hover:bg-[#b49147] text-[#061C2B] font-bold text-xs md:text-sm py-3.5 px-6 rounded-xl md:rounded-2xl transition duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                    >
                        Check Availability <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

            </div>

            {/* Bottom Row: Fully Responsive Promo Code Section */}
            <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between pt-2 border-t border-gray-100 px-2 text-xs gap-3">
                <button
                    type="button"
                    onClick={() => setShowPromoInput(!showPromoInput)}
                    className="text-[#C9A24B] hover:underline font-semibold flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                    <Tag className="w-3.5 h-3.5" />
                    {showPromoInput ? 'Hide promo code' : 'I have a promo code'}
                </button>

                {showPromoInput && (
                    <div className="w-auto max-w-full flex items-center gap-2 my-0.5">
                        <input
                            type="text"
                            placeholder="Promo code (e.g., SERENITY20)"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            className="w-[220px] max-w-full sm:w-56 bg-gray-50 border border-gray-300 text-xs px-3 py-2 rounded-lg text-gray-800 placeholder-gray-400 font-medium focus:outline-none focus:border-[#C9A24B] focus:bg-white transition-all shadow-inner"
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