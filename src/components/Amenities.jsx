import React from 'react';
import { Bed, Waves, Utensils, Sparkles, Dumbbell, Wifi } from 'lucide-react';
import { AMENITIES_DATA } from '../constants/hotelData';

// Map icon string names from data to actual Lucide Icon components
const iconMap = { Bed, Waves, Utensils, Sparkles, Dumbbell, Wifi };

export default function Amenities() {
    return (
        // Facilities section with responsive grid and clean background
        <section id="facilities" className="bg-[#f7f5f0] py-12 px-6 md:px-12 border-b border-gray-200 text-black">
            <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
                {AMENITIES_DATA.map((item, idx) => {
                    const IconComponent = iconMap[item.iconName];
                    return (
                        <div
                            key={idx}
                            className="flex flex-col items-center p-4 hover:bg-black/5 rounded-xl transition duration-300 shadow-sm hover:shadow-md"
                        >
                            {/* Dynamic Amenity Icon */}
                            <div className="text-[#b8972e] mb-3">
                                {IconComponent && <IconComponent className="w-6 h-6" />}
                            </div>

                            {/* Amenity Title */}
                            <h3 className="font-serif text-sm font-semibold mb-1">{item.title}</h3>

                            {/* Amenity Description */}
                            <p className="text-xs text-gray-600 font-light">{item.desc}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}