import React from 'react';
import { ArrowRight, Star } from 'lucide-react';
import experienceBg from '../assets/experience-bg.webp';

export default function Experience() {
    return (
        // Full-width Experience Banner with 2x2 Stats Grid
        <section className="w-full bg-[#063B32] text-white my-12 overflow-hidden">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[380px]">

                {/* Left Side: Image Column */}
                <div className="lg:col-span-5 relative min-h-[280px] lg:min-h-[380px]">
                    <img
                        src={experienceBg}
                        alt="Serenity Bay Resort View"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#063B32]/40 to-[#063B32] hidden lg:block" />
                </div>

                {/* Middle Side: Text & Description Column */}
                <div className="lg:col-span-4 p-8 lg:p-12 flex flex-col justify-center">
                    <span className="text-[#b8972e] tracking-[0.2em] uppercase text-[11px] font-bold block mb-3">
                        ABOUT SERENITY BAY
                    </span>
                    <h2 className="font-serif text-3xl lg:text-4xl font-normal leading-tight mb-4 text-white">
                        A Destination of <br className="hidden sm:block" /> Peace and Luxury
                    </h2>
                    <p className="text-gray-200 text-xs md:text-sm font-light leading-relaxed mb-6 max-w-md">
                        Nestled along the pristine coastline, Serenity Bay Hotel & Resort offers a perfect blend of natural beauty, modern elegance and warm hospitality. Our mission is to create unforgettable experiences for every guest.
                    </p>
                    <button className="bg-[#b8972e] text-black px-6 py-3 rounded-lg text-xs font-medium hover:bg-[#a68525] transition duration-300 inline-flex items-center gap-2 shadow-sm w-fit">
                        Learn More <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Right Side: 2x2 Stats Grid (Balanced layout without vertical stretching) */}
                <div className="lg:col-span-3 p-6 lg:p-8 lg:border-l lg:border-white/15 flex flex-col justify-center">
                    <div className="grid grid-cols-2 gap-6">

                        {/* Stat 1 */}
                        <div>
                            <h3 className="font-serif text-2xl lg:text-3xl font-normal text-white mb-0.5">10+</h3>
                            <p className="text-[11px] text-gray-300 font-light leading-tight">Years of Excellence</p>
                        </div>

                        {/* Stat 2 */}
                        <div>
                            <h3 className="font-serif text-2xl lg:text-3xl font-normal text-white mb-0.5">25+</h3>
                            <p className="text-[11px] text-gray-300 font-light leading-tight">Luxury Suites</p>
                        </div>

                        {/* Stat 3 */}
                        <div className="pt-4 border-t border-white/10">
                            <h3 className="font-serif text-2xl lg:text-3xl font-normal text-white mb-0.5">5000+</h3>
                            <p className="text-[11px] text-gray-300 font-light leading-tight">Happy Guests</p>
                        </div>

                        {/* Stat 4 */}
                        <div className="pt-4 border-t border-white/10">
                            <div className="flex items-center gap-1 mb-0.5">
                                <h3 className="font-serif text-2xl lg:text-3xl font-normal text-white">4.9</h3>
                                <Star className="w-3.5 h-3.5 fill-[#b8972e] text-[#b8972e]" />
                            </div>
                            <p className="text-[11px] text-gray-300 font-light leading-tight">Guest Rating</p>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}