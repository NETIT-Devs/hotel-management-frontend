import React from 'react';
import { Play } from 'lucide-react';
import BookingBar from './BookingBar';
import heroImg from '../assets/hero.webp'; // Optimized WebP asset

/**
 * Hero Component
 * Features:
 * - Responsive full-viewport background with luxury ocean-theme gradient overlay
 * - SEO optimized semantic markup featuring primary H1 heading tags
 * - Accessible brand story video trigger button with custom backdrop blur
 * - Seamless integration with the floating interactive BookingBar component
 */
export default function Hero() {
    return (
        <section
            className="relative min-h-[92vh] md:min-h-[96vh] bg-cover bg-center flex flex-col justify-between pt-28 pb-8 px-6 md:px-12 overflow-visible"
            style={{
                // Subtle gradient overlay for balanced warmth, text readability, and luxury depth
                backgroundImage: `linear-gradient(to bottom, rgba(6, 28, 43, 0.6) 0%, rgba(0, 0, 0, 0.25) 50%, rgba(6, 28, 43, 0.65) 100%), url(${heroImg})`
            }}
            aria-label="Serenity Bay Hotel Hero Section"
        >
            {/* Hero Main Content Block */}
            <div className="max-w-4xl mt-auto mb-6 md:mb-8 text-white z-10">

                {/* Gold Subtitle Badge */}
                <span className="text-[#b8972e] tracking-[0.3em] uppercase text-xs font-bold block mb-2.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    Welcome to Serenity Bay
                </span>

                {/* Primary H1 Heading for SEO & Brand Impact */}
                <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light mb-3 leading-tight drop-shadow-lg">
                    Luxury Redefined<br />by the Ocean
                </h1>

                {/* Descriptive Tagline */}
                <p className="text-gray-100 max-w-xl text-sm md:text-base font-light mb-5 leading-relaxed drop-shadow-md">
                    Experience unparalleled comfort, breathtaking views and world-class hospitality at Serenity Bay Hotel & Resort.
                </p>

                {/* Brand Story Action Button */}
                <button
                    type="button"
                    className="flex items-center gap-3 text-sm font-medium tracking-wider text-white hover:text-[#b8972e] transition focus:outline-none group cursor-pointer"
                    aria-label="Watch our brand story video"
                >
                    <span className="w-10 h-10 rounded-full border border-white/80 flex items-center justify-center bg-black/40 backdrop-blur-sm group-hover:border-[#b8972e] transition shadow-md">
                        <Play className="w-4 h-4 fill-current ml-0.5 text-white group-hover:text-[#b8972e] transition" />
                    </span>
                    Watch Our Story
                </button>
            </div>

            {/* Floating Interactive Booking Search Bar */}
            <div className="w-full max-w-[1350px] mx-auto z-20 relative">
                <BookingBar />
            </div>
        </section>
    );
}