import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Wifi,
  Tv,
  Coffee,
  Wind,
  Maximize,
  Users,
  Bed,
  Eye,
  Check,
  Sparkles,
  Waves,
  DoorOpen,
  Utensils,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Info,
  Grid,
  Image as ImageIcon,
  Dumbbell,
  Shield,
  Bath
} from 'lucide-react';
import { ROOMS_DATA } from '../constants/hotelData';
import BookingBar from '../components/BookingBar';

const RoomDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [similarScroll, setSimilarScroll] = useState({ left: false, right: false });

  // useRef for Similar Rooms horizontal scroll container to ensure 100% working navigation arrows
  const similarRoomsRef = useRef(null);

  // Scroll to top automatically whenever the room ID changes or page loads
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  // Scroll handler function for Similar Rooms arrows
  const scrollSimilarRooms = (direction) => {
    if (similarRoomsRef.current) {
      if (direction === 'left' && !similarScroll.left) return;
      if (direction === 'right' && !similarScroll.right) return;
      const scrollAmount = direction === 'left' ? -380 : 380;
      similarRoomsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Find the selected room from data or fallback to first room
  const room = ROOMS_DATA.find((r) => r.id === parseInt(id)) || ROOMS_DATA[0];

  // Filter similar rooms for recommendations (excluding current room)
  const similarRooms = ROOMS_DATA.filter((r) => r.id !== room.id);

  useEffect(() => {
    const scrollContainer = similarRoomsRef.current;
    if (!scrollContainer) return undefined;

    const updateScrollState = () => {
      const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      setSimilarScroll({
        left: scrollContainer.scrollLeft > 0,
        right: scrollContainer.scrollLeft < maxScrollLeft - 1
      });
    };

    updateScrollState();
    scrollContainer.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);

    return () => {
      scrollContainer.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [room.id, similarRooms.length]);

  // Image list handler with SEO fallback
  const imageList = room.images && room.images.length > 0
    ? room.images
    : ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800'];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  /**
   * Helper function to dynamically map room amenities to appropriate Lucide icons.
   * Supports both current amenities and future additions seamlessly.
   */
  const getAmenityIcon = (amenityName) => {
    if (!amenityName) return Sparkles;
    const text = amenityName.toString().toLowerCase().trim();

    if (text.includes('wifi') || text.includes('wi-fi') || text.includes('internet') || text.includes('net')) {
      return Wifi;
    }
    if (text.includes('air') || text.includes('ac') || text.includes('wind') || text.includes('condition')) {
      return Wind;
    }
    if (text.includes('coffee') || text.includes('tea') || text.includes('minibar') || text.includes('bar')) {
      return Coffee;
    }
    if (text.includes('tv') || text.includes('television') || text.includes('screen') || text.includes('entertainment')) {
      return Tv;
    }
    if (text.includes('bed') || text.includes('sleep') || text.includes('king') || text.includes('queen')) {
      return Bed;
    }
    if (text.includes('pool') || text.includes('view') || text.includes('ocean') || text.includes('sea') || text.includes('beach') || text.includes('water')) {
      return Waves;
    }
    if (text.includes('balcony') || text.includes('terrace') || text.includes('deck') || text.includes('lounge') || text.includes('living') || text.includes('patio')) {
      return DoorOpen;
    }
    if (text.includes('dining') || text.includes('breakfast') || text.includes('service') || text.includes('food') || text.includes('meal') || text.includes('kitchen')) {
      return Utensils;
    }
    if (text.includes('gym') || text.includes('fitness') || text.includes('workout')) {
      return Dumbbell;
    }
    if (text.includes('bath') || text.includes('jacuzzi') || text.includes('spa') || text.includes('shower')) {
      return Bath;
    }
    if (text.includes('safe') || text.includes('security') || text.includes('lock')) {
      return Shield;
    }

    return Sparkles;
  };

  // Safe amenities list with default fallback
  const currentAmenities = room.amenities && room.amenities.length > 0
    ? room.amenities
    : ["Free Wi-Fi", "Air Conditioning", "Balcony", "Room Service"];

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#061C2B] overflow-x-hidden">

      {/* ================= 1. HERO BANNER SECTION (Clean Green Look with Smooth Animation) ================= */}
      <header
        className="relative h-[450px] md:h-[600px] bg-cover bg-center flex flex-col justify-center px-6 pt-20 md:px-12 md:pt-28 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(6, 59, 50, 0.85) 0%, rgba(6, 59, 50, 0.45) 40%, rgba(6, 59, 50, 0.1) 70%, rgba(6, 59, 50, 0) 90%), url(${imageList[0]})`
        }}
      >
        <div className="max-w-7xl mx-auto w-full text-left text-white animate-[fadeInUp_1s_ease-out]">
          {/* Breadcrumbs for SEO & Navigation */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-200 mb-4 tracking-wider uppercase drop-shadow-md">
            <Link to="/" className="hover:text-[#C9A24B] transition-colors">Home</Link>
            <span>/</span>
            <Link to="/rooms" className="hover:text-[#C9A24B] transition-colors">Rooms & Suites</Link>
            <span>/</span>
            <span className="text-[#C9A24B]" aria-current="page">{room.title}</span>
          </nav>

          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-white font-light tracking-wide mb-3 leading-tight drop-shadow-lg">
            {room.title}
          </h1>
          <p className="text-gray-100 text-sm md:text-base font-light max-w-xl leading-relaxed drop-shadow-md">
            {room.description}
          </p>
        </div>
      </header>

      {/* Floating Booking Search Bar (Matched exact width to prevent wrapping) */}
      <div className="w-full max-w-[1350px] mx-auto px-4 -mt-12 md:-mt-16 relative z-20 mb-16 md:mb-20">
        <BookingBar />
      </div>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 space-y-16">

        {/* ================= 2. TOP SECTION: GALLERY + ROOM QUICK INFO & BOOKING ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: Image Slider & Thumbnails (Responsive 7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative h-[340px] sm:h-[440px] rounded-2xl overflow-hidden shadow-xl border border-gray-100 group">
              <img
                src={imageList[currentImageIndex]}
                alt={`${room.title} view ${currentImageIndex + 1}`}
                className="w-full h-full object-cover transition-all duration-700 ease-in-out"
              />

              {/* Category Badge */}
              <div className="absolute top-4 left-4 bg-[#061C2B]/80 backdrop-blur-md border border-white/20 text-[#C9A24B] text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{room.category || 'Premium Room'}</span>
              </div>

              {/* Slider Navigation Arrows */}
              <button
                onClick={prevImage}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#061C2B]/60 hover:bg-[#061C2B] text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 shadow-md"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                aria-label="Next image"
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#061C2B]/60 hover:bg-[#061C2B] text-white flex items-center justify-center transition-all opacity-80 hover:opacity-100 shadow-md"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Image Counter Badge */}
              <div className="absolute bottom-4 left-4 bg-[#061C2B]/75 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-[#C9A24B]" />
                <span>{currentImageIndex + 1} / {imageList.length}</span>
              </div>
            </div>

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-6 gap-2 sm:gap-3">
              {imageList.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  aria-label={`Switch to image ${idx + 1}`}
                  className={`relative h-16 sm:h-20 rounded-xl overflow-hidden border-2 transition-all ${currentImageIndex === idx ? 'border-[#C9A24B] scale-95 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                >
                  <img src={img} alt={`Room thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Room Details, Key Specs, Features & Booking (5 Cols) */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-[#E8E2D5] shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <h2 className="font-serif text-3xl sm:text-4xl text-[#061C2B] tracking-wide leading-tight">
                {room.title}
              </h2>

              {room.allowedPackage && (
                <div>
                  <div className="inline-flex items-center gap-1.5 bg-[#C9A24B]/10 border border-[#C9A24B]/30 px-3 py-1 rounded-md text-[#B38E38] text-xs font-medium">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A24B]" />
                    <span>{room.allowedPackage}</span>
                  </div>
                </div>
              )}

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-light pt-1">
                {room.longDescription || room.description}
              </p>

              {/* Key Specifications Grid */}
              <div className="pt-4 pb-3 border-t border-b border-[#E8E2D5] grid grid-cols-2 gap-y-3 gap-x-4 text-xs text-gray-700">
                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-[#C9A24B] shrink-0" />
                  <span className="truncate">{room.bed}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize className="w-4 h-4 text-[#C9A24B] shrink-0" />
                  <span className="truncate">{room.size}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#C9A24B] shrink-0" />
                  <span className="truncate">{room.guests}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#C9A24B] shrink-0" />
                  <span className="truncate">{room.view}</span>
                </div>
              </div>

              {/* Special Features Checklist */}
              <div className="pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#061C2B] mb-2.5">
                  Special Features
                </h3>
                <div className="space-y-2 text-xs text-gray-600">
                  {(room.specialFeatures || [
                    "Private balcony with ocean view",
                    "Luxurious bathroom amenities",
                    "24/7 Room Service"
                  ]).map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#C9A24B]/20 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-[#C9A24B]" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Price & Book Now CTA with Smooth Scroll to Top for Checkout */}
            <div className="pt-5 border-t border-[#E8E2D5] flex items-center justify-between gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">Starting from</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#061C2B]">{room.price}</span>
                  <span className="text-xs text-gray-500 font-light">/ night</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  navigate('/checkout', { state: { room } });
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-gradient-to-r from-[#C9A24B] to-[#B38E38] hover:from-[#B38E38] hover:to-[#9E7C2B] text-black py-3.5 px-8 rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-lg active:scale-95 tracking-wide cursor-pointer"
              >
                <span>Book Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* ================= 3. TABS SECTION (Overview / Amenities / Gallery) ================= */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#E8E2D5] shadow-sm mt-8 w-full max-w-full overflow-hidden">

          {/* Tab Navigation Header Pills (Responsive Grid for Mobile to Avoid Scrolling) */}
          <div className="flex justify-center mb-10 w-full">
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#FAF8F5] rounded-2xl sm:rounded-full border border-[#C9A24B]/40 w-full max-w-lg shadow-sm">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-6 py-2.5 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-semibold tracking-wider transition-all cursor-pointer ${activeTab === 'overview'
                    ? 'bg-gradient-to-r from-[#C9A24B] to-[#B38E38] text-white shadow-md font-bold'
                    : 'text-[#063B32] hover:bg-[#C9A24B]/15 bg-transparent'
                  }`}
              >
                <Info className={`w-3.5 h-3.5 shrink-0 transition-colors ${activeTab === 'overview' ? 'text-white' : 'text-[#C9A24B]'}`} />
                <span className="truncate">Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('amenities')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-6 py-2.5 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-semibold tracking-wider transition-all cursor-pointer ${activeTab === 'amenities'
                    ? 'bg-gradient-to-r from-[#C9A24B] to-[#B38E38] text-white shadow-md font-bold'
                    : 'text-[#063B32] hover:bg-[#C9A24B]/15 bg-transparent'
                  }`}
              >
                <Sparkles className={`w-3.5 h-3.5 shrink-0 transition-colors ${activeTab === 'amenities' ? 'text-white' : 'text-[#C9A24B]'}`} />
                <span className="truncate">Amenities</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-6 py-2.5 rounded-xl sm:rounded-full text-[11px] sm:text-xs font-semibold tracking-wider transition-all cursor-pointer ${activeTab === 'gallery'
                    ? 'bg-gradient-to-r from-[#C9A24B] to-[#B38E38] text-white shadow-md font-bold'
                    : 'text-[#063B32] hover:bg-[#C9A24B]/15 bg-transparent'
                  }`}
              >
                <Grid className={`w-3.5 h-3.5 shrink-0 transition-colors ${activeTab === 'gallery' ? 'text-white' : 'text-[#C9A24B]'}`} />
                <span className="truncate">Gallery</span>
              </button>
            </div>
          </div>

          {/* TAB 1: OVERVIEW CONTENT */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <h3 className="font-serif text-3xl text-[#061C2B]">Room Overview</h3>
                <p className="text-sm leading-relaxed text-gray-600 font-light">
                  {room.roomOverview || room.longDescription || room.description}
                </p>
                <div className="pt-2 text-xl font-serif italic text-[#C9A24B]">
                  Luxury beyond expectations
                </div>
              </div>

              {/* Video Walkthrough / Overview Banner */}
              <div className="lg:col-span-6 relative rounded-2xl overflow-hidden shadow-lg border border-gray-100 group h-[260px] sm:h-[300px]">
                {room.videoUrl ? (
                  <video
                    src={room.videoUrl}
                    controls
                    className="w-full h-full object-cover"
                    poster={imageList[1] || imageList[0]}
                  />
                ) : (
                  <img
                    src={imageList[1] || imageList[0]}
                    alt="Room overview showcase"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
          )}

          {/* TAB 2: AMENITIES CONTENT */}
          {activeTab === 'amenities' && (
            <div className="space-y-8">
              <div className="text-center">
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A24B]">
                  Everything you need
                </span>
                <h3 className="font-serif text-3xl text-[#061C2B] mt-2">Room Amenities & Services</h3>
                <div className="mx-auto mt-3 h-px w-12 bg-[#C9A24B]" />
              </div>

              <div className="mx-auto flex flex-wrap justify-center max-w-5xl gap-4">
                {currentAmenities.map((item, idx) => {
                  const IconComponent = getAmenityIcon(item);

                  return (
                    <div
                      key={idx}
                      className="group w-[220px] rounded-2xl bg-gradient-to-br from-white to-[#FAF8F5] border border-[#E8E2D5] p-5 text-center shadow-sm hover:-translate-y-1 hover:border-[#C9A24B]/60 hover:shadow-md transition-all duration-300"
                    >
                      <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-[#C9A24B]/40 bg-[#C9A24B]/10 group-hover:bg-[#C9A24B] transition-colors duration-300">
                        <IconComponent className="h-5 w-5 text-[#B38E38] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                      </div>
                      <span className="block text-xs font-medium leading-relaxed text-[#061C2B]">{item}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: GALLERY CONTENT */}
          {activeTab === 'gallery' && (
            <div className="flex flex-wrap justify-center gap-4">
              {(room.galleryImages || imageList).map((img, idx) => (
                <div
                  key={idx}
                  className="w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-1rem)] h-44 sm:h-56 rounded-xl overflow-hidden border border-gray-100 shadow-sm"
                >
                  <img
                    src={img}
                    alt={`Room gallery photo ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          )}

        </div>

        {/* ================= 4. SIMILAR ROOMS FULL WIDTH SECTION ================= */}
        <section
          aria-label="Similar Rooms"
          className="relative left-1/2 mt-16 w-screen -translate-x-1/2 overflow-hidden bg-[#063B32] px-6 py-16 text-white shadow-2xl md:px-12"
        >
          <div className="max-w-7xl mx-auto space-y-8 relative z-10">

            {/* Header with Perfectly Aligned Functional Navigation Arrows */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#C9A24B]/25 pb-6">
              <div>
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#C9A24B] font-semibold">Discover More</span>
                <h3 className="mt-1 font-serif text-3xl text-white sm:text-4xl">Similar Rooms</h3>
                <p className="mt-2 max-w-lg text-xs font-light leading-relaxed text-gray-300">
                  Explore refined spaces designed for unforgettable stays at Serenity Bay.
                </p>
              </div>

              {/* Navigation Arrows (Properly aligned with flex) */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => scrollSimilarRooms('left')}
                  aria-label="Previous rooms"
                  disabled={!similarScroll.left}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${similarScroll.left
                    ? 'border-[#C9A24B]/50 text-[#C9A24B] hover:border-[#C9A24B] hover:bg-[#C9A24B] hover:text-[#063B32] active:scale-95'
                    : 'cursor-not-allowed border-white/20 text-white/30 blur-[0.5px] opacity-50'
                    }`}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => scrollSimilarRooms('right')}
                  aria-label="Next rooms"
                  disabled={!similarScroll.right}
                  className={`flex h-10 w-10 items-center justify-center rounded-full border transition-all ${similarScroll.right
                    ? 'border-[#C9A24B]/50 text-[#C9A24B] hover:border-[#C9A24B] hover:text-[#063B32] active:scale-95'
                    : 'cursor-not-allowed border-white/20 text-white/30 blur-[0.5px] opacity-50'
                    }`}
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cards Container with Hidden Scrollbar & useRef */}
            <div
              ref={similarRoomsRef}
              className="flex gap-6 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              {similarRooms.map((simRoom) => (
                <div
                  key={simRoom.id}
                  onClick={() => {
                    navigate(`/rooms/${simRoom.id}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.07] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A24B]/70 hover:bg-white/[0.12] hover:shadow-2xl shrink-0 w-[340px] sm:w-[380px] md:w-[400px] snap-start"
                >
                  {/* Image Container */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={simRoom.images?.[0] || simRoom.image}
                      alt={simRoom.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <span className="absolute left-3 top-3 rounded-full border border-[#C9A24B]/60 bg-[#061C2B]/80 px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-[#C9A24B] backdrop-blur-sm">
                      {simRoom.category}
                    </span>
                  </div>

                  {/* Compact content area */}
                  <div className="flex flex-col justify-between p-4 space-y-3">
                    <div>
                      <h4 className="font-serif text-lg text-white group-hover:text-[#C9A24B] transition-colors line-clamp-1">
                        {simRoom.title}
                      </h4>
                      <p className="mt-1 line-clamp-1 text-xs font-light leading-relaxed text-gray-300">
                        {simRoom.description}
                      </p>

                      {/* Bed, Guests & Size Specs with Icons */}
                      <div className="mt-3 flex items-center gap-3 text-[10px] text-gray-200">
                        <div className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" />
                          <span className="truncate">{simRoom.bed}</span>
                        </div>
                        <span className="h-3 w-px bg-white/20" />
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" />
                          <span className="truncate">{simRoom.guests}</span>
                        </div>
                        <span className="h-3 w-px bg-white/20" />
                        <div className="flex items-center gap-1">
                          <Maximize className="w-3.5 h-3.5 text-[#C9A24B] shrink-0" />
                          <span className="truncate">{simRoom.size}</span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Arrow Button */}
                    <div className="flex items-center justify-between border-t border-white/10 pt-3">
                      <div>
                        <span className="text-base font-semibold text-[#C9A24B]">
                          {simRoom.price}
                        </span>
                        <span className="text-[10px] text-gray-300 font-light"> / night</span>
                      </div>

                      {/* Circular Arrow Button Icon */}
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#C9A24B]/40 transition-all group-hover:border-[#C9A24B] group-hover:bg-[#C9A24B]">
                        <ArrowRight className="w-3.5 h-3.5 text-[#C9A24B] group-hover:text-[#063B32] transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      </main>

      {/* Custom keyframes for smooth fade-in-up animation */}
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
    </div>
  );
};

export default RoomDetailsPage;