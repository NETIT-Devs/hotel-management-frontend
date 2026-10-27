import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Check, SlidersHorizontal, Users, Bed, Wifi, Wind, Waves, Coffee, ArrowRight } from 'lucide-react';
import { ROOMS_DATA } from '../constants/hotelData';
import BookingBar from '../components/BookingBar';
import roomsPageHero from '../assets/roomsPageHero.webp';

/**
 * RoomsPage Component
 * Features:
 * - Luxury Hero Section with resort background and title
 * - Integrated BookingBar component
 * - Advanced Filter & Sort Sidebar (Room Types, Views, Bed Types, Amenities)
 * - 2-Column Grid displaying all 6 rooms with video walkthrough triggers and image galleries
 * - Direct navigation to booking checkout flow
 */
export default function RoomsPage() {
    const navigate = useNavigate();
    
    // Filter states
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedView, setSelectedView] = useState('All');
    const [selectedBed, setSelectedBed] = useState('All');

    // Filter logic based on user selection
    const filteredRooms = ROOMS_DATA.filter(room => {
        const matchesCategory = selectedCategory === 'All' || room.category === selectedCategory;
        const matchesView = selectedView === 'All' || room.view?.includes(selectedView);
        const matchesBed = selectedBed === 'All' || room.bed?.includes(selectedBed);
        return matchesCategory && matchesView && matchesBed;
    });

    return (
        <div className="min-h-screen bg-[#F8F5F0] text-[#061C2B]">
            
            {/* Hero Section */}
            <div className="relative h-[600px] bg-cover bg-center flex flex-col justify-center p-6 pt-20 md:p-12 md:pt-28" style={{ backgroundImage: `linear-gradient(to right, rgba(6, 59, 50, 0.85) 0%, rgba(6, 59, 50, 0.45) 40%, rgba(6, 59, 50, 0.1) 70%, rgba(6, 59, 50, 0) 90%), url(${roomsPageHero})` }}>
                <div className="max-w-7xl mx-auto w-full text-left">
                    <span className="text-[#C5A253] tracking-[0.2em] uppercase text-xs font-bold block mb-2">
                        LUXURY STAYS / ROOMS &amp; SUITES
                    </span>
                    <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white font-normal mb-4">
                        Discover Our<br />
                        Rooms &amp; Suites
                    </h1>
                    <p className="text-gray-200 text-sm md:text-base font-light max-w-xl leading-relaxed">
                        Elegant spaces, breathtaking views, unforgettable stays.<br />
                        Your perfect stay awaits.
                    </p>
                </div>

            </div>

            {/* Booking Bar Component Integration */}
            <div className="w-full max-w-[1350px] mx-auto px-4 -mt-16 relative z-20 mb-16">
                <BookingBar />
            </div>

            {/* Main Content: Filter Sidebar & Rooms Grid */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Left Sidebar: Filter & Sort Controls */}
                <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-black/5 h-fit sticky top-28">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-2 font-serif text-lg font-medium">
                            <SlidersHorizontal className="w-4 h-4 text-[#C5A253]" />
                            <span>Filter &amp; Sort</span>
                        </div>
                        <button 
                            onClick={() => { setSelectedCategory('All'); setSelectedView('All'); setSelectedBed('All'); }}
                            className="text-xs text-gray-500 hover:text-[#C5A253] underline cursor-pointer"
                        >
                            Clear All
                        </button>
                    </div>

                    {/* Room Type Filter */}
                    <div className="mb-6">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Room Type</h4>
                        <div className="space-y-2 text-sm">
                            {['All', 'Deluxe Rooms', 'Suites', 'Pool Villas', 'Villas'].map((cat) => (
                                <label key={cat} className="flex items-center justify-between cursor-pointer py-1">
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="radio" 
                                            name="category" 
                                            checked={selectedCategory === cat} 
                                            onChange={() => setSelectedCategory(cat)}
                                            className="accent-[#C5A253]"
                                        />
                                        <span className={selectedCategory === cat ? 'font-medium text-[#061C2B]' : 'text-gray-600'}>{cat === 'All' ? 'All Rooms' : cat}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {cat === 'All' ? ROOMS_DATA.length : ROOMS_DATA.filter(r => r.category === cat).length}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* View Filter */}
                    <div className="mb-6">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">View</h4>
                        <div className="space-y-2 text-sm">
                            {['All', 'Ocean View', 'Garden View'].map((view) => (
                                <label key={view} className="flex items-center justify-between cursor-pointer py-1">
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="radio" 
                                            name="view" 
                                            checked={selectedView === view} 
                                            onChange={() => setSelectedView(view)}
                                            className="accent-[#C5A253]"
                                        />
                                        <span className={selectedView === view ? 'font-medium text-[#061C2B]' : 'text-gray-600'}>{view}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Bed Type Filter */}
                    <div className="mb-6">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Bed Type</h4>
                        <div className="space-y-2 text-sm">
                            {['All', 'King Bed', '2 King Beds'].map((bed) => (
                                <label key={bed} className="flex items-center justify-between cursor-pointer py-1">
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="radio" 
                                            name="bed" 
                                            checked={selectedBed === bed} 
                                            onChange={() => setSelectedBed(bed)}
                                            className="accent-[#C5A253]"
                                        />
                                        <span className={selectedBed === bed ? 'font-medium text-[#061C2B]' : 'text-gray-600'}>{bed}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Rooms Grid (2 Columns Layout with Video & Image Sliders) */}
                <div className="lg:col-span-9">
                    
                    {/* Header info bar */}
                    <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-black/5">
                        <div>
                            <h2 className="font-serif text-2xl font-medium">Find Your Perfect Stay</h2>
                            <p className="text-xs text-gray-500">Choose from our curated selection of rooms, suites and private villas.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-medium bg-[#061C2B] text-white px-3 py-1.5 rounded-lg">
                                {filteredRooms.length} Rooms Available
                            </span>
                        </div>
                    </div>

                    {/* Room Cards 2-Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredRooms.map((room) => (
                            <div key={room.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5 flex flex-col justify-between group hover:shadow-md transition duration-300">
                                
                                <div>
                                    {/* Main Image with Video Play Icon Overlay */}
                                    <div className="relative h-60 bg-gray-100 overflow-hidden">
                                        <img 
                                            src={room.images[0]} 
                                            alt={room.title} 
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        />
                                        
                                        {/* Video Walkthrough Trigger Button */}
                                        <button className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center hover:bg-[#C5A253] hover:text-black transition shadow-lg">
                                            <Play className="w-4 h-4 fill-current ml-0.5" />
                                        </button>

                                        {/* Gallery Thumbnails Strip at Bottom of Image */}
                                        <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 overflow-x-auto pb-1">
                                            {room.images.slice(1, 5).map((img, idx) => (
                                                <div key={idx} className="w-12 h-8 rounded overflow-hidden border border-white/60 flex-shrink-0">
                                                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                                                </div>
                                            ))}
                                            <div className="w-12 h-8 rounded bg-black/60 backdrop-blur-sm border border-white/60 flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                                                +{room.images.length - 4}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Room Information */}
                                    <div className="p-5">
                                        <h3 className="font-serif text-xl font-medium mb-1">{room.title}</h3>
                                        <p className="text-xs text-gray-500 font-light mb-4">{room.description}</p>

                                        {/* Room Specs (Bed, Guests, Size) */}
                                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mb-4 font-light pt-3 border-t border-gray-100">
                                            <span className="flex items-center gap-1">
                                                <Bed className="w-3.5 h-3.5 text-[#C5A253]" /> {room.bed}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Users className="w-3.5 h-3.5 text-[#C5A253]" /> {room.guests}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="text-[#C5A253] font-bold">📏</span> {room.size}
                                            </span>
                                        </div>

                                        {/* Room Amenities */}
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            {room.amenities?.map((amenity, index) => (
                                                <span key={index} className="text-[10px] bg-[#F8F5F0] text-gray-700 px-2.5 py-1 rounded-md border border-gray-200/60 font-light">
                                                    {amenity}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Price and Book Button Section */}
                                <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex justify-between items-center bg-white">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-xs text-gray-400 font-light">From</span>
                                        <span className="font-serif text-xl font-bold text-[#061C2B] mx-1">{room.price}</span>
                                        <span className="text-xs text-gray-400 font-light">per night</span>
                                    </div>

                                    <button 
                                        onClick={() => navigate('/checkout', { state: { room } })}
                                        className="bg-[#C5A253] text-[#061C2B] px-5 py-2.5 rounded-xl text-xs font-medium hover:bgr-[#b49147] transition flex items-center gap-2 shadow-sm cursor-pointer"
                                    >
                                        View Details <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>

                </div>

            </div>
        </div>
    );
}