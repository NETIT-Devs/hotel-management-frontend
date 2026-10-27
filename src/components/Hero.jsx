import React from 'react';
import { Play } from 'lucide-react';
import BookingBar from './BookingBar';
import heroImg from '../assets/homeHero.webp'; // Optimized WebP asset

/**
 * Hero Component
 * Features:
 * - Responsive full-viewport background with natural golden sunset gradient overlay
 * - SEO optimized semantic markup featuring primary H1 heading tags
 * - Accessible brand story video trigger button with custom backdrop blur
 * - Seamless integration with the floating interactive BookingBar component matching exact luxury reference layout
 */
export default function Hero() {
    return (
        <>
            <section
                className="relative min-h-[82vh] md:min-h-[88vh] bg-[#F2EFE9] bg-cover bg-center flex flex-col justify-between pt-24 pb-16 md:pb-20 px-6 md:px-12 overflow-visible"
                style={{
                    // Deep emerald overlay for a rich, premium resort aesthetic
                    backgroundImage: `linear-gradient(to right, rgba(6, 59, 50, 0.82) 0%, rgba(6, 59, 50, 0.5) 30%, rgba(6, 59, 50, 0.1) 60%, rgba(6, 59, 50, 0) 80%), url(${heroImg})`
                }}
                aria-label="Serenity Bay Hotel Hero Section"
            >
            {/* Hero Main Content Block */}
            <div className="max-w-4xl mt-auto mb-8 md:mb-10 text-white z-10">

                {/* Gold Subtitle Badge */}
                <span className="text-[#C5A253] tracking-[0.3em] uppercase text-xs font-bold block mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                    WELCOME TO SERENITY BAY
                </span>

                {/* Primary H1 Heading for SEO & Brand Impact */}
                <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light mb-3 leading-tight drop-shadow-lg">
                    Luxury Redefined<br />by the Ocean
                </h1>

                {/* Descriptive Tagline */}
                <p className="text-gray-100 max-w-xl text-sm md:text-base font-light mb-4 leading-relaxed drop-shadow-md">
                    Experience unparalleled comfort, breathtaking views and world-class hospitality at Serenity Bay Hotel & Resort.
                </p>

                {/* Brand Story Action Button */}
                <button
                    type="button"
                    className="flex items-center gap-3 text-sm font-medium tracking-wider text-white hover:text-[#C5A253] transition focus:outline-none group cursor-pointer"
                    aria-label="Watch our brand story video"
                >
                    <span className="w-10 h-10 rounded-full border border-white/80 flex items-center justify-center bg-black/40 backdrop-blur-sm group-hover:border-[#C5A253] transition shadow-md">
                        <Play className="w-4 h-4 fill-current ml-0.5 text-white group-hover:text-[#C5A253] transition" />
                    </span>
                    Watch Our Story
                </button>
            </div>

            </section>

            {/* Floating Interactive Booking Search Bar */}
            <div className="w-full max-w-[1350px] mx-auto -mt-16 relative z-30 px-4 mb-16">
                <BookingBar />
            </div>
        </>
    );
}