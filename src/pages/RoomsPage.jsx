import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, SlidersHorizontal, Users, Bed, ArrowRight, LayoutGrid, List, ChevronDown, X, Waves, Wifi, Wind, DoorOpen, Utensils, Sparkles, Maximize2, Eye, Building2, Castle, BedDouble, Check, DollarSign, Filter } from 'lucide-react';
import { ROOMS_DATA } from '../constants/hotelData';
import BookingBar from '../components/BookingBar';
import RoomsBanner from '../components/RoomsBanner';
import roomsPageHero from '../assets/roomsPageHero.webp';

/**
 * Amenity Icons Mapping Object
 * Maps room amenity strings to corresponding Lucide icons for visual representation.
 */
const amenityIcons = {
    'Ocean View': Waves,
    'Garden View': Sparkles,
    'Private Pool': Waves,
    'Free Wi-Fi': Wifi,
    'Air Conditioning': Wind,
    Balcony: DoorOpen,
    'In-room Dining': Utensils,
    'Breakfast Included': Utensils,
    'Living Area': Sparkles,
    Terrace: DoorOpen
};

// Extract unique filter options and price bounds from hotel data
const roomCategories = [...new Set(ROOMS_DATA.map(room => room.category))];
const roomViews = [...new Set(ROOMS_DATA.map(room => room.view))];
const bedTypes = [...new Set(ROOMS_DATA.map(room => room.bed))];
const roomAmenities = [...new Set(ROOMS_DATA.flatMap(room => room.amenities || []))];
const roomPrices = ROOMS_DATA.map(room => Number(room.price.replace(/[^0-9.]/g, '')));
const minRoomPrice = Math.min(...roomPrices);
const maxRoomPrice = Math.max(...roomPrices);

/**
 * RoomsPage Component
 * 
 * Features:
 * - Luxury Hero Section with resort background, typography, and meta description optimized for SEO.
 * - Integrated BookingBar component for seamless reservation flow.
 * - Responsive Mobile Filter Drawer (Full-width on mobile devices) to prevent layout clipping and overlap.
 * - Advanced Filter & Sort Controls (Room Types, Views, Bed Types, Amenities, and Price Range).
 * - 2-Column Responsive Grid and List View with interactive image gallery switcher and video walkthrough modals.
 * - Direct navigation to checkout/booking details flow with smooth scrolling.
 */
export default function RoomsPage() {
    const navigate = useNavigate();

    // Filter and UI layout state variables
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedViews, setSelectedViews] = useState([]);
    const [selectedBeds, setSelectedBeds] = useState([]);
    const [selectedAmenities, setSelectedAmenities] = useState([]);
    const [maxPrice, setMaxPrice] = useState(maxRoomPrice);
    const [sortBy, setSortBy] = useState('Popular');
    const [viewMode, setViewMode] = useState('grid');
    const [isSortOpen, setIsSortOpen] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false); // Controls mobile filter drawer visibility

    // Interactive states for each room (Active image index & Video modal state)
    const [activeImageIndices, setActiveImageIndices] = useState({});
    const [activeVideoUrl, setActiveVideoUrl] = useState(null);

    // Handle thumbnail image click to switch main room image dynamically
    const handleThumbnailClick = (roomId, imgIndex) => {
        setActiveImageIndices(prev => ({
            ...prev,
            [roomId]: imgIndex
        }));
    };

    // Helper function to toggle individual filter values in arrays
    const toggleFilterValue = (setter, value) => {
        setter(currentValues => currentValues.includes(value)
            ? currentValues.filter(currentValue => currentValue !== value)
            : [...currentValues, value]);
    };

    // Helper function to handle filter changes including 'All' reset logic
    const handleFilterChange = (setter, value) => {
        if (value === 'All') {
            setter([]);
            return;
        }
        toggleFilterValue(setter, value);
    };

    // Comprehensive filter logic based on user selections and pricing boundaries
    const filteredRooms = ROOMS_DATA.filter(room => {
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(room.category);
        const matchesView = selectedViews.length === 0 || selectedViews.includes(room.view);
        const matchesBed = selectedBeds.length === 0 || selectedBeds.includes(room.bed);
        const matchesAmenity = selectedAmenities.length === 0
            || selectedAmenities.every(amenity => room.amenities?.includes(amenity));
        const price = Number(room.price.replace(/[^0-9.]/g, ''));
        return matchesCategory && matchesView && matchesBed && matchesAmenity && price >= minRoomPrice && price <= maxPrice;
    });

    // Sorting logic for filtered room listings
    const sortedRooms = [...filteredRooms].sort((a, b) => {
        const priceA = Number(a.price.replace(/[^0-9.]/g, ''));
        const priceB = Number(b.price.replace(/[^0-9.]/g, ''));
        if (sortBy === 'Price: Low to High') return priceA - priceB;
        if (sortBy === 'Price: High to Low') return priceB - priceA;
        return 0;
    });

    return (
        <div className="min-h-screen bg-[#F8F5F0] text-[#061C2B] relative overflow-x-hidden">

            {/* SEO & Semantic Head Metadata Container */}
            <div className="sr-only">
                <h1>Luxury Hotel Rooms, Suites &amp; Private Villas in Sri Lanka | Serenity Bay</h1>
                <p>Explore luxury accommodation at Serenity Bay Resort. Book ocean-view suites, garden villas, and premium rooms with best rate guarantees.</p>
            </div>

            {/* Hero Section */}
            <div
                className="relative h-[450px] md:h-[600px] bg-cover bg-center flex flex-col justify-center px-6 pt-20 md:px-12 md:pt-28"
                style={{ backgroundImage: `linear-gradient(to right, rgba(6, 59, 50, 0.85) 0%, rgba(6, 59, 50, 0.45) 40%, rgba(6, 59, 50, 0.1) 70%, rgba(6, 59, 50, 0) 90%), url(${roomsPageHero})` }}
            >
                <div className="max-w-7xl mx-auto w-full text-left">
                    <span className="text-[#C5A253] tracking-[0.2em] uppercase text-xs font-bold block mb-2">
                        LUXURY STAYS / ROOMS &amp; SUITES
                    </span>
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-normal mb-3 md:mb-4">
                        Discover Our<br />
                        Rooms &amp; Suites
                    </h1>
                    <p className="text-gray-200 text-xs sm:text-sm md:text-base font-light max-w-xl leading-relaxed">
                        Elegant spaces, breathtaking views, unforgettable stays.<br />
                        Your perfect stay awaits.
                    </p>
                </div>
            </div>

            {/* Booking Bar Component Integration */}
            <div className="w-full max-w-[1350px] mx-auto px-4 -mt-12 md:-mt-16 relative z-20 mb-12 md:mb-16">
                <BookingBar />
            </div>

            {/* Mobile Filter Toggle Button Bar */}
            <div className="max-w-[1440px] mx-auto px-6 mb-6 lg:hidden flex justify-between items-center">
                <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="flex items-center gap-2 bg-[#063B32] text-[#C9A24B] px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md w-full justify-center cursor-pointer"
                >
                    <Filter className="w-4 h-4" />
                    <span>Filter &amp; Sort Options ({filteredRooms.length} Rooms Available)</span>
                </button>
            </div>

            {/* Main Content: Filter Sidebar & Rooms Grid Layout */}
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-12 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">

                {/* Left Sidebar: Filter & Sort Controls (Desktop Sticky & Full-screen Mobile Drawer) */}
                <aside
                    aria-label="Room Filter Sidebar"
                    className={`
                        fixed inset-0 z-50 w-full md:w-80 bg-[#F7F3E8] p-6 shadow-2xl transition-transform duration-300 overflow-y-auto border-r border-[#C9A24B]/40
                        lg:static lg:z-auto lg:w-auto lg:col-span-3 lg:mt-3 lg:rounded-2xl lg:shadow-sm lg:h-fit lg:sticky lg:top-28 lg:translate-x-0 lg:p-5
                        ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    `}
                >
                    {/* Mobile Close Drawer Header */}
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#C9A24B]/30">
                        <div className="flex items-center gap-2 font-serif text-lg font-medium text-[#061C2B]">
                            <SlidersHorizontal className="w-4 h-4 text-[#C9A24B]" />
                            <span>Filter &amp; Sort</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setSelectedCategories([]);
                                    setSelectedViews([]);
                                    setSelectedBeds([]);
                                    setSelectedAmenities([]);
                                    setMaxPrice(maxRoomPrice);
                                }}
                                className="text-xs text-gray-500 hover:text-[#C9A24B] underline cursor-pointer"
                            >
                                Clear All
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsMobileFilterOpen(false)}
                                className="lg:hidden text-gray-500 hover:text-[#061C2B] p-1.5 rounded-full bg-black/5 cursor-pointer"
                                aria-label="Close filters"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Room Type Filter Section */}
                    <div className="mb-6">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Room Type</h4>
                        <div className="space-y-2.5 text-sm">
                            {['All', ...roomCategories].map((cat) => {
                                const Icon = cat === 'All' ? SlidersHorizontal : cat.includes('Villa') ? Castle : cat === 'Suites' ? Castle : Building2;
                                const isSelected = cat === 'All' ? selectedCategories.length === 0 : selectedCategories.includes(cat);
                                return (
                                    <label key={cat} className="flex items-center justify-between cursor-pointer py-1">
                                        <div className="flex items-center gap-2.5">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleFilterChange(setSelectedCategories, cat)}
                                                className="peer sr-only"
                                            />
                                            <span className="flex h-4 w-4 items-center justify-center rounded border border-[#C9A24B] text-transparent transition peer-checked:border-[#C9A24B] peer-checked:bg-[#C9A24B] peer-checked:text-[#061C2B]">
                                                <Check className="h-3 w-3" />
                                            </span>
                                            <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-[#C9A24B]' : 'text-gray-400'}`} />
                                            <span className={isSelected ? 'font-medium text-[#061C2B]' : 'text-gray-600'}>{cat === 'All' ? 'All Rooms' : cat}</span>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {cat === 'All' ? ROOMS_DATA.length : ROOMS_DATA.filter(r => r.category === cat).length}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* View Filter Section */}
                    <div className="mb-6">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">View</h4>
                        <div className="space-y-2.5 text-sm">
                            {['All', ...roomViews].map((view) => {
                                const Icon = view === 'All' ? Eye : view.includes('Pool') ? Waves : view.includes('Garden') ? Sparkles : Waves;
                                const isSelected = view === 'All' ? selectedViews.length === 0 : selectedViews.includes(view);
                                return (
                                    <label key={view} className="flex items-center justify-between cursor-pointer py-1">
                                        <div className="flex items-center gap-2.5">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleFilterChange(setSelectedViews, view)}
                                                className="peer sr-only"
                                            />
                                            <span className="flex h-4 w-4 items-center justify-center rounded border border-[#C9A24B] text-transparent transition peer-checked:border-[#C9A24B] peer-checked:bg-[#C9A24B] peer-checked:text-[#061C2B]">
                                                <Check className="h-3 w-3" />
                                            </span>
                                            <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-[#C9A24B]' : 'text-gray-400'}`} />
                                            <span className={isSelected ? 'font-medium text-[#061C2B]' : 'text-gray-600'}>{view === 'All' ? 'All Views' : view}</span>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Bed Type Filter Section */}
                    <div className="mb-6">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Bed Type</h4>
                        <div className="space-y-2.5 text-sm">
                            {['All', ...bedTypes].map((bed) => {
                                const Icon = bed === 'All' ? BedDouble : bed.includes('2') ? BedDouble : Bed;
                                const isSelected = bed === 'All' ? selectedBeds.length === 0 : selectedBeds.includes(bed);
                                return (
                                    <label key={bed} className="flex items-center justify-between cursor-pointer py-1">
                                        <div className="flex items-center gap-2.5">
                                            <input
                                                type="checkbox"
                                                checked={isSelected}
                                                onChange={() => handleFilterChange(setSelectedBeds, bed)}
                                                className="peer sr-only"
                                            />
                                            <span className="flex h-4 w-4 items-center justify-center rounded border border-[#C9A24B] text-transparent transition peer-checked:border-[#C9A24B] peer-checked:bg-[#C9A24B] peer-checked:text-[#061C2B]">
                                                <Check className="h-3 w-3" />
                                            </span>
                                            <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-[#C9A24B]' : 'text-gray-400'}`} />
                                            <span className={isSelected ? 'font-medium text-[#061C2B]' : 'text-gray-600'}>{bed === 'All' ? 'All Beds' : bed}</span>
                                        </div>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Amenities Filter Section */}
                    <div className="mb-6">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Amenities</h4>
                        <div className="space-y-2.5 text-sm">
                            {['All', ...roomAmenities].map((amenity) => {
                                const Icon = amenity === 'All' ? Sparkles : amenityIcons[amenity] || Sparkles;
                                const isSelected = amenity === 'All' ? selectedAmenities.length === 0 : selectedAmenities.includes(amenity);
                                return (
                                    <label key={amenity} className="flex items-center gap-2.5 cursor-pointer py-1">
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleFilterChange(setSelectedAmenities, amenity)}
                                            className="peer sr-only"
                                        />
                                        <span className="flex h-4 w-4 items-center justify-center rounded border border-[#C9A24B] text-transparent transition peer-checked:border-[#C9A24B] peer-checked:bg-[#C9A24B] peer-checked:text-[#061C2B]">
                                            <Check className="h-3 w-3" />
                                        </span>
                                        <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-[#C9A24B]' : 'text-gray-400'}`} />
                                        <span className={isSelected ? 'font-medium text-[#061C2B]' : 'text-gray-600'}>{amenity === 'All' ? 'All Amenities' : amenity}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Price Range Slider Section */}
                    <div className="mb-6">
                        <div className="mb-3 flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Price Range</h4>
                            <span className="flex items-center text-xs font-medium text-[#C9A24B]"><DollarSign className="h-3 w-3" />{maxPrice}</span>
                        </div>
                        <input
                            type="range"
                            min={minRoomPrice}
                            max={maxRoomPrice}
                            step="20"
                            value={maxPrice}
                            onChange={(event) => setMaxPrice(Number(event.target.value))}
                            className="h-1 w-full accent-[#C9A24B]"
                            aria-label="Maximum price per night"
                        />
                        <div className="mt-1 flex justify-between text-[10px] text-gray-400"><span>${minRoomPrice}</span><span>${maxRoomPrice}+</span></div>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setIsMobileFilterOpen(false);
                            document.getElementById('room-listings')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }}
                        className="w-full rounded-xl border border-[#C9A24B] bg-transparent px-4 py-3 text-xs font-semibold tracking-wide text-[#C9A24B] transition hover:bg-[#C9A24B]/10 focus:outline-none focus:ring-2 focus:ring-[#C9A24B]/40 cursor-pointer"
                    >
                        Apply Filters
                    </button>
                </aside>

                {/* Mobile Filter Backdrop Overlay */}
                {isMobileFilterOpen && (
                    <div
                        onClick={() => setIsMobileFilterOpen(false)}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                        aria-hidden="true"
                    />
                )}

                {/* Right Side: Rooms Grid / List Container */}
                <div id="room-listings" className="lg:col-span-9 w-full">

                    {/* Rooms Listing Header & Sorting Controls */}
                    <div className="mb-8 flex flex-col gap-6 border-b border-[#e5dfd4] pb-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl pt-3">
                            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.25em] text-[#C5A253]">
                                OUR ROOMS &amp; SUITES
                            </span>
                            <h2 className="mb-3 font-serif text-3xl font-medium text-[#061C2B] md:text-4xl">
                                Find Your Perfect Stay
                            </h2>
                            <p className="text-sm font-light leading-relaxed text-gray-500">
                                Thoughtfully designed spaces, inspired by nature, crafted for your comfort. Choose from our curated selection of rooms, suites and private villas.
                            </p>
                        </div>

                        <div className="flex w-full flex-wrap items-center gap-3 lg:w-auto lg:justify-end">
                            {/* Sort Dropdown Selector */}
                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setIsSortOpen(!isSortOpen)}
                                    className="flex items-center gap-2 rounded-lg border border-[#e5dfd4] bg-white px-3 py-2 text-xs font-medium text-[#061C2B] shadow-sm transition hover:border-[#C5A253] cursor-pointer"
                                >
                                    <SlidersHorizontal className="h-3.5 w-3.5 text-[#C5A253]" />
                                    <span>Sort by: {sortBy}</span>
                                    <ChevronDown className={`h-3.5 w-3.5 text-gray-500 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {isSortOpen && (
                                    <div className="absolute right-0 top-full z-30 mt-2 min-w-[190px] rounded-xl border border-[#e5dfd4] bg-white p-1.5 shadow-xl">
                                        {['Popular', 'Price: Low to High', 'Price: High to Low'].map((option) => (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => {
                                                    setSortBy(option);
                                                    setIsSortOpen(false);
                                                }}
                                                className={`block w-full rounded-lg px-3 py-2 text-left text-xs transition cursor-pointer ${sortBy === option ? 'bg-[#063B32] text-white' : 'text-[#061C2B] hover:bg-[#F2EFE9]'}`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* View Mode Switcher (Grid / List view toggle) */}
                            <div className="flex rounded-lg border border-[#e5dfd4] bg-white p-1 shadow-sm">
                                <button
                                    type="button"
                                    onClick={() => setViewMode('grid')}
                                    className={`rounded-md p-1.5 transition cursor-pointer ${viewMode === 'grid' ? 'bg-[#063B32]' : 'bg-transparent'}`}
                                    aria-label="Grid view"
                                >
                                    <LayoutGrid className={`h-4 w-4 ${viewMode === 'grid' ? 'text-[#C9A24B]' : 'text-[#C9A24B]/70'}`} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode('list')}
                                    className={`rounded-md p-1.5 transition cursor-pointer ${viewMode === 'list' ? 'bg-[#063B32]' : 'bg-transparent'}`}
                                    aria-label="List view"
                                >
                                    <List className={`h-4 w-4 ${viewMode === 'list' ? 'text-[#C9A24B]' : 'text-[#C9A24B]/70'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Room Cards Grid or Centered List View */}
                    <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10' : 'max-w-3xl mx-auto grid grid-cols-1 gap-6'}>
                        {sortedRooms.map((room) => {
                            const activeImgIdx = activeImageIndices[room.id] || 0;
                            const currentMainImg = room.images?.[activeImgIdx] || room.images[0];

                            return (
                                <article key={room.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-black/5 flex flex-col justify-between group hover:shadow-md transition duration-300">

                                    <div>
                                        {/* Main Room Image with Video Walkthrough Trigger & Gallery Thumbnails */}
                                        <div className={`relative bg-gray-100 overflow-hidden ${viewMode === 'list' ? 'h-80 md:h-96' : 'h-72'}`}>
                                            <img
                                                src={currentMainImg}
                                                alt={room.title}
                                                className="w-full h-full object-cover transition duration-500"
                                                loading="lazy"
                                            />

                                            {/* Expandable Hover Video Play Button */}
                                            {room.videoUrl && (
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveVideoUrl(room.videoUrl)}
                                                    className="absolute top-4 left-4 group/btn bg-black/50 backdrop-blur-md text-white h-9 px-2.5 rounded-full flex items-center gap-2 overflow-hidden transition-all duration-300 hover:bg-[#C5A253] hover:text-[#061C2B] shadow-lg cursor-pointer z-10"
                                                    aria-label={`Watch video walkthrough for ${room.title}`}
                                                >
                                                    <Play className="w-4 h-4 fill-current flex-shrink-0 ml-0.5" />
                                                    <span className="max-w-0 overflow-hidden whitespace-nowrap text-xs font-medium transition-all duration-300 group-hover/btn:max-w-[100px] group-hover/btn:pr-1">
                                                        Watch Video
                                                    </span>
                                                </button>
                                            )}

                                            {/* Gallery Thumbnails Strip at Bottom of Image */}
                                            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-1.5 overflow-x-auto pb-1 z-10 scrollbar-none">
                                                {room.images?.map((img, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => handleThumbnailClick(room.id, idx)}
                                                        className={`w-12 h-8 rounded overflow-hidden border-2 flex-shrink-0 cursor-pointer transition ${activeImgIdx === idx ? 'border-[#C5A253] scale-105' : 'border-white/60 opacity-80 hover:opacity-100'}`}
                                                        aria-label={`Show image ${idx + 1} for ${room.title}`}
                                                    >
                                                        <img src={img} alt="thumb" className="w-full h-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Room Information & Description */}
                                        <div className="p-5">
                                            <h3 className="font-serif text-xl font-medium mb-1">{room.title}</h3>
                                            <p className="text-xs text-gray-500 font-light mb-1">{room.description}</p>
                                            <button
                                                type="button"
                                                onClick={() => navigate('/checkout', { state: { room } })}
                                                className="text-xs font-medium text-[#C5A253] hover:text-[#b49147] transition cursor-pointer"
                                            >
                                                Read More <span aria-hidden="true">→</span>
                                            </button>

                                            {/* Room Specifications with Icons */}
                                            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mb-4 font-light pt-3 border-t border-gray-100">
                                                <span className="flex items-center gap-1.5">
                                                    <Bed className="w-3.5 h-3.5 text-[#C5A253]" /> {room.bed}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Users className="w-3.5 h-3.5 text-[#C5A253]" /> {room.guests}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Maximize2 className="w-3.5 h-3.5 text-[#C5A253]" /> {room.size}
                                                </span>
                                            </div>

                                            {/* Room Amenities Badges with Icons */}
                                            <div className="flex flex-wrap gap-2 mb-2">
                                                {room.amenities?.map((amenity, index) => {
                                                    const AmenityIcon = amenityIcons[amenity] || Sparkles;
                                                    return (
                                                        <span key={index} className="inline-flex items-center gap-1.5 text-[10px] bg-[#F8F5F0] text-gray-700 px-2.5 py-1 rounded-md border border-gray-200/60 font-light">
                                                            <AmenityIcon className="h-3 w-3 text-[#C5A253]" aria-hidden="true" />
                                                            {amenity}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pricing and Booking Action Footer */}
                                    <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex justify-between items-center bg-white">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-xs text-gray-400 font-light">From</span>
                                            <span className="font-serif text-xl font-bold text-[#061C2B] mx-1">{room.price}</span>
                                            <span className="text-xs text-gray-400 font-light">per night</span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => navigate('/checkout', { state: { room } })}
                                            className="bg-[#C5A253] text-[#061C2B] px-5 py-2.5 rounded-xl text-xs font-medium hover:bg-[#b49147] transition flex items-center gap-2 shadow-sm cursor-pointer"
                                        >
                                            Book Now <ArrowRight className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                </article>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Video Walkthrough Modal Popup */}
            {activeVideoUrl && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                        <button
                            type="button"
                            onClick={() => setActiveVideoUrl(null)}
                            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-white hover:text-black transition cursor-pointer"
                            aria-label="Close video modal"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="relative pt-[56.25%]">
                            <video
                                src={activeVideoUrl}
                                controls
                                autoPlay
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Rooms Banner Component - Positioned directly above the footer */}
            <RoomsBanner />

        </div>
    );
}