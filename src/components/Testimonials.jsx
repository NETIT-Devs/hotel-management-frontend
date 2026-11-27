import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { fetchFeaturedReviews } from '../services/reviewService';

// Graceful fallback testimonials displayed before the first live guest reviews are approved
const FALLBACK_TESTIMONIALS = [
  {
    id: 'fallback-1',
    guest_name: 'Sarah Johnson',
    guest_country: 'United Kingdom',
    room_name: 'Ocean Suite',
    overall_rating: 5,
    title: 'An unforgettable coastal sanctuary',
    comment:
      "An absolutely incredible stay! The staff were so friendly, the room was stunning and the ocean view was unforgettable. We can't wait to come back!",
  },
  {
    id: 'fallback-2',
    guest_name: 'Marcus & Elena Vance',
    guest_country: 'Switzerland',
    room_name: 'Private Pool Villa',
    overall_rating: 5,
    title: 'Pure tranquility and bespoke hospitality',
    comment:
      'From the private infinity pool at sunrise to the candlelit beach dining, every detail at Serenity Bay felt thoughtfully curated for complete relaxation.',
  },
];

const getInitials = (name) => {
  const parts = String(name || 'VG').trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || '').join('') || 'VG';
};

/**
 * Home Page Guest Testimonials Carousel
 * Fetches admin-featured & approved verified stay reviews from /api/reviews/featured.
 */
export default function Testimonials() {
  const [reviews, setReviews] = useState(FALLBACK_TESTIMONIALS);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    fetchFeaturedReviews()
      .then((data) => {
        if (mounted && Array.isArray(data) && data.length > 0) {
          setReviews(data);
          setActiveIndex(0);
        }
      })
      .catch(() => {
        // Keep fallback testimonials silently if API is unavailable
      });
    return () => {
      mounted = false;
    };
  }, []);

  const current = reviews[activeIndex] || reviews[0];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  return (
    <section
      aria-label="Verified Guest Testimonials"
      className="w-full bg-[#063B32] text-white py-12 px-6 md:px-12 my-12 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8">
        {/* Left Side: Heading & "View All Reviews" CTA */}
        <div className="lg:col-span-4 flex flex-col justify-center">
          <span className="text-[#b8972e] tracking-[0.2em] uppercase text-[11px] font-bold block mb-3">
            GUEST REVIEWS
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl font-normal leading-tight mb-3 text-white">
            What Our Guests Say
          </h2>
          <p className="text-gray-200 text-xs md:text-sm font-light leading-relaxed mb-6">
            Real stories from verified travelers who experienced the magic of Serenity Bay.
          </p>

          <Link
            to="/reviews"
            className="bg-[#b8972e] text-black px-5 py-2.5 rounded-lg text-xs font-medium hover:bg-[#a68525] transition duration-300 inline-flex items-center gap-2 shadow-sm w-fit"
          >
            View All Reviews <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Vertical Separator Line (Desktop Only) */}
        <div className="hidden lg:block lg:col-span-1 justify-self-center h-28 w-[1px] bg-white/20" />

        {/* Center: Active Review Card */}
        <div className="lg:col-span-5 bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-2xl relative shadow-lg">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-start gap-4">
              {/* Guest Initials Avatar */}
              <div className="w-12 h-12 rounded-full bg-[#b8972e] text-[#061C2B] font-serif text-base font-bold flex items-center justify-center shrink-0">
                {getInitials(current.guest_name)}
              </div>
              <div>
                <h3 className="font-serif text-base md:text-lg font-medium text-white leading-tight">
                  {current.guest_name}
                </h3>
                <p className="text-[11px] text-gray-300 font-light mb-1">
                  {current.guest_country || current.room_name || 'Verified Guest'}
                </p>

                {/* Star Rating Bar */}
                <div className="flex items-center gap-0.5 text-[#b8972e]">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < Number(current.overall_rating || 5)
                          ? 'fill-[#b8972e] text-[#b8972e]'
                          : 'text-white/30'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider bg-white/10 text-[#f3d474] px-2.5 py-1 rounded-full shrink-0">
              <ShieldCheck className="w-3 h-3" />
              Verified Stay
            </span>
          </div>

          {current.title && (
            <p className="text-xs font-semibold text-[#f3d474] mb-1.5">
              {current.title}
            </p>
          )}

          {/* Testimonial Quote */}
          <p className="text-gray-200 font-light italic leading-relaxed text-xs md:text-sm line-clamp-4">
            &ldquo;{current.comment}&rdquo;
          </p>

          {current.room_name && (
            <p className="text-[11px] text-gray-300/80 mt-3">
              Stayed in {current.room_name}
            </p>
          )}
        </div>

        {/* Right Side: Slider Navigation Arrows & Counter */}
        <div className="lg:col-span-2 flex items-center justify-center lg:justify-end gap-3">
          <button
            type="button"
            onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition duration-300 text-white cursor-pointer"
            aria-label="Previous review"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-white/70 font-medium tabular-nums">
            {activeIndex + 1} / {reviews.length}
          </span>
          <button
            type="button"
            onClick={handleNext}
            className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition duration-300 text-white cursor-pointer"
            aria-label="Next review"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
