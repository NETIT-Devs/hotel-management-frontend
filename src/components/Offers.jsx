import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { OFFERS_DATA } from '../constants/hotelData';

export default function Offers() {
    const navigate = useNavigate();

    // Automatically slice the array to display only the first 3 offers on the home page
    const displayedOffers = OFFERS_DATA.slice(0, 3);

    return (
        // Special Offers & Promotional Packages Section with side-aligned header
        <section id="offers" className="bg-[#F2EFE9] py-20 px-6 md:px-12 text-black" aria-label="Special Offers Section">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                {/* Left Side: Title, Description & View All Offers Button */}
                <div className="lg:col-span-3 pt-4">
                    <span className="text-[#b8972e] tracking-[0.2em] uppercase text-[11px] font-bold block mb-2">
                        LIMITED TIME
                    </span>
                    <h2 className="font-serif text-3xl lg:text-4xl font-normal leading-tight mb-4">
                        Special Offers
                    </h2>
                    <p className="text-gray-600 text-xs font-light leading-relaxed mb-6">
                        Make your stay even more memorable with our exclusive packages and seasonal offers.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            navigate('/offers');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-[#b8972e] text-black px-5 py-3 rounded-xl text-xs font-medium hover:bg-[#a68525] transition duration-300 flex items-center gap-2 shadow-sm cursor-pointer"
                        aria-label="View all hotel offers"
                    >
                        <span>View All Offers</span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                    </button>
                </div>

                {/* Right Side: 3 Offer Cards Grid matching Rooms section style */}
                <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {displayedOffers.map((offer) => {
                        const displayImage = (offer.images && offer.images[0]) || offer.image || '';
                        const displayTag = offer.category || offer.tag || '';
                        const displayDesc = offer.description || offer.desc || '';
                        const displayPrice = offer.discountedPrice || offer.price || '';

                        return (
                            <article
                                key={offer.id}
                                onClick={() => {
                                    navigate(`/offers/${offer.id}`);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                onKeyDown={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        navigate(`/offers/${offer.id}`);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                }}
                                role="link"
                                tabIndex={0}
                                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-black/5 hover:shadow-xl hover:border-[#b8972e]/50 transition-all duration-500 group flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#b8972e]"
                                aria-label={`View details for ${offer.title}`}
                            >
                                <div>
                                    {/* Offer Image Container with Category Tag */}
                                    <div className="h-52 overflow-hidden relative">
                                        {displayTag && (
                                            <span className="absolute top-3 right-3 bg-[#063B32]/90 backdrop-blur-md text-[#b8972e] border border-[#b8972e]/40 text-[9px] font-bold px-3 py-1 rounded-full z-10 shadow-md uppercase tracking-widest">
                                                {displayTag}
                                            </span>
                                        )}
                                        {offer.discount && (
                                            <span className="absolute top-3 left-3 bg-[#b8972e] text-[#063B32] text-[9px] font-extrabold px-2.5 py-1 rounded-full z-10 shadow-md uppercase tracking-wider">
                                                {offer.discount}
                                            </span>
                                        )}
                                        <img
                                            src={displayImage}
                                            alt={offer.title}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                                        />
                                    </div>

                                    {/* Offer Details */}
                                    <div className="p-5 pb-3">
                                        <h3 className="font-serif text-lg font-medium mb-2 group-hover:text-[#b8972e] transition-colors line-clamp-1">{offer.title}</h3>
                                        <p className="text-xs text-gray-500 font-light leading-relaxed line-clamp-2">{displayDesc}</p>
                                    </div>
                                </div>

                                {/* Price & Clean Action Arrow Section */}
                                <div className="p-5 pt-2">
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-200/60">
                                        {/* Price Display */}
                                        <div className="flex items-baseline gap-1.5">
                                            <span className="text-xs text-gray-500 font-light">From</span>
                                            <span className="font-serif text-xl font-bold text-black mx-1">
                                                {displayPrice}
                                            </span>
                                            <span className="text-xs text-gray-500 font-light">/ night</span>
                                        </div>

                                        {/* Circle Arrow Button */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/offers/${offer.id}`);
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className="w-8 h-8 rounded-full bg-[#b8972e] text-black flex items-center justify-center hover:bg-[#a68525] transition duration-300 shadow-sm cursor-pointer"
                                            aria-label={`View ${offer.title}`}
                                        >
                                            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                                        </button>
                                    </div>
                                </div>

                            </article>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}