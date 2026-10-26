import React from 'react';
import { ArrowRight } from 'lucide-react';
import { OFFERS_DATA } from '../constants/hotelData';

export default function Offers() {
    return (
        // Special Offers & Promotional Packages Section with side-aligned header
        <section id="offers" className="bg-[#F2EFE9] py-20 px-6 md:px-12 text-black">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Side: Title, Description & View All Offers Button */}
                <div className="lg:col-span-3 pt-4">
                    <span className="text-[#b8972e] tracking-[0.2em] uppercase text-[11px] font-bold block mb-2">
                        LIMITED TIME
                    </span>
                    <h2 className="font-serif text-3xl lg:text-4xl font-normal leading-tight mb-4">
                        Special Offers
                    </h2>
                    <p className="text-gray-600 text-xs font-light leading-relaxed mb-6">
                        Make your stay even more memorable with our exclusive packages and seasonal offers.
                    </p>
                    <button className="bg-[#b8972e] text-black px-5 py-3 rounded-lg text-xs font-medium hover:bg-[#a68525] transition duration-300 flex items-center gap-2 shadow-sm">
                        View All Offers <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Right Side: 3 Offer Cards Grid matching Rooms section style */}
                <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {OFFERS_DATA.map((offer) => (
                        <div
                            key={offer.id}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5 hover:shadow-md transition duration-300 group flex flex-col justify-between"
                        >

                            <div>
                                {/* Offer Image Container with Tag */}
                                <div className="h-52 overflow-hidden relative">
                                    <span className="absolute top-3 right-3 bg-[#b8972e] text-black text-[10px] font-bold px-2.5 py-1 rounded-full z-10 shadow-sm">
                                        {offer.tag}
                                    </span>
                                    <img
                                        src={offer.image}
                                        alt={offer.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                </div>

                                {/* Offer Details */}
                                <div className="p-5">
                                    <h3 className="font-serif text-lg font-medium mb-2">{offer.title}</h3>
                                    <p className="text-xs text-gray-500 mb-4 font-light leading-relaxed">{offer.desc}</p>
                                </div>
                            </div>

                            {/* Price & Action Button Section */}
                            <div className="px-5 pb-5">
                                <div className="flex justify-between items-center pt-4 border-t border-gray-200/60">

                                    {/* Price Display with proper spacing */}
                                    <div className="flex items-baseline gap-1.5">
                                        <span className="text-xs text-gray-500 font-light">From</span>
                                        <span className="font-serif text-xl font-bold text-black mx-1">
                                            {offer.price}
                                        </span>
                                        <span className="text-xs text-gray-500 font-light">/ night</span>
                                    </div>

                                    {/* Circle Arrow Button */}
                                    <button
                                        className="w-8 h-8 rounded-full bg-[#b8972e] text-black flex items-center justify-center hover:bg-[#a68525] transition duration-300 shadow-sm"
                                        aria-label={`Claim ${offer.title}`}
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