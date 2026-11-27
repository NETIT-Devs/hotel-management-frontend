import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  BedDouble,
  Waves,
  Utensils,
  Sun,
} from 'lucide-react';
import RoomsBanner from '../components/RoomsBanner';
import { applyPageSEO } from '../utils/seo';
import galleryPageHero from '../assets/galleryPageHero.webp';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Curated gallery filter categories with semantic icons matching backend `gallery.category` values
const CATEGORIES = ['All Photos', 'Rooms & Suites', 'Facilities', 'Dining', 'Resort Life'];
const CATEGORY_ICONS = {
  'All Photos': Camera,
  'Rooms & Suites': BedDouble,
  Facilities: Waves,
  Dining: Utensils,
  'Resort Life': Sun,
};
const PAGE_SIZE = 9;

// Graceful fallback showcase used only if the live gallery API is temporarily unreachable
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

/**
 * Resolves a context-aware exploration route for the active Lightbox photograph.
 * Preserves a calm 5-star editorial gallery while connecting smoothly into
 * the real booking journey (Rooms -> Availability -> Checkout, Facilities -> Concierge, Offers -> Availability -> Checkout).
 *
 * @param {object} photo - Active gallery photo object
 * @returns {{ label: string, sublabel: string, to: string }}
 */
function getLightboxDestination(photo) {
  const cat = String(photo?.category || '').toLowerCase();
  if (cat.includes('room') || cat.includes('suite')) {
    return {
      label: 'Explore Rooms & Suites',
      sublabel: 'View suite details & check live availability',
      to: '/rooms',
    };
  }
  if (cat.includes('facilit') || cat.includes('dining') || cat.includes('spa')) {
    return {
      label: 'Explore Facilities & Dining',
      sublabel: 'View hours & concierge reservations',
      to: '/facilities',
    };
  }
  return {
    label: 'Discover Exclusive Offers',
    sublabel: 'Explore curated stays & seasonal packages',
    to: '/offers',
  };
}

/**
 * GalleryPage Component
 * 5-star editorial visual showcase for Serenity Bay Hotel & Resort.
 * Features:
 *  - Clean, distraction-free photography grid (no intrusive Book Now overlays)
 *  - Live MySQL gallery sync with category filters & progressive Load More pagination
 *  - Accessible fullscreen Lightbox with keyboard navigation, mobile swipe gestures,
 *    background scroll lock, and category-aware exploration links into the booking flow
 *  - Dynamic SEO metadata & Schema.org ImageGallery JSON-LD structured data
 */
export default function GalleryPage() {
  const [photos, setPhotos] = useState(FALLBACK_GALLERY);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All Photos');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Track touch X coordinates for smooth mobile swipe inside the fullscreen Lightbox
  const touchStartXRef = useRef(null);

  // Fetch live resort gallery photos from backend API on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    let cancelled = false;

    fetch(`${API_BASE}/gallery`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data?.items) && data.items.length > 0) {
          setPhotos(data.items);
        }
      })
      .catch(() => {
        // Retain graceful fallback showcase if backend is unreachable
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Synchronize document SEO metadata & Schema.org ImageGallery JSON-LD
  useEffect(() => {
    return applyPageSEO({
      title: 'Resort Photo Gallery — Luxury Suites, Dining & Coastal Sanctuary',
      description:
        'Explore curated photography of Serenity Bay Hotel & Resort: private pool villas, oceanfront suites, infinity pools, fine dining terraces, and coastal sunsets.',
      canonicalPath: '/gallery',
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'ImageGallery',
        name: 'Serenity Bay Hotel & Resort Photo Gallery',
        description:
          'Curated editorial photography showcasing luxury rooms, suites, dining venues, and beachfront facilities at Serenity Bay Hotel & Resort.',
        associatedMedia: photos.slice(0, 12).map((item) => ({
          '@type': 'ImageObject',
          name: item.title,
          caption: item.caption || item.title,
          contentUrl: item.image_url,
        })),
      },
    });
  }, [photos]);

  // Compute photo counts per category tab
  const categoryCounts = useMemo(() => {
    const counts = { 'All Photos': photos.length };
    CATEGORIES.slice(1).forEach((cat) => {
      counts[cat] = photos.filter((p) => p.category === cat).length;
    });
    return counts;
  }, [photos]);

  // Filter photos by active category
  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'All Photos') return photos;
    return photos.filter((p) => p.category === activeCategory);
  }, [photos, activeCategory]);

  const visiblePhotos = filteredPhotos.slice(0, visibleCount);
  const remainingCount = Math.max(0, filteredPhotos.length - visiblePhotos.length);

  // Navigate prev/next inside Lightbox safely
  const handlePrevPhoto = () => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev - 1 + filteredPhotos.length) % filteredPhotos.length
    );
  };

  const handleNextPhoto = () => {
    setLightboxIndex((prev) =>
      prev === null ? null : (prev + 1) % filteredPhotos.length
    );
  };

  // Keyboard navigation + background page scroll lock while Lightbox is open
  useEffect(() => {
    if (lightboxIndex === null) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') handleNextPhoto();
      if (e.key === 'ArrowLeft') handlePrevPhoto();
    };
    window.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [lightboxIndex, filteredPhotos.length]);

  const activeLightboxPhoto =
    lightboxIndex !== null && filteredPhotos[lightboxIndex]
      ? filteredPhotos[lightboxIndex]
      : null;
  const lightboxDestination = activeLightboxPhoto
    ? getLightboxDestination(activeLightboxPhoto)
    : null;

  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#061C2B] overflow-x-hidden">
      {/* ================= HERO BANNER ================= */}
      <header
        className="relative h-[450px] md:h-[600px] bg-cover bg-center flex flex-col justify-center px-6 pt-20 md:px-12 md:pt-28"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(6, 59, 50, 0.85) 0%, rgba(6, 59, 50, 0.45) 40%, rgba(6, 59, 50, 0.1) 70%, rgba(6, 59, 50, 0) 90%), url(${galleryPageHero})`,
        }}
        role="banner"
        aria-label="Resort Photo Gallery Header"
      >
        <div className="max-w-7xl mx-auto w-full text-left animate-[fadeInUp_1s_ease-out]">
          <span className="text-[#C5A253] tracking-[0.2em] uppercase text-xs font-bold block mb-2">
            VISUAL JOURNEY · SERENITY BAY
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-normal mb-3 md:mb-4">
            Resort Photo <span className="italic text-[#C9A24B]">Gallery</span>
          </h1>
          <p className="text-gray-200 text-xs sm:text-sm md:text-base font-light max-w-xl leading-relaxed mb-5">
            Step inside our oceanfront sanctuary. Explore sun-drenched private pool villas, twilight dining terraces, and tranquil coastal moments.
          </p>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-[#C9A24B]/40 text-white px-4 py-2 rounded-full text-xs">
            <Camera className="w-4 h-4 text-[#C9A24B]" aria-hidden="true" />
            <span>{photos.length} Curated Luxury Moments</span>
          </div>
        </div>
      </header>

      {/* ================= EDITORIAL INTRO HEADING (MATCHING OFFERS & FACILITIES RHYTHM) ================= */}
      <section
        className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 md:pt-14 pb-6 text-center"
        aria-label="Gallery Introduction"
      >
        <div className="flex items-center justify-center gap-3 mb-3">
          <span className="h-[1px] w-10 bg-[#C9A24B]" />
          <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#C9A24B]">
            CURATED VISUAL COLLECTION
          </p>
          <span className="h-[1px] w-10 bg-[#C9A24B]" />
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#063B32] font-normal mb-3">
          Moments Across Serenity Bay
        </h2>
        <p className="mx-auto max-w-2xl text-xs sm:text-sm md:text-base leading-relaxed text-gray-600 font-light">
          Browse our resort photography by collection—click any image to experience it in fullscreen detail.
        </p>
      </section>

      {/* ================= PROMINENT LUXURY FILTER TABS ================= */}
      <section
        className="max-w-6xl mx-auto px-4 sm:px-6 pb-12 text-center"
        aria-label="Filter Gallery Photos by Category"
      >
        <div
          className="bg-[#FAF8F5] border border-[#C9A24B]/45 p-2.5 sm:p-3 rounded-2xl md:rounded-full shadow-lg inline-flex flex-wrap justify-center items-center gap-2 sm:gap-2.5"
          role="group"
          aria-label="Gallery Categories"
        >
          {CATEGORIES.map((cat) => {
            const active = activeCategory === cat;
            const CatIcon = CATEGORY_ICONS[cat] || Camera;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setActiveCategory(cat);
                  setVisibleCount(PAGE_SIZE);
                }}
                className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap ${active
                  ? 'bg-gradient-to-r from-[#C9A24B] to-[#b49147] text-[#061C2B] shadow-md font-bold'
                  : 'text-[#063B32] hover:bg-[#C9A24B]/15 bg-transparent'
                  }`}
              >
                <CatIcon
                  className={`w-4 h-4 transition-colors shrink-0 ${active ? 'text-[#061C2B]' : 'text-[#C9A24B]'
                    }`}
                  aria-hidden="true"
                />
                <span>{cat}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ================= EDITORIAL GALLERY GRID ================= */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-5 md:px-8 pb-20"
        aria-label="Resort Photography Collection"
      >
        {loading ? (
          <div className="bg-white rounded-3xl p-14 text-center shadow-sm border border-[#C9A24B]/25">
            <p className="text-sm text-gray-500">Curating Serenity Bay photo gallery...</p>
          </div>
        ) : filteredPhotos.length === 0 ? (
          <div className="bg-white rounded-3xl p-14 text-center shadow-sm border border-[#C9A24B]/25">
            <Camera className="w-10 h-10 text-[#C9A24B] mx-auto mb-3" aria-hidden="true" />
            <h2 className="font-serif text-2xl text-[#063B32] mb-2">No Photos in This Category Yet</h2>
            <p className="text-xs text-gray-500 mb-4">Check back soon or explore All Photos.</p>
            <button
              type="button"
              onClick={() => setActiveCategory('All Photos')}
              className="bg-[#063B32] text-[#C9A24B] px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
            >
              View All Photos
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {visiblePhotos.map((photo, idx) => (
                <article
                  key={photo.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`Open fullscreen preview of ${photo.title}`}
                  onClick={() => setLightboxIndex(idx)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setLightboxIndex(idx);
                    }
                  }}
                  className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-200 shadow-md border border-[#C9A24B]/25 cursor-pointer hover:shadow-2xl transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-[#C9A24B]"
                >
                  <img
                    src={photo.image_url}
                    alt={photo.caption ? `${photo.title} — ${photo.caption}` : photo.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Subtle Top Category & Featured Pills */}
                  <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                    <span className="bg-[#061C2B]/80 backdrop-blur-sm text-[#C9A24B] text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      {photo.category}
                    </span>
                    {Boolean(photo.is_featured) && (
                      <span className="bg-[#C9A24B] text-[#061C2B] text-[10px] font-extrabold px-2.5 py-1 rounded-full inline-flex items-center gap-1 shadow-sm">
                        <Star className="w-3 h-3 fill-current" aria-hidden="true" />
                        <span>Featured</span>
                      </span>
                    )}
                  </div>

                  {/* Mobile Always-Visible Subtle Caption Bar + Desktop Full Luxury Hover Reveal */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#063B32]/90 via-[#063B32]/25 to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 sm:p-6">
                    <div className="flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="font-serif text-lg sm:text-xl text-white font-medium mb-0.5 line-clamp-1">
                          {photo.title}
                        </h2>
                        {photo.caption && (
                          <p className="text-[11px] sm:text-xs text-gray-200 font-light line-clamp-2">
                            {photo.caption}
                          </p>
                        )}
                      </div>
                      <span
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#C9A24B] text-[#061C2B] flex items-center justify-center shrink-0 shadow-lg"
                        aria-hidden="true"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Smart Progressive Load More Pagination */}
            {remainingCount > 0 && (
              <div className="mt-10 sm:mt-12 text-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                  className="bg-[#063B32] text-[#C9A24B] border border-[#C9A24B]/50 px-7 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-xs font-extrabold uppercase tracking-widest hover:opacity-95 transition shadow-lg inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore More Moments ({remainingCount} remaining)</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* Bottom Invitation Banner connecting naturally to Rooms */}
      <RoomsBanner />

      {/* ================= FULLSCREEN LUXURY LIGHTBOX ================= */}
      {activeLightboxPhoto && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Fullscreen view: ${activeLightboxPhoto.title}`}
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex items-center justify-center p-3 sm:p-8"
          onClick={() => setLightboxIndex(null)}
          onTouchStart={(e) => {
            touchStartXRef.current = e.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(e) => {
            if (touchStartXRef.current === null || filteredPhotos.length <= 1) return;
            const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
            const deltaX = endX - touchStartXRef.current;
            touchStartXRef.current = null;
            if (deltaX > 50) handlePrevPhoto();
            if (deltaX < -50) handleNextPhoto();
          }}
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close fullscreen preview"
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-[#C9A24B] text-white hover:text-[#061C2B] flex items-center justify-center transition cursor-pointer z-20"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Previous Arrow */}
          {filteredPhotos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevPhoto();
              }}
              aria-label="Previous photo"
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/50 sm:bg-white/15 hover:bg-[#C9A24B] text-white hover:text-[#061C2B] flex items-center justify-center transition cursor-pointer z-20"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Next Arrow */}
          {filteredPhotos.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextPhoto();
              }}
              aria-label="Next photo"
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/50 sm:bg-white/15 hover:bg-[#C9A24B] text-white hover:text-[#061C2B] flex items-center justify-center transition cursor-pointer z-20"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          {/* Lightbox Image & Editorial Footer */}
          <div
            className="max-w-5xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-h-[65vh] sm:max-h-[72vh] rounded-2xl overflow-hidden shadow-2xl border border-[#C9A24B]/30 bg-black flex items-center justify-center">
              <img
                src={activeLightboxPhoto.image_url}
                alt={activeLightboxPhoto.title}
                className="max-h-[65vh] sm:max-h-[72vh] w-auto object-contain"
              />
            </div>

            <div className="w-full mt-4 sm:mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white px-1 sm:px-2">
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-[#C9A24B] text-[#061C2B] px-3 py-0.5 rounded-full">
                    {activeLightboxPhoto.category}
                  </span>
                  <span className="text-xs text-gray-400">
                    {lightboxIndex + 1} / {filteredPhotos.length}
                  </span>
                </div>
                <h3 className="font-serif text-lg sm:text-2xl font-normal">
                  {activeLightboxPhoto.title}
                </h3>
                {activeLightboxPhoto.caption && (
                  <p className="text-xs text-gray-300 font-light mt-1">
                    {activeLightboxPhoto.caption}
                  </p>
                )}
              </div>

              {/* Subtle Category-Aware Editorial Link (Connects naturally into Rooms/Facilities/Offers -> Checkout) */}
              {lightboxDestination && (
                <div className="flex flex-col sm:items-end gap-1 shrink-0">
                  <Link
                    to={lightboxDestination.to}
                    onClick={() => setLightboxIndex(null)}
                    className="w-full sm:w-auto justify-center bg-white/10 hover:bg-[#C9A24B] text-[#C9A24B] hover:text-[#061C2B] border border-[#C9A24B]/50 px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider transition inline-flex items-center gap-2"
                  >
                    <span>{lightboxDestination.label}</span>
                    <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                  <span className="text-[10px] text-gray-400 hidden sm:block">
                    {lightboxDestination.sublabel}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
