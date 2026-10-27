import React from 'react';
import { Bed, Waves, Utensils, Sparkles, Dumbbell, Wifi } from 'lucide-react';
import { AMENITIES_DATA } from '../constants/hotelData';

// Map icon string names from external data to actual Lucide Icon components
const iconMap = { Bed, Waves, Utensils, Sparkles, Dumbbell, Wifi };

/**
 * Amenities Component
 * Displays the resort's key facilities/amenities in a clean, responsive grid layout.
 * Fully optimized for mobile views, accessibility, and high-end luxury aesthetics.
 */
export default function Amenities() {
    return (
        <section
            id="facilities"
            className="relative z-25 mt-8 md:mt-12 bg-[#FAF8F5] py-14 px-6 md:px-12 border-b border-[#E5DFD4] text-black shadow-sm"
            aria-label="Hotel Facilities and Amenities"
        >
            <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-0 text-center divide-y lg:divide-y-0 lg:divide-x divide-[#E5DFD4]">
                {AMENITIES_DATA.map((item, idx) => {
                    const IconComponent = iconMap[item.iconName];
                    return (
                        <div
                            key={idx}
                            className="flex flex-col items-center p-6 hover:bg-black/[0.02] transition duration-300 group cursor-pointer"
                        >
                            {/* Dynamic Amenity Icon with Luxury Gold Theme */}
                            <div className="text-[#C5A253] mb-3 group-hover:scale-110 transition transform duration-300" aria-hidden="true">
                                {IconComponent && <IconComponent className="w-7 h-7 stroke-[1.5]" />}
                            </div>

                            {/* Amenity Title */}
                            <h3 className="font-serif text-sm font-medium tracking-wide mb-1 text-gray-900">
                                {item.title}
                            </h3>

                            {/* Amenity Description */}
                            <p className="text-[11px] text-gray-500 font-light tracking-wider uppercase">
                                {item.desc}
                            </p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}