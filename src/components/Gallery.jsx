import React from 'react';
import { ArrowRight } from 'lucide-react';
import { GALLERY_IMAGES } from '../constants/hotelData';

/**
 * Gallery Component
 * Features:
 * - Perfectly balanced 4-image grid layout for luxury aesthetics
 * - Fully responsive across mobile, tablet, and desktop viewports
 * - SEO optimized semantic tags with clean English documentation
 */
export default function Gallery() {
    return (
        <section
            id="gallery"
            className="w-full bg-[#f7f5f0] py-14 px-6 md:px-12 text-black my-8 overflow-hidden"
            aria-label="Resort Photo Gallery"
        >
            <div className="max-w-[1500px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">

                {/* Left Side: Title & Subtitle Section */}
                <div className="lg:w-52 shrink-0 text-center lg:text-left">
                    <span className="text-[#b8972e] tracking-[0.2em] uppercase text-[11px] font-bold block mb-1">
                        EXPLORE OUR
                    </span>
                    <h2 className="font-serif text-3xl lg:text-4xl font-normal leading-tight text-gray-900 mb-2">
                        Gallery
                    </h2>
                    <p className="text-gray-500 text-xs font-light leading-relaxed">
                        A glimpse of the beautiful moments that await you.
                    </p>
                </div>

                {/* Center: Perfectly Balanced 4-Image Grid Layout */}
                <div className="flex-1 w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 items-center">
                    {GALLERY_IMAGES.slice(0, 4).map((img, idx) => (
                        <div
                            key={idx}
                            className="w-full h-40 sm:h-44 md:h-48 rounded-2xl overflow-hidden shadow-md group cursor-pointer border border-black/5 relative"
                        >
                            <img
                                src={img}
                                alt={`Serenity Bay Resort View ${idx + 1}`}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                            />
                        </div>
                    ))}
                </div>

                {/* Right Side: View Gallery Button */}
                <div className="lg:w-44 shrink-0 flex justify-center lg:justify-end">
                    <button
                        type="button"
                        aria-label="View complete resort photo gallery"
                        className="border border-[#b8972e]/60 text-[#b8972e] px-6 py-3 rounded-full text-xs font-medium hover:bg-[#b8972e] hover:text-black transition duration-300 flex items-center gap-2 shadow-sm bg-transparent whitespace-nowrap cursor-pointer"
                    >
                        View Gallery <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                </div>

            </div>
        </section>
    );
}