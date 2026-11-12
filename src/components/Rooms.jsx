import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users, Bed, Maximize2 } from 'lucide-react';
import { ROOMS_DATA } from '../constants/hotelData';

/**
 * Rooms Component (Home Section)
 * Features:
 * - Displays featured rooms and suites in a responsive 3-column grid (Showing first 3 rooms securely via .slice(0, 3))
 * - Fully responsive layout optimized for mobile, tablet, and desktop views
 * - Features category badges and clean unboxed metadata display (Guests, Bed, Size) with icons
 * - SEO-friendly semantic markup with smooth page navigation and scroll behavior
 */
export default function Rooms() {
    const navigate = useNavigate();

    // Automatically slice the array to display only the first 3 rooms on the home page
    const displayedRooms = ROOMS_DATA.slice(0, 3);

    return (
        <section id="rooms" className="bg-[#F2EFE9] py-20 px-6 md:px-12 text-black" aria-label="Featured Rooms Section">
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
                        onClick={() => {
                            navigate('/rooms');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-[#b8972e] text-black px-5 py-3 rounded-xl text-xs font-medium hover:bg-[#a68525] transition duration-300 flex items-center gap-2 shadow-sm cursor-pointer"
                        aria-label="View all hotel rooms and suites"
                    >
                        <span>View All Rooms</span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                </div>

                {/* Right Side: 3 Room Cards Grid */}
                <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {displayedRooms.map((room) => {
                        const displayImage = (room.images && room.images[0]) || room.image || '';
                        const displayCategory = room.category || '';

                        return (
                            <article
                                key={room.id}
                                onClick={() => {
                                    navigate(`/rooms/${room.id}`);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        navigate(`/rooms/${room.id}`);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                }}
                                role="link"
                                tabIndex={0}
                                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5 hover:shadow-xl hover:border-[#b8972e]/50 transition-all duration-500 group flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#b8972e]"
                                aria-label={`View details for ${room.title}`}
                            >
                                <div>
                                    {/* Room Image Container with Category Tag */}
                                    <div className="h-52 overflow-hidden relative bg-gray-100">
                                        {displayCategory && (
                                            <span className="absolute top-3 right-3 bg-[#063B32]/90 backdrop-blur-md text-[#b8972e] border border-[#b8972e]/40 text-[9px] font-bold px-3 py-1 rounded-full z-10 shadow-md uppercase tracking-widest">
                                                {displayCategory}
                                            </span>
                                        )}
                                        <img
                                            src={displayImage}
                                            alt={room.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                        />
                                    </div>

                                    {/* Room Details & Specifications */}
                                    <div className="p-5 pb-3">
                                        <h3 className="font-serif text-lg font-medium mb-2 group-hover:text-[#b8972e] transition-colors line-clamp-1">
                                            {room.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 font-light leading-relaxed mb-4 line-clamp-2">
                                            {room.description}
                                        </p>

                                        {/* Clean Unboxed Metadata (Guests, Bed, and Size with Icons) */}
                                        <div className="flex items-center gap-4 text-xs text-gray-600 font-light pt-3 border-t border-gray-100">
                                            {room.guests && (
                                                <div className="flex items-center gap-1.5">
                                                    <Users className="w-3.5 h-3.5 text-[#b8972e] shrink-0" aria-hidden="true" />
                                                    <span>{room.guests}</span>
                                                </div>
                                            )}
                                            {room.bed && (
                                                <div className="flex items-center gap-1.5">
                                                    <Bed className="w-3.5 h-3.5 text-[#b8972e] shrink-0" aria-hidden="true" />
                                                    <span>{room.bed}</span>
                                                </div>
                                            )}
                                            {room.size && (
                                                <div className="flex items-center gap-1.5">
                                                    <Maximize2 className="w-3.5 h-3.5 text-[#b8972e] shrink-0" aria-hidden="true" />
                                                    <span>{room.size}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Price & Action Button Section */}
                                <div className="p-5 pt-2">
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-200/60">

                                        {/* Price Display */}
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-xs text-gray-500 font-light">From</span>
                                            <span className="font-serif text-xl font-bold text-black mx-1">
                                                {room.price}
                                            </span>
                                            <span className="text-xs text-gray-500 font-light">/ night</span>
                                        </div>

                                        {/* Action Button linked to specific room ID */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/rooms/${room.id}`);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="w-8 h-8 rounded-full bg-[#b8972e] text-black flex items-center justify-center hover:bg-[#a68525] transition duration-300 shadow-sm cursor-pointer"
                                            aria-label={`View ${room.title} details`}
                                        >
                                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}