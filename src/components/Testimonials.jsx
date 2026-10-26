import React from 'react';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';

export default function Testimonials() {
    return (
        // Full-width Testimonials Banner matching the reference design exactly
        <section className="w-full bg-[#063B32] text-white py-12 px-6 md:px-12 my-12 overflow-hidden">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8">

                {/* Left Side: Text Details & "View All Offers / Reviews" Button */}
                <div className="lg:col-span-4 flex flex-col justify-center">
                    <span className="text-[#b8972e] tracking-[0.2em] uppercase text-[11px] font-bold block mb-3">
                        GUEST REVIEWS
                    </span>
                    <h2 className="font-serif text-3xl lg:text-4xl font-normal leading-tight mb-3 text-white">
                        What Our Guests Say
                    </h2>
                    <p className="text-gray-200 text-xs md:text-sm font-light leading-relaxed mb-6">
                        Real stories from travelers who experienced the magic of Serenity Bay.
                    </p>

                    {/* Gold CTA Button matching reference */}
                    <button className="bg-[#b8972e] text-black px-5 py-2.5 rounded-lg text-xs font-medium hover:bg-[#a68525] transition duration-300 inline-flex items-center gap-2 shadow-sm w-fit">
                        View All Reviews <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                {/* Vertical Separator Line (Desktop Only) */}
                <div className="hidden lg:block lg:col-span-1 justify-self-center h-28 w-[1px] bg-white/20" />

                {/* Center: Review Box with Smooth Overlay Color */}
                <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-2xl relative shadow-lg">
                    <div className="flex items-start gap-4 mb-4">
                        {/* Guest Avatar */}
                        <img
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
                            alt="Sarah Johnson"
                            loading="lazy"
                            className="w-12 h-12 rounded-full object-cover shrink-0"
                        />
                        <div>
                            <h3 className="font-serif text-base md:text-lg font-medium text-white leading-tight">Sarah Johnson</h3>
                            <p className="text-[11px] text-gray-300 font-light mb-1">United Kingdom</p>

                            {/* Star Rating Bar */}
                            <div className="flex items-center gap-0.5 text-[#b8972e]">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 fill-[#b8972e]" />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Testimonial Quote */}
                    <p className="text-gray-200 font-light italic leading-relaxed text-xs md:text-sm">
                        "An absolutely incredible stay! The staff were so friendly, the room was stunning and the ocean view was unforgettable. We can't wait to come back!"
                    </p>
                </div>

                {/* Right Side: Slider Navigation Arrows */}
                <div className="lg:col-span-2 flex items-center justify-center lg:justify-end gap-3">
                    <button
                        className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition duration-300 text-white"
                        aria-label="Previous review"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                        className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition duration-300 text-white"
                        aria-label="Next review"
                    >
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

            </div>
        </section>
    );
}