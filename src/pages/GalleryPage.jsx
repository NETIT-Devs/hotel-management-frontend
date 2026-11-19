import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Sparkles,
  Maximize2,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Star,
} from 'lucide-react';
import RoomsBanner from '../components/RoomsBanner';
import galleryHeroImg from '../assets/OffersPageHero.webp';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const CATEGORIES = ['All Photos', 'Rooms & Suites', 'Facilities', 'Dining', 'Resort Life'];
const PAGE_SIZE = 9;

const FALLBACK_GALLERY = [
  {
    id: 1,
    title: 'Oceanfront Infinity Pool at Sunset',
    category: 'Facilities',
    image_url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=85&w=1200',
    caption: 'Unwind beside our heated infinity pool overlooking the Indian Ocean.',
    is_featured: 1,
  },
  {
    id: 2,
    title: 'Private Pool Villa Sanctuary',
    category: 'Rooms & Suites',
    image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=85&w=1200',
    caption: 'Secluded tropical luxury with a private plunge pool and sun deck.',
    is_featured: 1,
  },
  {
    id: 3,
    title: 'Twilight Resort Terrace',
    category: 'Resort Life',
    image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=85&w=1200',
    caption: 'Golden-hour serenity across the palm-lined coastal grounds.',
    is_featured: 1,
  },
  {
    id: 4,
    title: 'Deluxe Ocean Suite Interior',
    category: 'Rooms & Suites',
    image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=85&w=1200',
    caption: 'Handcrafted timber textures and panoramic ocean balconies.',
    is_featured: 1,
  },
];

export default function GalleryPage() {
  const [photos, setPhotos] = useState(FALLBACK_GALLERY);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All Photos');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    fetch(`${API_BASE}/gallery`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.items) && data.items.length > 0) {
          setPhotos(data.items);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = { 'All Photos': photos.length };
    CATEGORIES.slice(1).forEach((cat) => {
      counts[cat] = photos.filter((p) => p.category === cat).length;
    });
    return counts;
  }, [photos]);

  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'All Photos') return photos;
    return photos.filter((p) => p.category === activeCategory);
  }, [photos, activeCategory]);

  const visiblePhotos = filteredPhotos.slice(0, visibleCount);
  const remainingCount = Math.max(0, filteredPhotos.length - visiblePhotos.length);

  // Keyboard navigation for Fullscreen Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return undefined;
    const handleKey = (e) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev + 1) % filteredPhotos.length);
      }
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, filteredPhotos.length]);

  const activeLightboxPhoto =
    lightboxIndex !== null && filteredPhotos[lightboxIndex]
      ? filteredPhotos[lightboxIndex]
      : null;

  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#061C2B] overflow-x-hidden">
      {/* ================= HERO BANNER ================= */}
      <header
        className="relative h-[420px] md:h-[520px] bg-cover bg-center flex flex-col justify-center px-6 pt-20 md:px-12 md:pt-28"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(6, 59, 50, 0.9) 0%, rgba(6, 59, 50, 0.6) 50%, rgba(6, 59, 50, 0.25) 100%), url(${galleryHeroImg})`,
        }}
      >
        <div className="max-w-7xl mx-auto w-full text-left animate-[fadeInUp_0.8s_ease-out]">
          <span className="text-[#C9A24B] tracking-[0.25em] uppercase text-xs font-bold block mb-2">
            VISUAL JOURNEY · SERENITY BAY
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-normal mb-3">
            Resort Photo Gallery
          </h1>
          <p className="text-gray-200 text-xs sm:text-sm md:text-base font-light max-w-xl leading-relaxed mb-5">
            Step inside our oceanfront sanctuary. Explore sun-drenched private pool villas, twilight dining terraces, and tranquil coastal moments.
          </p>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-[#C9A24B]/40 text-white px-4 py-2 rounded-full text-xs">
            <Camera className="w-4 h-4 text-[#C9A24B]" />
            <span>{photos.length} Curated Luxury Moments</span>
          </div>
        </div>
      </header>

      {/* ================= CATEGORY FILTER BAR ================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-20 mb-12">
        <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-xl border border-[#C9A24B]/35 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setActiveCategory(cat);
                    setVisibleCount(PAGE_SIZE);
                  }}
                  className={`px-4 py-2.5 rounded-full text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                    active
                      ? 'bg-[#063B32] text-[#C9A24B] shadow-md'
                      : 'bg-[#FAF8F5] text-[#061C2B] border border-[#C9A24B]/25 hover:border-[#C9A24B]'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      active ? 'bg-[#C9A24B] text-[#061C2B]' : 'bg-white text-gray-500'
                    }`}
                  >
                    {categoryCounts[cat] || 0}
                  </span>
                </button>
              );
            })}
          </div>

          <span className="text-xs text-gray-500 hidden md:inline-flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#C9A24B]" />
            Click any photo to view fullscreen
          </span>
        </div>
      </section>

      {/* ================= EDITORIAL GALLERY GRID ================= */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 pb-20">
        {loading ? (
          <div className="bg-white rounded-3xl p-14 text-center shadow-sm border border-[#C9A24B]/25">
            <p className="text-sm text-gray-500">Curating Serenity Bay photo gallery...</p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="bg-white rounded-3xl p-14 text-center shadow-sm border border-[#C9A24B]/25">
            <Camera className="w-10 h-10 text-[#C9A24B] mx-auto mb-3" />
            <h3 className="font-serif text-2xl text-[#063B32] mb-2">No Photos in This Category Yet</h3>
            <p className="text-xs text-gray-500">Check back soon or explore All Photos.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visiblePhotos.map((photo, idx) => (
                <article
                  key={photo.id}
                  onClick={() => setLightboxIndex(idx)}
                  className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-200 shadow-md border border-[#C9A24B]/25 cursor-pointer hover:shadow-2xl transition-all duration-500"
                >
                  <img
                    src={photo.image_url}
                    alt={photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Subtle Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <span className="bg-[#061C2B]/80 backdrop-blur-sm text-[#C9A24B] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      {photo.category}
                    </span>
                    {Boolean(photo.is_featured) && (
                      <span className="bg-[#C9A24B] text-[#061C2B] text-[10px] font-extrabold px-2.5 py-1 rounded-full inline-flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-current" /> Featured
                      </span>
                    )}
                  </div>

                  {/* Luxury Hover Reveal Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#063B32]/95 via-[#063B32]/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <h3 className="font-serif text-xl text-white font-medium mb-1">
                          {photo.title}
                        </h3>
                        {photo.caption && (
                          <p className="text-xs text-gray-200 font-light line-clamp-2">
                            {photo.caption}
                          </p>
                        )}
                      </div>
                      <span className="w-10 h-10 rounded-full bg-[#C9A24B] text-[#061C2B] flex items-center justify-center shrink-0 shadow-lg">
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Smart Load More Pagination */}
            {remainingCount > 0 && (
              <div className="mt-12 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  className="bg-[#063B32] text-[#C9A24B] border border-[#C9A24B]/50 px-8 py-4 rounded-2xl text-xs font-extrabold uppercase tracking-widest hover:opacity-95 transition shadow-lg inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore More Moments ({remainingCount} remaining)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <RoomsBanner />

      {/* ================= FULLSCREEN LUXURY LIGHTBOX ================= */}
      {activeLightboxPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close fullscreen preview"
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-[#C9A24B] text-white hover:text-[#061C2B] flex items-center justify-center transition cursor-pointer z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Previous Arrow */}
          {filteredPhotos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
              }}
              aria-label="Previous photo"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-[#C9A24B] text-white hover:text-[#061C2B] flex items-center justify-center transition cursor-pointer z-20"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Next Arrow */}
          {filteredPhotos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev + 1) % filteredPhotos.length);
              }}
              aria-label="Next photo"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-[#C9A24B] text-white hover:text-[#061C2B] flex items-center justify-center transition cursor-pointer z-20"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Lightbox Content */}
          <div
            className="max-w-5xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-h-[72vh] rounded-2xl overflow-hidden shadow-2xl border border-[#C9A24B]/30 bg-black flex items-center justify-center">
              <img
                src={activeLightboxPhoto.image_url}
                alt={activeLightboxPhoto.title}
                className="max-h-[72vh] w-auto object-contain"
              />
            </div>

            <div className="w-full mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white px-2">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-[#C9A24B] text-[#061C2B] px-3 py-0.5 rounded-full">
                    {activeLightboxPhoto.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {lightboxIndex + 1} / {filteredPhotos.length}
                  </span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-normal">
                  {activeLightboxPhoto.title}
                </h3>
                {activeLightboxPhoto.caption && (
                  <p className="text-xs text-gray-300 font-light mt-1">
                    {activeLightboxPhoto.caption}
                  </p>
                )}
              </div>

              <Link
                to="/availability"
                onClick={() => setLightboxIndex(null)}
                className="bg-gradient-to-r from-[#C9A24B] to-[#b49147] text-[#061C2B] px-5 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:opacity-95 transition shadow-md inline-flex items-center gap-2 shrink-0"
              >
                <span>Check Availability</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
