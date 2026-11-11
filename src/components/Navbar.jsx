import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, Menu, X, User, LogIn } from 'lucide-react';
import { NAV_LINKS } from '../constants/hotelData';
import logoImg from '../assets/logo.png'; // Monogram Logo Asset

/**
 * Navbar Component
 * Features:
 * - Dynamic sticky scroll styling with glassmorphism
 * - Full-screen responsive mobile overlay navigation drawer
 * - Complete accessibility (aria-attributes) & SEO structure
 * - Dynamic Sign-In / Account Authentication Routing
 * - Smart URL routing for Home (/), Rooms (/rooms), and Offers (/offers) pages
 */
export default function Navbar() {
    // Mobile navigation state toggle
    const [isOpen, setIsOpen] = useState(false);

    // Scroll state for sticky header background transition
    const [isScrolled, setIsScrolled] = useState(false);

    // User authentication state checked from localStorage
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Retrieve stored authentication session data
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user session", e);
            }
        }
    }, []);

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

                {/* Brand Logo & Typography Header Link with Smooth Scroll to Top */}
                <Link
                    to="/"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
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
                </Link>

                {/* Desktop Navigation Link Items with Smooth Scroll to Top */}
                <div className="hidden lg:flex items-center gap-8 text-sm font-light text-white">
                    {NAV_LINKS.map((link, idx) => {
                        // Intelligent path assignment for router navigation
                        let linkHref = link.href || "/";
                        if (link.label === "Home") {
                            linkHref = "/";
                        } else if (link.label === "Rooms & Suites") {
                            linkHref = "/rooms";
                        } else if (link.label === "Offers") {
                            linkHref = "/offers";
                        }

                        return (
                            <Link
                                key={idx}
                                to={linkHref}
                                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                className="hover:text-[#b8972e] transition duration-300 tracking-wide font-normal"
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Header Actions (Search Modal, Sign-In Auth Trigger & Primary CTA Button) */}
                <div className="flex items-center gap-4 text-white">
                    <button
                        type="button"
                        aria-label="Search site"
                        className="p-1 hover:text-[#b8972e] transition duration-300 focus:outline-none cursor-pointer"
                    >
                        <Search className="w-5 h-5" />
                    </button>

                    {/* Authentication Sign In / Account Link for Desktop */}
                    {user ? (
                        <Link
                            to="/account"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#b8972e] bg-[#061C2B]/80 hover:bg-[#061C2B] px-4 py-2.5 rounded-lg transition border border-[#b8972e]/50 shadow-md focus:outline-none"
                            aria-label={`Logged in as ${user.full_name || 'User'}`}
                        >
                            <User className="w-4 h-4 text-[#b8972e]" />
                            <span className="truncate max-w-[120px]">{user.full_name || 'Account'}</span>
                        </Link>
                    ) : (
                        <Link
                            to="/auth"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="hidden sm:flex items-center gap-2 text-xs font-bold text-white hover:text-[#b8972e] px-4 py-2.5 rounded-lg transition border border-white/30 hover:border-[#b8972e] bg-white/5 backdrop-blur-sm shadow-md focus:outline-none cursor-pointer"
                            aria-label="Sign In or Create Account"
                        >
                            <LogIn className="w-4 h-4 text-[#b8972e]" />
                            <span>Sign In</span>
                        </Link>
                    )}

                    <Link
                        to="/rooms"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="hidden sm:flex bg-[#b8972e] text-black px-6 py-2.5 rounded text-sm font-semibold items-center gap-2 hover:bg-[#a68525] transition shadow-lg cursor-pointer"
                    >
                        <Calendar className="w-4 h-4" /> Book Now
                    </Link>

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

                {/* Mobile Navigation Links with Smooth Scroll to Top */}
                <div className="flex flex-col gap-6 text-center">
                    {NAV_LINKS.map((link, idx) => {
                        let mobileLinkHref = link.href || "/";
                        if (link.label === "Home") {
                            mobileLinkHref = "/";
                        } else if (link.label === "Rooms & Suites") {
                            mobileLinkHref = "/rooms";
                        } else if (link.label === "Offers") {
                            mobileLinkHref = "/offers";
                        }

                        return (
                            <Link
                                key={idx}
                                to={mobileLinkHref}
                                onClick={() => {
                                    setIsOpen(false);
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="text-lg font-serif tracking-wider text-white hover:text-[#b8972e] transition duration-300 border-b border-white/10 pb-3"
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile Actions: Sign In Link & Booking CTA */}
                <div className="w-full mt-auto pt-6 flex flex-col gap-3">
                    {/* Sign In / Account Action for Mobile Overlay */}
                    {user ? (
                        <Link
                            to="/account"
                            onClick={() => {
                                setIsOpen(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full bg-white/10 border border-[#b8972e]/50 text-[#b8972e] py-3.5 rounded-xl text-base font-medium flex items-center justify-center gap-2 shadow-md hover:bg-white/15 transition cursor-pointer"
                        >
                            <User className="w-5 h-5 text-[#b8972e]" />
                            <span>My Account ({user.full_name || 'User'})</span>
                        </Link>
                    ) : (
                        <Link
                            to="/auth"
                            onClick={() => {
                                setIsOpen(false);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="w-full bg-white/10 border border-white/20 text-white py-3.5 rounded-xl text-base font-medium flex items-center justify-center gap-2 shadow-md hover:border-[#b8972e] hover:text-[#b8972e] transition cursor-pointer"
                        >
                            <LogIn className="w-5 h-5 text-[#b8972e]" />
                            <span>Sign In / Register</span>
                        </Link>
                    )}

                    {/* Primary Booking CTA Button */}
                    <Link
                        to="/rooms"
                        onClick={() => {
                            setIsOpen(false);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="w-full bg-[#b8972e] text-black py-4 rounded-xl text-base font-medium flex items-center justify-center gap-2 shadow-xl hover:bg-[#a68525] transition cursor-pointer"
                    >
                        <Calendar className="w-5 h-5" /> Book Your Stay
                    </Link>
                </div>
            </div>
        </nav>
    );
}