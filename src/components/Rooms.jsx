import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Bed } from 'lucide-react';
import { ROOMS_DATA } from '../constants/hotelData';

/**
 * Rooms Component (Home Section)
 * Features:
 * - Displays featured rooms and suites in a responsive 3-column grid (Showing first 3 rooms)
 * - Fully responsive layout optimized for mobile, tablet, and desktop views
 * - SEO-friendly semantic markup with lazy-loaded luxury imagery
 * - Integrated navigation link to the dedicated /rooms page
 */
export default function Rooms() {
    const navigate = useNavigate();

    return (
        <section id="rooms" className="bg-[#F2EFE9] py-20 px-6 md:px-12 text-black">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Side: Title, Description & View All Button */}
                <div className="lg:col-span-3 pt-4">
                    <span className="text-[#b8972e] tracking-[0.2em] uppercase text-[11px] font-bold block mb-2">
                        PREMIUM ACCOMMODATION
                    </span>
                    <h2 className="font-serif text-3xl lg:text-4xl font-normal leading-tight mb-4">
                        Our Rooms &amp; Suites
                    </h2>
                    <p className="text-gray-600 text-xs font-light leading-relaxed mb-6">
                        Discover a range of luxurious rooms and suites, each designed for your comfort and relaxation.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate('/rooms')}
                        className="bg-[#b8972e] text-black px-5 py-3 rounded-lg text-xs font-medium hover:bg-[#a68525] transition duration-300 flex items-center gap-2 shadow-sm cursor-pointer"
                    >
                        View All Rooms <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Right Side: 3 Room Cards Grid (Optimized for Mobile & Desktop - sliced to 3 main rooms) */}
                <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {ROOMS_DATA.slice(0, 3).map((room) => (
                        <div
                            key={room.id}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5 hover:shadow-md transition duration-300 group flex flex-col justify-between"
                        >

                            <div>
                                {/* Room Image Container using the first image from the array (room.images[0]) */}
                                <div className="h-52 overflow-hidden bg-gray-100">
                                    <img
                                        src={room.images ? room.images[0] : room.image}
                                        alt={room.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                </div>

                                {/* Room Details & Specifications */}
                                <div className="p-5">
                                    <h3 className="font-serif text-lg font-medium mb-2">{room.title}</h3>

                                    {/* Capacity and Bed Details */}
                                    <div className="flex items-center gap-4 text-xs text-gray-600 mb-4 font-light">
                                        <span className="flex items-center gap-1.5">
                                            <Users className="w-3.5 h-3.5 text-[#b8972e]" /> {room.guests || '2 Guests'}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Bed className="w-3.5 h-3.5 text-[#b8972e]" /> {room.bed || 'King Bed'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Price & Action Button Section */}
                            <div className="px-5 pb-5">
                                <div className="flex justify-between items-center pt-4 border-t border-gray-100">

                                    {/* Price Display */}
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-[11px] text-gray-500 font-light">From</span>
                                        <span className="font-serif text-lg font-bold text-black mx-1">
                                            {room.price}
                                        </span>
                                        <span className="text-[11px] text-gray-500 font-light">/ night</span>
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        type="button"
                                        onClick={() => navigate('/rooms')}
                                        className="w-8 h-8 rounded-full bg-[#b8972e] text-black flex items-center justify-center hover:bg-[#a68525] transition duration-300 shadow-sm cursor-pointer"
                                        aria-label={`View ${room.title} details`}
                                    >
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}