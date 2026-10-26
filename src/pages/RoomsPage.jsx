import React, { useState } from 'react';
import { SlidersHorizontal, Phone, ArrowRight, Bed, Users, Maximize2, Waves, Wifi, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { ROOMS_DATA } from '../constants/hotelData';

/**
 * RoomsPage Component
 * Features:
 * - Luxury 2-column layout (Left: Filter & Sort sidebar, Right: Rooms listing)
 * - 1/6 Image slider functionality for room cards
 * - Responsive design matching the Serenity Bay brand theme (#b8972e and #061C2B)
 */
export default function RoomsPage() {
    const [sortBy, setSortBy] = useState('Recommended');
    const [priceRange, setPriceRange] = useState(1200);

    // State to track image indexes for the 1/6 slider per room
    const [currentImageIndexes, setCurrentImageIndexes] = useState({});

    const handleNextImage = (roomId, imagesLength, e) => {
        e.preventDefault();
        setCurrentImageIndexes(prev => ({
            ...prev,
            [roomId]: ((prev[roomId] || 0) + 1) % imagesLength
        }));
    };

    const handlePrevImage = (roomId, imagesLength, e) => {
        e.preventDefault();
        setCurrentImageIndexes(prev => ({
            ...prev,
            [roomId]: ((prev[roomId] || 0) - 1 + imagesLength) % imagesLength
        }));
    };

    return (
        <div className="w-full bg-[#fcfbf9] min-h-screen py-12 px-4 md:px-12">
            
            {/* Header Section */}
            <div className="max-w-[1350px] mx-auto mb-10">
                <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">Home &gt; Rooms &amp; Suites</div>
                <h1 className="font-serif text-3xl md:text-5xl font-light text-[#061C2B] mb-3">Our Rooms &amp; Suites</h1>
                <p className="text-gray-600 text-sm md:text-base font-light">
                    Choose from a selection of luxurious rooms and suites, each designed for your comfort and relaxation.
                </p>
            </div>

            {/* Main Layout Grid */}
            <div className="max-w-[1350px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* ------------------ LEFT SIDEBAR: FILTER & SORT ------------------ */}
                <aside className="lg:col-span-1 flex flex-col gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-6">
                        
                        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                            <h3 className="font-semibold text-sm text-[#061C2B] flex items-center gap-2">
                                <SlidersHorizontal className="w-4 h-4 text-[#b8972e]" /> Filter &amp; Sort
                            </h3>
                            <button className="text-xs text-[#b8972e] hover:underline cursor-pointer">Clear Filters</button>
                        </div>

                        {/* Sort By */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Sort By</label>
                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-gray-50 border border-gray-200 text-xs text-gray-800 p-2.5 rounded-xl focus:outline-none focus:border-[#b8972e]"
                            >
                                <option>Recommended</option>
                                <option>Price: Low to High</option>
                                <option>Price: High to Low</option>
                            </select>
                        </div>

                        {/* Room Type */}
                        <div className="flex flex-col gap-2.5 border-t border-gray-100 pt-4">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Room Type</label>
                            {['All Rooms (12)', 'Deluxe Rooms (5)', 'Suites (4)', 'Villas (3)'].map((type, idx) => (
                                <label key={idx} className="flex items-center gap-2.5 text-xs text-gray-700 cursor-pointer">
                                    <input type="checkbox" defaultChecked={idx === 0} className="rounded border-gray-300 text-[#b8972e] focus:ring-[#b8972e]" />
                                    {type}
                                </label>
                            ))}
                        </div>

                        {/* Price Range */}
                        <div className="flex flex-col gap-2.5 border-t border-gray-100 pt-4">
                            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Price Range (per night)</label>
                            <input 
                                type="range" 
                                min="150" 
                                max="1200" 
                                value={priceRange} 
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-full accent-[#b8972e] cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-gray-600 font-medium">
                                <span>$150</span>
                                <span>${priceRange}+</span>
                            </div>
                        </div>

                    </div>

                    {/* Support Card */}
                    <div className="bg-[#061C2B] text-white p-6 rounded-2xl flex flex-col gap-4 shadow-md relative overflow-hidden">
                        <h4 className="font-serif text-lg font-light">Need Help?</h4>
                        <p className="text-gray-300 text-xs font-light leading-relaxed">
                            Our team is here to assist you in finding the perfect room.
                        </p>
                        <a href="tel:+94112345678" className="text-[#b8972e] font-semibold text-sm flex items-center gap-2 hover:underline">
                            <Phone className="w-4 h-4" /> +94 11 234 5678
                        </a>
                    </div>
                </aside>

                {/* ------------------ RIGHT SIDE: ROOMS LISTING ------------------ */}
                <main className="lg:col-span-3 flex flex-col gap-6">
                    <div className="flex justify-between items-center bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm">
                        <span className="text-xs font-semibold text-gray-600">Rooms Available</span>
                    </div>

                    <div className="flex flex-col gap-6">
                        {ROOMS_DATA.map((room) => {
                            const imagesList = room.images || [room.image];
                            const currentIdx = currentImageIndexes[room.id] || 0;
                            const totalImages = imagesList.length;

                            return (
                                <div key={room.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-0 group hover:shadow-md transition duration-300">
                                    
                                    {/* Room Image Slider Section */}
                                    <div className="md:col-span-5 relative min-h-[240px] md:min-h-full overflow-hidden bg-gray-900">
                                        <img 
                                            src={imagesList[currentIdx]} 
                                            alt={room.title} 
                                            className="w-full h-full object-cover transition duration-500"
                                        />
                                        
                                        {/* Navigation Arrows */}
                                        {totalImages > 1 && (
                                            <>
                                                <button 
                                                    onClick={(e) => handlePrevImage(room.id, totalImages, e)}
                                                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition cursor-pointer"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                </button>
                                                <button 
                                                    onClick={(e) => handleNextImage(room.id, totalImages, e)}
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-sm transition cursor-pointer"
                                                >
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </>
                                        )}

                                        {/* Image Counter Badge */}
                                        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-lg">
                                            {currentIdx + 1} / {totalImages}
                                        </div>
                                    </div>

                                    {/* Room Content */}
                                    <div className="md:col-span-7 p-6 md:p-8 flex flex-col justify-between">
                                        <div className="flex flex-col gap-3">
                                            <h3 className="font-serif text-2xl font-normal text-[#061C2B]">{room.title}</h3>
                                            <p className="text-gray-600 text-xs md:text-sm font-light leading-relaxed">
                                                {room.description || "A perfect blend of comfort and elegance with stunning views."}
                                            </p>
                                            
                                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 border-t border-b border-gray-100 py-3 my-2">
                                                <span className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-[#b8972e]" /> {room.bed || 'King Bed'}</span>
                                                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-[#b8972e]" /> {room.guests || '2 Guests'}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-6 mt-4 border-t border-gray-100">
                                            <div>
                                                <span className="text-[10px] uppercase tracking-wider text-gray-400 block">From</span>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="font-serif text-2xl font-bold text-[#061C2B]">{room.price}</span>
                                                    <span className="text-xs text-gray-500">per night</span>
                                                </div>
                                            </div>
                                            
                                            <button 
                                                type="button"
                                                className="bg-[#061C2B] hover:bg-[#b8972e] text-white hover:text-black font-semibold text-xs py-3 px-6 rounded-xl transition duration-300 flex items-center gap-2 cursor-pointer shadow-md"
                                            >
                                                Book Now <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            );
                        })}
                    </div>

                </main>

            </div>

        </div>
    );
}