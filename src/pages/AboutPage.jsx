import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Compass, Heart, ShieldCheck, ArrowRight, Utensils, Waves, Bed, Users } from 'lucide-react';
import logoImg from '../assets/logo.png';
import hotelLobbyImg from '../assets/hotelLobbyImg.webp';
import resortPoolImg from '../assets/hotelLobbyImg.webp'; // Replace with resortPoolImg.webp if available
import fineDiningImg from '../assets/hotelLobbyImg.webp'; // Replace with fineDiningImg.webp if available
import spaWellnessImg from '../assets/hotelLobbyImg.webp'; // Replace with spaWellnessImg.webp if available

export default function AboutPage() {
    const navigate = useNavigate();

    // SEO Optimization and Auto Scroll to Top
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.title = 'About Us | Serenity Bay Hotel & Resort';

        let metaTag = document.querySelector("meta[name='description']");
        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.name = 'description';
            document.head.appendChild(metaTag);
        }
        metaTag.content = 'Discover the luxury, elegance, and tranquil hospitality of Serenity Bay Hotel & Resort. Where world-class comfort meets natural beauty.';
    }, []);

    return (
        <div className="min-h-screen bg-[#F7F3E8] text-[#061C2B] font-sans selection:bg-[#C9A24B] selection:text-[#061C2B]">

            {/* 1. Hero Section */}
            <section className="relative h-[70vh] sm:h-[80vh] flex items-center justify-center text-center px-4 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center z-0 transform scale-105 transition-transform duration-1000"
                    style={{
                        backgroundImage: `linear-gradient(130deg, rgba(6, 28, 43, 0.75), rgba(6, 59, 50, 0.85)), url(${hotelLobbyImg})`
                    }}
                ></div>
                <div className="absolute inset-0 bg-black/20 z-1"></div>

                <div className="relative z-10 max-w-4xl mx-auto space-y-4 pt-16">
                    <div className="flex justify-center mb-2">
                        <img src={logoImg} alt="Serenity Bay Logo" className="h-12 w-auto object-contain drop-shadow-md" />
                    </div>
                    <span className="font-serif text-xs tracking-[0.4em] text-[#C9A24B] font-bold uppercase block">
                        Serenity Bay Hotel &amp; Resort
                    </span>
                    <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-white tracking-tight">
                        Discover <span className="italic text-[#C9A24B]">Serenity</span>
                    </h1>
                    <p className="font-serif text-base sm:text-xl text-gray-200 font-light max-w-2xl mx-auto tracking-wide">
                        Where Luxury Meets Tranquility.
                    </p>
                </div>
            </section>

            {/* 2. Our Story Section */}
            <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

                    <div className="lg:col-span-6 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#063B32]/10 text-[#063B32] text-xs font-bold tracking-wider uppercase">
                            <Compass className="w-3.5 h-3.5 text-[#C9A24B]" /> Our Story
                        </div>
                        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#063B32] leading-tight">
                            Crafted for the Discerning Traveler
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
                            Nestled along breathtaking coastal landscapes, Serenity Bay Hotel &amp; Resort was born from a singular vision: to create an uncompromised sanctuary of refined luxury and effortless comfort. Our hospitality concept is rooted in personalized attention, ensuring every guest feels not just accommodated, but truly cherished.
                        </p>
                        <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
                            From architectural harmony with nature to intuitive 24/7 concierge services, we curate bespoke experiences that transform ordinary stays into timeless memories.
                        </p>
                    </div>

                    <div className="lg:col-span-6 relative">
                        <div className="absolute -inset-4 bg-[#C9A24B]/20 rounded-3xl transform rotate-1 blur-sm"></div>
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white">
                            <img
                                src={resortPoolImg}
                                alt="Serenity Bay Resort Exterior"
                                className="w-full h-[400px] sm:h-[480px] object-cover hover:scale-105 transition duration-700"
                            />
                        </div>
                    </div>

                </div>
            </section>

            {/* 3. Our Philosophy Section */}
            <section className="bg-[#063B32] text-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#C9A24B]/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                        <span className="font-serif text-xs tracking-[0.3em] text-[#C9A24B] font-bold uppercase">
                            Our Core Principles
                        </span>
                        <h2 className="font-serif text-3xl sm:text-4xl font-normal text-white">
                            Our Philosophy
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-300 font-light">
                            Guided by excellence, integrity, and a profound respect for personal relaxation.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                        {/* Card 1: Our Mission */}
                        <div className="bg-[#061C2B]/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-[#C9A24B]/30 shadow-2xl flex flex-col justify-between hover:border-[#C9A24B] transition duration-300">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-[#C9A24B]/20 flex items-center justify-center text-[#C9A24B] mb-6">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-3 text-white">
                                    Our Mission
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                                    To provide an immaculate sanctuary where exceptional hospitality, world-class amenities, and tranquil environments converge to deliver unmatched guest satisfaction.
                                </p>
                            </div>
                            <div className="mt-8 pt-4 border-t border-[#C9A24B]/20 text-[10px] tracking-widest uppercase text-[#C9A24B] font-bold">
                                Excellence in Stay
                            </div>
                        </div>

                        {/* Card 2: Our Vision */}
                        <div className="bg-[#061C2B]/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-[#C9A24B]/30 shadow-2xl flex flex-col justify-between hover:border-[#C9A24B] transition duration-300">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-[#C9A24B]/20 flex items-center justify-center text-[#C9A24B] mb-6">
                                    <Compass className="w-6 h-6" />
                                </div>
                                <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-3 text-white">
                                    Our Vision
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                                    To be globally recognized as the premier destination for discerning travelers seeking authentic luxury, serene seclusion, and impeccable personal service.
                                </p>
                            </div>
                            <div className="mt-8 pt-4 border-t border-[#C9A24B]/20 text-[10px] tracking-widest uppercase text-[#C9A24B] font-bold">
                                Unrivaled Standard
                            </div>
                        </div>

                        {/* Card 3: Our Values */}
                        <div className="bg-[#061C2B]/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-[#C9A24B]/30 shadow-2xl flex flex-col justify-between hover:border-[#C9A24B] transition duration-300">
                            <div>
                                <div className="w-12 h-12 rounded-2xl bg-[#C9A24B]/20 flex items-center justify-center text-[#C9A24B] mb-6">
                                    <Heart className="w-6 h-6" />
                                </div>
                                <h3 className="font-serif text-xl sm:text-2xl font-semibold mb-3 text-white">
                                    Our Values
                                </h3>
                                <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed">
                                    Steeped in grace, sustainability, and absolute discretion. We value authentic connections, meticulous attention to detail, and creating joyful moments for every visitor.
                                </p>
                            </div>
                            <div className="mt-8 pt-4 border-t border-[#C9A24B]/20 text-[10px] tracking-widest uppercase text-[#C9A24B] font-bold">
                                Grace &amp; Integrity
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 4. The Serenity Experience Section */}
            <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
                    <span className="font-serif text-xs tracking-[0.3em] text-[#C9A24B] font-bold uppercase">
                        Immersive Pleasures
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#063B32]">
                        The Serenity Experience
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-500 font-light">
                        Every facet of your stay is thoughtfully curated to indulge your senses.
                    </p>
                </div>

                <div className="space-y-16">

                    {/* Item 1: Luxury Accommodation */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-6 rounded-3xl overflow-hidden shadow-xl border border-gray-200">
                            <img src={hotelLobbyImg} alt="Luxury Accommodation" className="w-full h-[320px] object-cover hover:scale-105 transition duration-700" />
                        </div>
                        <div className="lg:col-span-6 space-y-4 lg:pl-6">
                            <div className="w-10 h-10 rounded-xl bg-[#C9A24B]/20 flex items-center justify-center text-[#C9A24B]">
                                <Bed className="w-5 h-5" />
                            </div>
                            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#063B32]">
                                Luxury Accommodation
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                                Experience suites and private villas designed with exquisite aesthetics, panoramic ocean views, plush king-sized bedding, and state-of-the-art modern comforts.
                            </p>
                        </div>
                    </div>

                    {/* Item 2: Fine Dining */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-6 order-2 lg:order-1 space-y-4 lg:pr-6">
                            <div className="w-10 h-10 rounded-xl bg-[#C9A24B]/20 flex items-center justify-center text-[#C9A24B]">
                                <Utensils className="w-5 h-5" />
                            </div>
                            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#063B32]">
                                Fine Dining
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                                Savor culinary masterpieces crafted by world-class chefs. From fresh ocean catches to organic garden harvests, our dining venues offer an unforgettable gastronomic journey.
                            </p>
                        </div>
                        <div className="lg:col-span-6 order-1 lg:order-2 rounded-3xl overflow-hidden shadow-xl border border-gray-200">
                            <img src={fineDiningImg} alt="Fine Dining" className="w-full h-[320px] object-cover hover:scale-105 transition duration-700" />
                        </div>
                    </div>

                    {/* Item 3: Wellness & Spa */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-6 rounded-3xl overflow-hidden shadow-xl border border-gray-200">
                            <img src={spaWellnessImg} alt="Wellness & Spa" className="w-full h-[320px] object-cover hover:scale-105 transition duration-700" />
                        </div>
                        <div className="lg:col-span-6 space-y-4 lg:pl-6">
                            <div className="w-10 h-10 rounded-xl bg-[#C9A24B]/20 flex items-center justify-center text-[#C9A24B]">
                                <Waves className="w-5 h-5" />
                            </div>
                            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#063B32]">
                                Wellness &amp; Spa
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                                Rejuvenate your body and mind at our holistic sanctuary. Enjoy traditional Ayurveda therapies, soothing massages, and serene meditation spaces overlooking the sea.
                            </p>
                        </div>
                    </div>

                    {/* Item 4: Exceptional Hospitality */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-6 order-2 lg:order-1 space-y-4 lg:pr-6">
                            <div className="w-10 h-10 rounded-xl bg-[#C9A24B]/20 flex items-center justify-center text-[#C9A24B]">
                                <Users className="w-5 h-5" />
                            </div>
                            <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-[#063B32]">
                                Exceptional Hospitality
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                                Our dedicated team of professionals anticipates your every need with genuine warmth and discretion, ensuring your time with us is completely effortless.
                            </p>
                        </div>
                        <div className="lg:col-span-6 order-1 lg:order-2 rounded-3xl overflow-hidden shadow-xl border border-gray-200">
                            <img src={hotelLobbyImg} alt="Exceptional Hospitality" className="w-full h-[320px] object-cover hover:scale-105 transition duration-700" />
                        </div>
                    </div>

                </div>
            </section>

            {/* 5. Closing CTA Section */}
            <section className="bg-[#061C2B] text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,162,75,0.15)_0,transparent_70%)] pointer-events-none"></div>

                <div className="max-w-3xl mx-auto relative z-10 space-y-6">
                    <span className="font-serif text-xs tracking-[0.4em] text-[#C9A24B] font-bold uppercase block">
                        Begin Your Escape
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-tight">
                        Your Journey to Serenity Begins Here
                    </h2>
                    <p className="text-xs sm:text-sm text-gray-300 font-light max-w-xl mx-auto">
                        Allow us to welcome you to a world of uncompromising luxury and peaceful coastal elegance.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link
                            to="/rooms"
                            className="w-full sm:w-auto bg-gradient-to-r from-[#C9A24B] via-[#D4AF37] to-[#C9A24B] text-[#061C2B] px-8 py-4 rounded-xl text-xs font-bold tracking-widest uppercase hover:opacity-95 transition shadow-lg flex items-center justify-center gap-2"
                        >
                            <span>Explore Rooms</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/"
                            className="w-full sm:w-auto bg-transparent border-2 border-[#C9A24B] text-[#C9A24B] hover:bg-[#C9A24B]/10 px-8 py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase transition flex items-center justify-center gap-2"
                        >
                            <span>Book Your Stay</span>
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    );
}