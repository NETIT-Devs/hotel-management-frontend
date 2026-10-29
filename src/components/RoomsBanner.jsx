import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Calendar, Sparkles, Headphones, ArrowRight } from 'lucide-react';
import roomsBannerImg from '../assets/RoomsBanner.webp';

/**
 * RoomsBanner Component
 * 
 * Features:
 * - Luxury resort experience banner with responsive background image overlay.
 * - Trust badges section (Best Price Guarantee, Free Cancellation, Personalized Stay, 24/7 Support).
 * - Interactive navigation action button linking directly to the gallery/rooms overview.
 * - Fully optimized for mobile and desktop viewports with clean English documentation.
 */
const RoomsBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full bg-[#063B32] text-white overflow-hidden mt-0 mb-0 border-y border-[#C9A24B]/30 shadow-2xl">

      {/* SEO & Semantic Head Metadata Container for Screen Readers & Search Engines */}
      <div className="sr-only">
        <h2>Serenity Experience - More than a stay, it's a feeling</h2>
        <p>Book with confidence at Serenity Bay Resort. Enjoy best price guarantees, free cancellation, personalized stays, and 24/7 customer support.</p>
      </div>

      {/* Full-bleed image layer keeps the banner edge free of an exposed green strip. */}
      <div className="absolute inset-y-0 left-0 w-full lg:w-[66%] overflow-hidden">
        <img
          src={roomsBannerImg}
          alt="Serenity Bay Resort luxury atmosphere"
          className="w-full h-full object-cover object-left opacity-100"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-[#063B32]/40 to-[#063B32]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#063B32] via-transparent to-transparent lg:hidden" />
      </div>

      {/* Main Banner Container with Increased Height for a Richer Look */}
      <div className="relative max-w-[1440px] mx-auto min-h-[280px] md:min-h-[240px] flex flex-col lg:flex-row items-center justify-between">

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-12 py-8 flex flex-col lg:flex-row items-center justify-between gap-8">

          {/* Left Text Layered Clearly Over the Blended Image */}
          <div className="w-full lg:w-[32%] shrink-0 text-center lg:text-left drop-shadow-2xl">
            <span className="text-white uppercase tracking-[0.3em] text-[11px] font-bold block mb-1.5 [text-shadow:0_2px_8px_rgba(0,0,0,0.85)]">
              SERENITY EXPERIENCE
            </span>
            <h3 className="font-serif text-3xl md:text-4xl font-medium tracking-wide text-white leading-tight [text-shadow:0_3px_10px_rgba(0,0,0,0.9)]">
              More than a stay,
            </h3>
            <p className="font-serif text-2xl italic font-medium text-white mt-0.5 [text-shadow:0_3px_10px_rgba(0,0,0,0.9)]">
              it's a feeling.
            </p>
          </div>

          {/* Center Trust Badges with Perfect Spacing */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8 text-center divide-x divide-[#C9A24B]/20 w-full lg:w-auto my-3 lg:my-0">

            <div className="px-4 flex flex-col items-center">
              <div className="w-12 h-12 mx-auto mb-2.5 rounded-full border border-[#C9A24B] flex items-center justify-center text-[#C9A24B] bg-[#063B32]/90 backdrop-blur-md shadow-lg">
                <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-white">Best Price Guarantee</h4>
              <p className="text-[10px] text-gray-200 font-light mt-1">Get the best rates, always.</p>
            </div>

            <div className="px-4 flex flex-col items-center">
              <div className="w-12 h-12 mx-auto mb-2.5 rounded-full border border-[#C9A24B] flex items-center justify-center text-[#C9A24B] bg-[#063B32]/90 backdrop-blur-md shadow-lg">
                <Calendar className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-white">Free Cancellation</h4>
              <p className="text-[10px] text-gray-200 font-light mt-1">(up to 24h)</p>
            </div>

            <div className="px-4 flex flex-col items-center">
              <div className="w-12 h-12 mx-auto mb-2.5 rounded-full border border-[#C9A24B] flex items-center justify-center text-[#C9A24B] bg-[#063B32]/90 backdrop-blur-md shadow-lg">
                <Sparkles className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-white">Personalized Stay</h4>
              <p className="text-[10px] text-gray-200 font-light mt-1">Your comfort, our priority.</p>
            </div>

            <div className="px-4 flex flex-col items-center">
              <div className="w-12 h-12 mx-auto mb-2.5 rounded-full border border-[#C9A24B] flex items-center justify-center text-[#C9A24B] bg-[#063B32]/90 backdrop-blur-md shadow-lg">
                <Headphones className="w-6 h-6 stroke-[1.5]" />
              </div>
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-white">24/7 Support</h4>
              <p className="text-[10px] text-gray-200 font-light mt-1">We're here for you.</p>
            </div>

          </div>

          {/* Right Action Button -> Navigates to /gallery */}
          <div className="w-full lg:w-auto flex justify-center lg:justify-end shrink-0">
            <button
              type="button"
              onClick={() => {
                navigate('/gallery');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="border border-[#C9A24B] bg-transparent hover:bg-[#C9A24B] text-[#C9A24B] hover:text-[#061C2B] px-5 py-2.5 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-300 shadow-lg flex items-center gap-2 cursor-pointer hover:scale-105"
              aria-label="Explore all rooms and suites"
            >
              Explore All Rooms <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default RoomsBanner;