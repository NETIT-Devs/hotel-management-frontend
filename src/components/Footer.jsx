import React from 'react';
import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaYoutube, FaXTwitter } from 'react-icons/fa6';
import logoImg from '../assets/logo.png'; // Monogram Logo Asset

/**
 * Footer Component
 * Fully functional with official React Icons (FontAwesome 6), SEO tags, and Responsive Layout
 */
export default function Footer() {
    return (
        <footer id="contact" className="bg-[#061C2B] text-white pt-16 pb-8 border-t border-white/10 relative overflow-hidden">

            {/* Top Main Footer Layout Grid */}
            <div className="max-w-[1500px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">

                {/* Column 1: Brand Info & Monogram (Span 3) */}
                <div className="lg:col-span-3 flex flex-col justify-start">
                    <a href="/" className="flex items-center gap-4 mb-3 group focus:outline-none" aria-label="Serenity Bay Homepage">
                        <img
                            src={logoImg}
                            alt="Serenity Bay Logo Monogram"
                            className="h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                        />
                        <div className="flex flex-col">
                            <span className="font-serif tracking-[0.2em] font-bold text-xl text-[#b8972e] leading-none">
                                SERENITY BAY
                            </span>
                            <span className="text-[10px] tracking-[0.3em] text-white uppercase font-light mt-1">
                                HOTEL & RESORT
                            </span>
                        </div>
                    </a>

                    {/* Brand Tagline */}
                    <div className="mt-2 pl-1">
                        <div className="w-12 h-[1px] bg-[#b8972e]/40 mb-3"></div>
                        <p className="text-[11px] tracking-[0.35em] text-[#b8972e] uppercase font-light">
                            MORE THAN A STAY
                        </p>
                    </div>
                </div>

                {/* Column 2: Dual-Column Quick Links (Span 3) */}
                <div className="lg:col-span-3">
                    <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#b8972e] mb-6">
                        QUICK LINKS
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-300 font-light">
                        <ul className="space-y-3">
                            <li><a href="#home" className="hover:text-[#b8972e] transition duration-300">Home</a></li>
                            <li><a href="#rooms" className="hover:text-[#b8972e] transition duration-300">Rooms & Suites</a></li>
                            <li><a href="#facilities" className="hover:text-[#b8972e] transition duration-300">Facilities</a></li>
                            <li><a href="#offers" className="hover:text-[#b8972e] transition duration-300">Offers</a></li>
                        </ul>
                        <ul className="space-y-3">
                            <li><a href="#about" className="hover:text-[#b8972e] transition duration-300">About Us</a></li>
                            <li><a href="#gallery" className="hover:text-[#b8972e] transition duration-300">Gallery</a></li>
                            <li><a href="#contact" className="hover:text-[#b8972e] transition duration-300">Contact</a></li>
                            <li><a href="#faqs" className="hover:text-[#b8972e] transition duration-300">FAQs</a></li>
                        </ul>
                    </div>
                </div>

                {/* Column 3: Contact Info & Social Icons (Span 3) */}
                <div className="lg:col-span-3">
                    <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#b8972e] mb-6">
                        CONTACT US
                    </h3>
                    <ul className="space-y-3.5 text-sm text-gray-300 font-light mb-6">
                        <li className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-[#b8972e] shrink-0 mt-0.5" />
                            <span>Beach Road, Mirissa, Sri Lanka</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-[#b8972e] shrink-0" />
                            <a href="tel:+94112345678" className="hover:text-[#b8972e] transition duration-300">+94 11 234 5678</a>
                        </li>
                        <li className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-[#b8972e] shrink-0" />
                            <a href="mailto:info@serenitybay.com" className="hover:text-[#b8972e] transition duration-300">info@serenitybay.com</a>
                        </li>
                    </ul>

                    {/* Real Social Media Circular Buttons */}
                    <div className="flex items-center gap-3">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-[#b8972e] text-black flex items-center justify-center hover:bg-[#a68525] transition duration-300 shadow-md cursor-pointer"
                            aria-label="Visit our Facebook page"
                        >
                            <FaFacebookF className="w-3.5 h-3.5" />
                        </a>
                        <a
                            href="https://instagram.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-[#b8972e] text-black flex items-center justify-center hover:bg-[#a68525] transition duration-300 shadow-md cursor-pointer"
                            aria-label="Visit our Instagram profile"
                        >
                            <FaInstagram className="w-4 h-4" />
                        </a>
                        <a
                            href="https://youtube.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-[#b8972e] text-black flex items-center justify-center hover:bg-[#a68525] transition duration-300 shadow-md cursor-pointer"
                            aria-label="Visit our YouTube channel"
                        >
                            <FaYoutube className="w-4 h-4" />
                        </a>
                        <a
                            href="https://x.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-8 h-8 rounded-full bg-[#b8972e] text-black flex items-center justify-center hover:bg-[#a68525] transition duration-300 shadow-md cursor-pointer"
                            aria-label="Visit our X (Twitter) profile"
                        >
                            <FaXTwitter className="w-3.5 h-3.5" />
                        </a>
                    </div>
                </div>

                {/* Column 4: Newsletter Subscription Form (Span 3) */}
                <div className="lg:col-span-3">
                    <h3 className="text-xs uppercase tracking-[0.25em] font-semibold text-[#b8972e] mb-3">
                        JOIN OUR NEWSLETTER
                    </h3>
                    <p className="text-xs text-gray-400 font-light mb-5">
                        Get exclusive offers and travel inspiration.
                    </p>
                    <form onSubmit={(e) => e.preventDefault()} className="flex items-center w-full">
                        <input
                            type="email"
                            placeholder="Your email address"
                            required
                            aria-label="Email address for newsletter"
                            className="w-full bg-[#fcfbfa] text-black placeholder-gray-500 text-xs px-4 py-3 rounded-l-lg focus:outline-none"
                        />
                        <button
                            type="submit"
                            aria-label="Subscribe to newsletter"
                            className="bg-[#b8972e] text-black px-4 py-3 rounded-r-lg hover:bg-[#a68525] transition duration-300 flex items-center justify-center shrink-0 cursor-pointer"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>
                </div>

            </div>

            {/* Bottom Bar: Legal Policies */}
            <div className="max-w-[1500px] mx-auto px-6 md:px-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-400 font-light">
                <p>© {new Date().getFullYear()} Serenity Bay Hotel & Resort. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <a href="#privacy" className="hover:text-[#b8972e] transition duration-300">Privacy Policy</a>
                    <span className="text-white/20">|</span>
                    <a href="#terms" className="hover:text-[#b8972e] transition duration-300">Terms & Conditions</a>
                    <span className="text-white/20">|</span>
                    <a href="#cancellation" className="hover:text-[#b8972e] transition duration-300">Cancellation Policy</a>
                </div>
            </div>

        </footer>
    );
}