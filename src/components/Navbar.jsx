import React, { useState, useEffect } from 'react';
import { Search, Calendar, Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../constants/hotelData';
import logoImg from '../assets/logo.png'; // Monogram Logo Asset

/**
 * Navbar Component
 * Features:
 * - Dynamic sticky scroll styling with glassmorphism
 * - Full-screen responsive mobile overlay navigation drawer
 * - Complete accessibility (aria-attributes) & SEO structure
 * - Smart URL routing for Home (/) and Rooms (/rooms) pages
 */
export default function Navbar() {
    // Mobile navigation state toggle
    const [isOpen, setIsOpen] = useState(false);

    // Scroll state for sticky header background transition
    const [isScrolled, setIsScrolled] = useState(false);

    // Event listener to monitor window scroll position
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent background page scroll when mobile overlay menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out px-6 md:px-12 ${isScrolled
                ? 'bg-[#061C2B]/95 backdrop-blur-md py-3 shadow-xl border-b border-white/10'
                : 'bg-gradient-to-b from-[#061C2B]/90 via-[#061C2B]/40 to-transparent py-5'
                }`}
            aria-label="Main Navigation"
        >
            <div className="max-w-[1500px] mx-auto flex justify-between items-center z-50 relative">

                {/* Brand Logo & Typography Header Link */}
                <a
                    href="/"
                    className="flex items-center gap-3 md:gap-4 group focus:outline-none"
                    aria-label="Serenity Bay Hotel & Resort - Homepage"
                >
                    {/* Brand Golden Logo Monogram */}
                    <img
                        src={logoImg}
                        alt="Serenity Bay Logo Icon"
                        loading="eager"
                        className={`w-auto object-contain transition-all duration-300 group-hover:scale-105 ${isScrolled ? 'h-10 md:h-12' : 'h-14 md:h-16'
                            }`}
                    />

                    {/* Brand Name Typography */}
                    <div className="flex flex-col">
                        <span className="font-serif tracking-[0.2em] font-bold text-lg md:text-xl text-[#b8972e] leading-none">
                            SERENITY BAY
                        </span>
                        <span className="text-[9px] md:text-[10px] tracking-[0.3em] text-white uppercase font-light mt-1">
                            HOTEL &amp; RESORT
                        </span>
                    </div>
                </a>

                {/* Desktop Navigation Link Items */}
                <div className="hidden lg:flex items-center gap-8 text-sm font-light text-white">
                    {NAV_LINKS.map((link, idx) => {
                        // Route Home to '/' and Rooms & Suites to '/rooms'
                        let linkHref = link.href;
                        if (link.label === "Home") {
                            linkHref = "/";
                        } else if (link.label === "Rooms & Suites") {
                            linkHref = "/rooms";
                        }

                        return (
                            <a
                                key={idx}
                                href={linkHref}
                                className="hover:text-[#b8972e] transition duration-300 tracking-wide font-normal"
                            >
                                {link.label}
                            </a>
                        );
                    })}
                </div>

                {/* Header Actions (Search Modal Trigger & Primary CTA Button) */}
                <div className="flex items-center gap-4 text-white">
                    <button
                        type="button"
                        aria-label="Search site"
                        className="p-1 hover:text-[#b8972e] transition duration-300 focus:outline-none cursor-pointer"
                    >
                        <Search className="w-5 h-5" />
                    </button>

                    <button
                        type="button"
                        className="hidden sm:flex bg-[#b8972e] text-black px-6 py-2.5 rounded text-sm font-semibold items-center gap-2 hover:bg-[#a68525] transition shadow-lg cursor-pointer"
                    >
                        <Calendar className="w-4 h-4" /> Book Now
                    </button>

                    {/* Mobile Navigation Drawer Toggle Icon */}
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="lg:hidden text-white focus:outline-none p-1 cursor-pointer z-50 relative"
                        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <X className="w-7 h-7 text-[#b8972e]" /> : <Menu className="w-7 h-7" />}
                    </button>
                </div>

            </div>

            {/* Mobile Navigation Full-Screen Glassmorphism Overlay */}
            <div
                className={`fixed inset-0 w-full h-screen bg-[#061C2B]/95 backdrop-blur-xl z-40 lg:hidden flex flex-col justify-between p-8 pt-28 transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 visible pointer-events-auto' : 'opacity-0 invisible pointer-events-none'
                    }`}
            >

                {/* Mobile Navigation Links */}
                <div className="flex flex-col gap-6 text-center">
                    {NAV_LINKS.map((link, idx) => {
                        let mobileLinkHref = link.href;
                        if (link.label === "Home") {
                            mobileLinkHref = "/";
                        } else if (link.label === "Rooms & Suites") {
                            mobileLinkHref = "/rooms";
                        }

                        return (
                            <a
                                key={idx}
                                href={mobileLinkHref}
                                onClick={() => setIsOpen(false)}
                                className="text-lg font-serif tracking-wider text-white hover:text-[#b8972e] transition duration-300 border-b border-white/10 pb-3"
                            >
                                {link.label}
                            </a>
                        );
                    })}
                </div>

                {/* Mobile Booking CTA Action */}
                <div className="w-full mt-auto pt-6">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="w-full bg-[#b8972e] text-black py-4 rounded-xl text-base font-medium flex items-center justify-center gap-2 shadow-xl hover:bg-[#a68525] transition cursor-pointer"
                    >
                        <Calendar className="w-5 h-5" /> Book Your Stay
                    </button>
                </div>
            </div>
        </nav>
    );
}