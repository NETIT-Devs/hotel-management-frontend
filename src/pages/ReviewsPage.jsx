import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  MessageSquareQuote,
  BedDouble,
  PenLine,
  SlidersHorizontal,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { fetchPublicReviews } from '../services/reviewService';
import { applyPageSEO } from '../utils/seo';
import ReviewModal from '../components/ReviewModal';
import heroImg from '../assets/experience-bg.webp';

const formatStayMonth = (val) => {
  if (!val) return '';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const getInitials = (name) => {
  const parts = String(name || 'VG').trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() || '').join('') || 'VG';
};

/**
 * Public Verified Guest Reviews Page (/reviews)
 * - Displays overall rating summary, category breakdown, and star distribution
 * - Filterable by room category, minimum rating, and sort order
 * - Includes Schema.org Hotel + AggregateRating JSON-LD for SEO
 */
export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({
    total_reviews: 0,
    average_rating: 0,
    avg_cleanliness: 0,
    avg_service: 0,
    avg_location: 0,
    avg_rooms: 0,
    stars_5: 0,
    stars_4: 0,
    stars_3: 0,
    stars_2: 0,
    stars_1: 0,
  });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [roomId, setRoomId] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [sort, setSort] = useState('newest');

  // Review submission modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadReviews = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchPublicReviews({ roomId, rating: ratingFilter, sort });
      setReviews(Array.isArray(data.reviews) ? data.reviews : []);
      if (data.summary) setSummary(data.summary);
      if (Array.isArray(data.rooms)) setRooms(data.rooms);
    } catch (err) {
      setError(err.message || 'Unable to load guest reviews right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    loadReviews();
  }, [roomId, ratingFilter, sort]);

  // Dynamic SEO & Schema.org AggregateRating JSON-LD
  useEffect(() => {
    const total = Number(summary.total_reviews || 0);
    const avg = Number(summary.average_rating || 0);

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Hotel',
      name: 'Serenity Bay Hotel & Resort',
      url: typeof window !== 'undefined' ? window.location.origin : '',
      ...(total > 0
        ? {
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: avg,
              reviewCount: total,
              bestRating: 5,
              worstRating: 1,
            },
          }
        : {}),
    };

    return applyPageSEO({
      title: 'Verified Guest Reviews',
      description:
        'Read authentic, verified guest reviews and stay ratings for Serenity Bay Hotel & Resort. Discover real experiences across our Ocean Suites, Pool Villas, and coastal hospitality.',
      canonicalPath: '/reviews',
      jsonLd,
    });
  }, [summary.total_reviews, summary.average_rating]);

  const totalCount = Number(summary.total_reviews || 0);
  const avgScore = totalCount > 0 ? Number(summary.average_rating || 0).toFixed(1) : '—';

  const categoryMetrics = useMemo(
    () => [
      { label: 'Cleanliness', score: summary.avg_cleanliness },
      { label: 'Hospitality & Service', score: summary.avg_service },
      { label: 'Location & Views', score: summary.avg_location },
      { label: 'Room Comfort', score: summary.avg_rooms },
    ],
    [summary]
  );

  return (
    <div className="min-h-screen bg-[#F2EFE9] text-gray-800">
      {/* ================= HERO BANNER (MATCHING GALLERY & OFFERS STYLE) ================= */}
      <header
        className="relative h-[450px] md:h-[600px] bg-cover bg-center flex flex-col justify-center px-6 pt-20 md:px-12 md:pt-28"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(6, 59, 50, 0.88) 0%, rgba(6, 59, 50, 0.55) 45%, rgba(6, 59, 50, 0.18) 75%, rgba(6, 59, 50, 0.05) 95%), url(${heroImg})`,
        }}
        role="banner"
        aria-label="Verified Guest Reviews Header"
      >
        <div className="max-w-7xl mx-auto w-full text-left">
          <span className="text-[#C5A253] tracking-[0.2em] uppercase text-xs font-bold block mb-2">
            100% VERIFIED STAYS · SERENITY BAY
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-normal mb-3 md:mb-4">
            Guest Stories &amp; <span className="italic text-[#C9A24B]">Reviews</span>
          </h1>
          <p className="text-gray-200 text-xs sm:text-sm md:text-base font-light max-w-xl leading-relaxed mb-6">
            Every review is submitted exclusively by guests who have completed a stay at
            Serenity Bay Hotel &amp; Resort.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-[#C9A24B] to-[#b49147] text-[#061C2B] px-6 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:opacity-95 transition shadow-lg inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <PenLine className="w-4 h-4" />
              <span>Write a Verified Review</span>
            </button>

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-[#C9A24B]/40 text-white px-4 py-2.5 rounded-full text-xs">
              <ShieldCheck className="w-4 h-4 text-[#C9A24B]" aria-hidden="true" />
              <span>{totalCount} Verified Stays</span>
            </div>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="max-w-6xl mx-auto px-4 sm:px-8 pt-10 relative z-20 pb-20 space-y-8">
        {/* Rating Summary Card */}
        <section className="bg-white rounded-3xl p-5 sm:p-8 shadow-xl border border-[#C9A24B]/25">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
            {/* Overall Score */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-start gap-4 border-b lg:border-b-0 lg:border-r border-gray-100 pb-5 lg:pb-0 lg:pr-6">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-5xl sm:text-6xl text-[#061C2B]">
                    {avgScore}
                  </span>
                  <span className="text-sm text-gray-400 font-medium">/ 5.0</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(Number(summary.average_rating || 0))
                          ? 'text-[#C9A24B] fill-[#C9A24B]'
                          : 'text-gray-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-500">
                Based on <strong className="text-[#061C2B]">{totalCount}</strong>{' '}
                verified guest {totalCount === 1 ? 'stay' : 'stays'}
              </p>
            </div>

            {/* Category Breakdown */}
            <div className="lg:col-span-4 space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Experience Breakdown
              </p>
              {categoryMetrics.map((cat) => {
                const val = Number(cat.score || 0);
                const pct = val > 0 ? Math.min(100, (val / 5) * 100) : 0;
                return (
                  <div key={cat.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700 font-medium">{cat.label}</span>
                      <span className="font-bold text-[#061C2B]">
                        {val > 0 ? val.toFixed(1) : '—'}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#C9A24B] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Star Distribution */}
            <div className="lg:col-span-4 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                Rating Distribution
              </p>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = Number(summary[`stars_${stars}`] || 0);
                const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
                return (
                  <div key={stars} className="flex items-center gap-2.5 text-xs">
                    <span className="w-8 font-semibold text-gray-600">{stars}★</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#063B32] rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-gray-500">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Filter Toolbar */}
        <section className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
            <SlidersHorizontal className="w-4 h-4 text-[#C9A24B]" />
            <span>Filter Reviews</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto">
            {/* Room Filter */}
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              aria-label="Filter by suite or villa"
              className="bg-[#FAF8F5] border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-[#C9A24B]"
            >
              <option value="">All Suites &amp; Villas</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.room_name}
                </option>
              ))}
            </select>

            {/* Rating Filter */}
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              aria-label="Filter by minimum rating"
              className="bg-[#FAF8F5] border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-[#C9A24B]"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars Only</option>
              <option value="4">4 Stars &amp; Up</option>
              <option value="3">3 Stars &amp; Up</option>
            </select>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              aria-label="Sort reviews"
              className="bg-[#FAF8F5] border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:border-[#C9A24B]"
            >
              <option value="newest">Newest First</option>
              <option value="highest">Highest Rated</option>
            </select>
          </div>
        </section>

        {/* Reviews List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gray-200" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3.5 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/4" />
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-16 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-red-100">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-[#C9A24B]/20 shadow-sm space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] text-[#C9A24B] flex items-center justify-center mx-auto">
              <MessageSquareQuote className="w-7 h-7" />
            </div>
            <h2 className="font-serif text-2xl text-[#061C2B]">
              No Reviews Match Your Filter
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
              {totalCount === 0
                ? 'Be the first verified guest to share your Serenity Bay experience.'
                : 'Try clearing your room or rating filters to explore more guest stories.'}
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              {(roomId || ratingFilter) && (
                <button
                  type="button"
                  onClick={() => {
                    setRoomId('');
                    setRatingFilter('');
                  }}
                  className="bg-gradient-to-r from-[#C9A24B] to-[#b49147] text-[#061C2B] px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:opacity-95 transition shadow-sm cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="bg-gradient-to-r from-[#C9A24B] to-[#b49147] text-[#061C2B] px-6 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:opacity-95 transition shadow-md cursor-pointer"
              >
                Leave a Review
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-gray-100 hover:border-[#C9A24B]/40 transition flex flex-col justify-between gap-4"
              >
                <div className="space-y-4">
                  {/* Top Row: Guest Info + Verified Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-[#061C2B] text-[#C9A24B] font-serif text-sm flex items-center justify-center shrink-0">
                        {getInitials(review.guest_name)}
                      </div>
                      <div>
                        <h3 className="font-serif text-base sm:text-lg text-[#061C2B] leading-tight">
                          {review.guest_name}
                        </h3>
                        <p className="text-[11px] text-gray-500">
                          {review.guest_country ? `${review.guest_country} · ` : ''}
                          {formatStayMonth(review.check_out || review.created_at)}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-full shrink-0">
                      <ShieldCheck className="w-3 h-3" />
                      Verified Stay
                    </span>
                  </div>

                  {/* Rating & Stayed Room */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.overall_rating
                              ? 'text-[#C9A24B] fill-[#C9A24B]'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>

                    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#063B32] bg-[#063B32]/5 px-2.5 py-1 rounded-lg">
                      <BedDouble className="w-3.5 h-3.5 text-[#C9A24B]" />
                      {review.room_name}
                    </span>
                  </div>

                  {/* Headline & Body */}
                  <div>
                    <h4 className="font-semibold text-sm sm:text-base text-[#061C2B] mb-1.5">
                      {review.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                      {review.comment}
                    </p>
                  </div>
                </div>

                {/* Hotel Management Reply */}
                {review.admin_reply && (
                  <div className="bg-[#FAF8F5] border-l-2 border-[#C9A24B] rounded-r-2xl p-3.5 sm:p-4 mt-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#061C2B] flex items-center gap-1.5 mb-1">
                      <Sparkles className="w-3 h-3 text-[#C9A24B]" />
                      Response from Serenity Bay Management
                    </p>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {review.admin_reply}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {/* Bottom CTA Banner */}
        <section className="bg-[#063B32] text-white rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="text-[#C9A24B] text-[10px] font-bold uppercase tracking-[0.2em] block mb-1.5">
              Plan Your Escape
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal">
              Ready to Experience Serenity Bay?
            </h2>
          </div>
          <Link
            to="/rooms"
            className="bg-gradient-to-r from-[#C9A24B] to-[#b49147] text-[#061C2B] px-6 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:opacity-95 transition shadow-md inline-flex items-center gap-2 shrink-0"
          >
            <span>Explore Suites &amp; Villas</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      {/* Review Submission Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => loadReviews()}
      />
    </div>
  );
}
