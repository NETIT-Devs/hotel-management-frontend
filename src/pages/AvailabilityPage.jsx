import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import {
    Calendar,
    Users,
    BedDouble,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Sparkles,
    Search,
    Maximize2,
    ShieldCheck,
    Clock,
    Tag
} from 'lucide-react';
import { ROOMS_DATA } from '../constants/hotelData';
import RoomsBanner from '../components/RoomsBanner';
import roomsHeroImg from '../assets/roomsPageHero.webp';

export default function AvailabilityPage() {
    const location = useLocation();
    const navigate = useNavigate();

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

    const [checkIn, setCheckIn] = useState(location.state?.checkIn || todayIso);
    const [checkOut, setCheckOut] = useState(
        location.state?.checkOut || formatIso(defaultCheckOut)
    );
    const [adults, setAdults] = useState(Number(location.state?.totalAdults) || 2);
    const [children, setChildren] = useState(Number(location.state?.totalChildren) || 0);
    const [roomsCount, setRoomsCount] = useState(Number(location.state?.totalRooms) || 1);
    const [selectedType, setSelectedType] = useState('ALL');
    const [promoCode, setPromoCode] = useState(location.state?.promoCode || '');
    const [residency, setResidency] = useState(
        location.state?.residency === 'Resident' ? 'Resident' : 'Non-Resident'
    );
    const selectedRoomId = location.state?.selectedRoomId
        ? Number(location.state.selectedRoomId)
        : null;

    const [availabilityData, setAvailabilityData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastChecked, setLastChecked] = useState('');

    // Calculate nights
    const inTime = new Date(checkIn).getTime();
    const outTime = new Date(checkOut).getTime();
    const nights = Math.max(1, Math.round((outTime - inTime) / (1000 * 60 * 60 * 24)) || 1);

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

                    return {
                        ...staticMatch,
                        id: dbRoom.id,
                        title: dbRoom.room_name || staticMatch.title,
                        room_type: dbRoom.room_type || 'DELUXE',
                        description: dbRoom.description || staticMatch.description,
                        price: `$${nightlyRate.toFixed(0)}`,
                        price_per_night: nightlyRate,
                        resident_price_per_night: residentRate,
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

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        fetchLiveAvailability();
    }, []);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchLiveAvailability(checkIn, checkOut, adults, children, roomsCount);
    };

    const filteredRooms = availabilityData.filter((room) => {
        if (selectedType === 'ALL') return true;
        return String(room.room_type).toUpperCase() === selectedType;
    });

    const selectedRoomItem = selectedRoomId
        ? availabilityData.find((r) => Number(r.id) === selectedRoomId)
        : null;
    const otherRooms = selectedRoomItem
        ? filteredRooms.filter((r) => Number(r.id) !== selectedRoomId)
        : filteredRooms;

    const availableRoomsCount = filteredRooms.filter((r) => r.is_available).length;
    const isResident = residency === 'Resident';

    return (
        <main className="min-h-screen bg-[#F8F5F0] text-[#061C2B] overflow-x-hidden">
            {/* ================= HERO BANNER ================= */}
            <header
                className="relative h-[400px] md:h-[500px] bg-cover bg-center flex flex-col justify-center px-6 pt-20 md:px-12 md:pt-28"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(6, 59, 50, 0.9) 0%, rgba(6, 59, 50, 0.6) 50%, rgba(6, 59, 50, 0.2) 90%), url(${roomsHeroImg})`
                }}
            >
                <div className="max-w-7xl mx-auto w-full text-left animate-[fadeInUp_0.8s_ease-out]">
                    <span className="text-[#C9A24B] tracking-[0.25em] uppercase text-xs font-bold block mb-2">
                        REAL-TIME RESERVATION ENGINE
                    </span>
                    <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal mb-3">
                        Check Live Room Availability
                    </h1>
                    <p className="text-gray-200 text-xs sm:text-sm md:text-base font-light max-w-xl leading-relaxed">
                        Select your preferred check-in and check-out dates to view real-time suite inventory, instant total stay rates, and reserve your coastal sanctuary.
                    </p>
                </div>
            </header>

            {/* ================= LIVE AVAILABILITY SEARCH BAR ================= */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-14 relative z-20 mb-12">
                <form
                    onSubmit={handleSearchSubmit}
                    className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-[#C9A24B]/40"
                >
                    {/* Step 1 + Residency Switcher Row */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 mb-5 border-b border-gray-100">
                        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                            <span className="bg-[#063B32] text-[#C9A24B] px-3 py-1 rounded-full">1. Select Dates &amp; Residency</span>
                            <span className="text-gray-400">→</span>
                            <span className="bg-[#FAF8F5] text-[#061C2B] border border-[#C9A24B]/30 px-3 py-1 rounded-full">2. Verify Live Availability</span>
                            <span className="text-gray-400">→</span>
                            <span className="bg-[#FAF8F5] text-gray-500 border border-gray-200 px-3 py-1 rounded-full">3. Confirm &amp; Checkout</span>
                        </div>

                        {/* Resident vs Non-Resident Toggle */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                                Guest Residency:
                            </span>
                            <div className="inline-flex bg-[#FAF8F5] p-1 rounded-xl border border-[#C9A24B]/35">
                                <button
                                    type="button"
                                    onClick={() => setResidency('Non-Resident')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                        residency === 'Non-Resident'
                                            ? 'bg-[#063B32] text-[#C9A24B] shadow-sm'
                                            : 'text-gray-600 hover:text-[#061C2B]'
                                    }`}
                                >
                                    Non-Resident (International)
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setResidency('Resident')}
                                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                                        residency === 'Resident'
                                            ? 'bg-[#063B32] text-[#C9A24B] shadow-sm'
                                            : 'text-gray-600 hover:text-[#061C2B]'
                                    }`}
                                >
                                    Sri Lankan Resident (NIC)
                                </button>
                            </div>
                        </div>
                    </div>

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

                        {/* Children */}
                        <div>
                            <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5">
                                Children (0-12)
                            </label>
                            <select
                                value={children}
                                onChange={(e) => setChildren(Number(e.target.value))}
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
                            {promoCode && (
                                <span className="inline-flex items-center gap-1 text-[#C9A24B] font-bold">
                                    <Tag className="w-3.5 h-3.5" /> Promo: {promoCode}
                                </span>
                            )}
                        </div>

                        {/* Room Type Filter Pills */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {['ALL', 'DELUXE', 'SUITE', 'FAMILY'].map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setSelectedType(type)}
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
                    </div>
                </form>
            </section>

            {/* ================= RESULTS HEADER ================= */}
            <section className="max-w-7xl mx-auto px-5 md:px-8 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#063B32] text-white px-6 py-4 rounded-2xl border border-[#C9A24B]/30 shadow-md">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-[#C9A24B] shrink-0" />
                        <div>
                            <h2 className="font-serif text-lg sm:text-xl font-normal">
                                {loading
                                    ? 'Checking real-time room inventory...'
                                    : `${availableRoomsCount} of ${filteredRooms.length} Room Categories Available for Your Dates`}
                            </h2>
                            <p className="text-[11px] text-gray-300 font-light">
                                Live inventory verified against current hotel reservations {lastChecked && `at ${lastChecked}`}
                            </p>
                        </div>
                    </div>
                    <span className="text-[11px] font-semibold text-[#C9A24B] uppercase tracking-widest">
                        Best Rate Guaranteed
                    </span>
                </div>
            </section>

            {/* ================= AVAILABILITY CARDS ================= */}
            <section className="max-w-7xl mx-auto px-5 md:px-8 pb-20">
                {loading ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-md border border-[#C9A24B]/20">
                        <p className="text-sm text-gray-500">Checking live room availability for {checkIn} to {checkOut}...</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {(() => {
                            const renderRoomCard = (room, isHighlighted = false) => {
                                const activeRate = isResident
                                    ? Number(room.resident_price_per_night) || Math.round(Number(room.price_per_night) * 0.75)
                                    : Number(room.price_per_night) || 280;
                                const regularRate = Number(room.price_per_night) || 280;
                                const totalStayPrice = activeRate * nights * roomsCount;
                                const isAvailable = room.is_available;
                                const isLowStock = isAvailable && room.available_units <= 3;
                                const exceedsCapacity = !room.meets_capacity;

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
                                        {/* Room Image (4 Cols) */}
                                        <div className="lg:col-span-4 relative min-h-[240px] bg-gray-100">
                                            <img
                                                src={room.images?.[0] || roomsHeroImg}
                                                alt={room.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <span className="absolute top-4 left-4 bg-[#061C2B]/85 text-[#C9A24B] text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">
                                                {isHighlighted ? 'YOUR SELECTED SUITE' : room.room_type}
                                            </span>

                                            {/* Live Status Pill */}
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
                                                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A24B]" />
                                                        <span>
                                                            {room.available_units} {room.available_units === 1 ? 'Room' : 'Rooms'} Available
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle className="w-3.5 h-3.5" />
                                                        <span>
                                                            {room.status === 'MAINTENANCE' ? 'Under Maintenance' : 'Sold Out for Selected Dates'}
                                                        </span>
                                                    </>
                                                )}
                                            </span>
                                        </div>

                                        {/* Room Details (5 Cols) */}
                                        <div className="lg:col-span-5 p-6 sm:p-7 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between gap-2 mb-2">
                                                    <h3 className="font-serif text-2xl font-semibold text-[#061C2B]">
                                                        {room.title}
                                                    </h3>
                                                </div>

                                                <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed mb-4">
                                                    {room.description}
                                                </p>

                                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-700 py-3 border-y border-gray-100 mb-4">
                                                    <span className="flex items-center gap-1.5">
                                                        <BedDouble className="w-4 h-4 text-[#C9A24B]" /> {room.bed}
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Users className="w-4 h-4 text-[#C9A24B]" /> Up to {room.capacity} Guests / Room
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Maximize2 className="w-4 h-4 text-[#C9A24B]" /> {room.size}
                                                    </span>
                                                </div>

                                                {exceedsCapacity && isAvailable && (
                                                    <div className="mb-3 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold flex items-center gap-2">
                                                        <AlertCircle className="w-4 h-4 shrink-0" />
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

                                            <div className="mt-4 pt-3 flex items-center justify-between text-xs">
                                                <Link
                                                    to={`/rooms/${room.id}`}
                                                    className="font-bold text-[#C9A24B] hover:underline inline-flex items-center gap-1"
                                                >
                                                    <span>View Room Details &amp; Gallery</span>
                                                    <ArrowRight className="w-3.5 h-3.5" />
                                                </Link>
                                                <span className="text-gray-400">
                                                    Total Inventory: {room.total_units} rooms
                                                </span>
                                            </div>
                                        </div>

                                        {/* Rate & Book CTA Column (3 Cols) */}
                                        <div className="lg:col-span-3 bg-[#FAF8F5] p-6 sm:p-7 border-t lg:border-t-0 lg:border-l border-[#C9A24B]/25 flex flex-col justify-between">
                                            <div>
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                                                        {isResident ? 'Sri Lankan Resident Rate' : 'Non-Resident Rate'}
                                                    </span>
                                                    {isResident && (
                                                        <span className="text-[10px] font-bold bg-[#063B32] text-[#C9A24B] px-2 py-0.5 rounded-full">
                                                            LOCAL RATE
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-baseline gap-2 mt-1">
                                                    {isResident && regularRate > activeRate && (
                                                        <span className="text-sm text-gray-400 line-through">
                                                            ${regularRate}
                                                        </span>
                                                    )}
                                                    <span className="font-serif text-2xl font-bold text-[#061C2B]">
                                                        ${activeRate}
                                                    </span>
                                                    <span className="text-xs text-gray-500">/ night</span>
                                                </div>

                                                <div className="mt-4 p-3.5 bg-white rounded-2xl border border-[#C9A24B]/30">
                                                    <span className="text-[10px] uppercase tracking-wider text-gray-400 block">
                                                        Estimated Stay Total ({nights} {nights === 1 ? 'Night' : 'Nights'} · {roomsCount} {roomsCount === 1 ? 'Room' : 'Rooms'})
                                                    </span>
                                                    <span className="font-serif text-2xl font-bold text-[#063B32] block mt-0.5">
                                                        ${totalStayPrice.toLocaleString()}
                                                    </span>
                                                    <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
                                                        <ShieldCheck className="w-3 h-3 text-[#C9A24B]" />
                                                        {isResident ? 'Valid Sri Lankan NIC required at check-in' : 'Free cancellation (24h)'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-5">
                                                {isAvailable ? (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            navigate('/checkout', {
                                                                state: {
                                                                    room: {
                                                                        ...room,
                                                                        price: `$${activeRate}`,
                                                                        price_per_night: activeRate
                                                                    },
                                                                    checkIn,
                                                                    checkOut,
                                                                    adults: String(adults),
                                                                    children: String(children),
                                                                    roomsCount: String(roomsCount),
                                                                    residency
                                                                }
                                                            });
                                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                                        }}
                                                        className="w-full bg-gradient-to-r from-[#C9A24B] to-[#b49147] text-[#061C2B] py-3.5 px-5 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:opacity-95 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                                                    >
                                                        <span>Proceed to Checkout</span>
                                                        <ArrowRight className="w-4 h-4" />
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
                                    {selectedRoomItem && (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-serif text-xl font-semibold text-[#063B32]">
                                                    Your Selected Room
                                                </h3>
                                                <span className="text-xs text-gray-500">
                                                    {selectedRoomItem.is_available
                                                        ? 'Ready to reserve for your dates'
                                                        : 'Try adjusting dates or explore alternatives below'}
                                                </span>
                                            </div>
                                            {renderRoomCard(selectedRoomItem, true)}
                                        </div>
                                    )}

                                    {otherRooms.length > 0 && (
                                        <div className="space-y-6">
                                            {selectedRoomItem && (
                                                <h3 className="font-serif text-xl font-semibold text-[#063B32] pt-2">
                                                    Other Available Rooms &amp; Suites
                                                </h3>
                                            )}
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
        </main>
    );
}
