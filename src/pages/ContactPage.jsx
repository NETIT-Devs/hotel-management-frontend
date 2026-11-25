import React, { useEffect, useState } from 'react';
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    CheckCircle2,
    Copy,
    Check,
    ExternalLink,
    Plane,
    Compass,
    Train,
    Sparkles,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa6';
import hotelLobbyImg from '../assets/hotelLobbyImg.webp'; // Swap this import if you want a different hero image

// Configurable WhatsApp concierge number (digits only, international format without '+')
const WHATSAPP_NUMBER = import.meta.env.VITE_HOTEL_WHATSAPP || '94771234567';

// Available inquiry categories for the concierge routing dropdown
const INQUIRY_TYPES = [
    'Room Reservation',
    'Special Event / Wedding',
    'Airport Transfer',
    'General Feedback',
];

/**
 * ContactPage Component
 * Editorial & Concierge-style Contact Us page for Serenity Bay Hotel & Resort.
 * Features:
 * - Minimalist luxury hero banner (no booking bar clutter)
 * - Direct concierge & reservations contact cards with check-in/out times
 * - Smart WhatsApp inquiry form with conditional fields and popup-blocker fallback
 * - Interactive Google Maps embed with Mirissa arrival guide
 * - Full mobile responsiveness, semantic HTML, and dynamic SEO metadata
 */
export default function ContactPage() {
    // Form state for guest inquiry details
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        inquiryType: 'Room Reservation',
        preferredCheckIn: '',
        preferredCheckOut: '',
        guests: '2 Adults',
        arrivalDate: '',
        flightNumber: '',
        eventDate: '',
        estimatedGuests: '',
        message: '',
    });

    // UI states for validation errors, submission confirmation, and clipboard copy
    const [errors, setErrors] = useState({});
    const [submittedPayload, setSubmittedPayload] = useState(null);
    const [copied, setCopied] = useState(false);

    // SEO metadata setup and smooth scroll to top on mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.title = 'Contact & Concierge | Serenity Bay Hotel & Resort';

        let metaDescription = document.querySelector("meta[name='description']");
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = 'description';
            document.head.appendChild(metaDescription);
        }
        metaDescription.content =
            'Reach Serenity Bay Hotel & Resort in Mirissa, Sri Lanka. Contact our 24/7 Reservations Desk, WhatsApp Concierge, or plan your airport transfer and private events.';
    }, []);

    // Pre-fill guest details automatically if the user is already signed in
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) return;

        try {
            const parsed = JSON.parse(storedUser);
            setFormData((prev) => ({
                ...prev,
                fullName: prev.fullName || parsed.fullName || parsed.full_name || '',
                email: prev.email || parsed.email || '',
                phone: prev.phone || parsed.phone || '',
            }));
        } catch {
            // Ignore malformed localStorage entries
        }
    }, []);

    // Handle input changes and clear field-level validation error
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    // Validate required fields before building the WhatsApp inquiry
    const validateForm = () => {
        const nextErrors = {};
        if (!formData.fullName.trim()) {
            nextErrors.fullName = 'Please enter your full name.';
        }
        if (!formData.email.trim()) {
            nextErrors.email = 'Please enter your email address.';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            nextErrors.email = 'Please enter a valid email address.';
        }
        if (!formData.message.trim() || formData.message.trim().length < 10) {
            nextErrors.message = 'Please share a brief message (at least 10 characters).';
        }
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    // Build a cleanly formatted, structured WhatsApp message from the form fields
    const buildWhatsAppMessage = () => {
        const lines = [
            '*Serenity Bay Hotel & Resort — Concierge Inquiry*',
            '--------------------------------',
            `*Inquiry Type:* ${formData.inquiryType}`,
            `*Guest Name:* ${formData.fullName.trim()}`,
            `*Email:* ${formData.email.trim()}`,
        ];

        if (formData.phone.trim()) {
            lines.push(`*Phone:* ${formData.phone.trim()}`);
        }

        // Append context-specific details based on the selected inquiry type
        if (formData.inquiryType === 'Room Reservation') {
            if (formData.preferredCheckIn || formData.preferredCheckOut) {
                lines.push(
                    `*Preferred Dates:* ${formData.preferredCheckIn || 'Flexible'} to ${formData.preferredCheckOut || 'Flexible'}`
                );
            }
            if (formData.guests) {
                lines.push(`*Guests:* ${formData.guests}`);
            }
        } else if (formData.inquiryType === 'Airport Transfer') {
            if (formData.arrivalDate) {
                lines.push(`*Arrival Date:* ${formData.arrivalDate}`);
            }
            if (formData.flightNumber.trim()) {
                lines.push(`*Flight Number:* ${formData.flightNumber.trim()}`);
            }
        } else if (formData.inquiryType === 'Special Event / Wedding') {
            if (formData.eventDate) {
                lines.push(`*Preferred Event Date:* ${formData.eventDate}`);
            }
            if (formData.estimatedGuests.trim()) {
                lines.push(`*Estimated Guests:* ${formData.estimatedGuests.trim()}`);
            }
        }

        lines.push('', '*Message:*', formData.message.trim());
        return lines.join('\n');
    };

    // Submit handler: validates, builds WhatsApp URL, opens chat, and renders fallback confirmation
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formattedText = buildWhatsAppMessage();
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(formattedText)}`;

        setSubmittedPayload({
            text: formattedText,
            url: whatsappUrl,
            guestName: formData.fullName.trim(),
        });
        setCopied(false);

        // Open WhatsApp in a new tab; fallback UI below remains accessible if blocked by browser
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    };

    // Copy the formatted inquiry text to clipboard as a desktop fallback
    const handleCopyMessage = async () => {
        if (!submittedPayload?.text) return;
        try {
            await navigator.clipboard.writeText(submittedPayload.text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // Clipboard permission unavailable; user can still use the direct WhatsApp link
        }
    };

    // Quick direct WhatsApp link for guests who prefer immediate chat without filling the form
    const directWhatsAppUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        'Hello Serenity Bay Concierge, I would like to inquire about an upcoming stay.'
    )}`;

    return (
        <main className="min-h-screen bg-[#F7F3E8] text-[#061C2B] font-sans selection:bg-[#C9A24B] selection:text-[#061C2B]">
            {/* 1. Editorial Hero Banner */}
            <header
                className="relative h-[450px] md:h-[600px] bg-cover bg-center flex flex-col justify-center px-6 pt-20 md:px-12 md:pt-28"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(6, 59, 50, 0.85) 0%, rgba(6, 59, 50, 0.45) 40%, rgba(6, 59, 50, 0.1) 70%, rgba(6, 59, 50, 0) 90%), url(${hotelLobbyImg})`,
                }}
                role="banner"
                aria-label="Contact Serenity Bay Concierge"
            >
                <div className="max-w-7xl mx-auto w-full text-left animate-[fadeInUp_1s_ease-out]">
                    <span className="text-[#C5A253] tracking-[0.2em] uppercase text-xs font-bold block mb-2">
                        SERENITY BAY HOTEL &amp; RESORT · MIRISSA
                    </span>
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-normal mb-3 md:mb-4">
                        Concierge &amp; <span className="italic text-[#C9A24B]">Inquiries</span>
                    </h1>
                    <p className="text-gray-200 text-xs sm:text-sm md:text-base font-light max-w-xl leading-relaxed">
                        Allow our dedicated team in Mirissa to curate your stay, private events, and seamless coastal arrivals.
                    </p>
                </div>
            </header>

            {/* 2. Two-Column Main Section: Direct Contact Info & Smart WhatsApp Inquiry Form */}
            <section
                className="py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
                aria-labelledby="contact-main-heading"
            >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
                    {/* Left Column: Direct Contact Details & Instant WhatsApp Concierge */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="space-y-3">
                            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#b8972e] font-semibold">
                                <Sparkles className="w-3.5 h-3.5" /> Get in Touch
                            </span>
                            <h2
                                id="contact-main-heading"
                                className="font-serif text-3xl sm:text-4xl text-[#061C2B] leading-tight"
                            >
                                At Your Service, <span className="italic text-[#b8972e]">Day &amp; Night</span>
                            </h2>
                            <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
                                Whether you are planning an oceanfront escape, a private celebration, or an airport transfer, our team is ready to assist you personally.
                            </p>
                        </div>

                        {/* Direct Contact Cards */}
                        <address className="not-italic space-y-4">
                            {/* Hotel Address */}
                            <div className="bg-white/80 backdrop-blur-sm border border-[#061C2B]/10 rounded-2xl p-5 shadow-sm hover:border-[#C9A24B]/60 transition">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#061C2B] text-[#C9A24B] flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-serif text-base font-semibold text-[#061C2B]">
                                            Resort Address
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                                            Beach Road, Mirissa 81740,<br />
                                            Southern Province, Sri Lanka
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Reservations Desk */}
                            <div className="bg-white/80 backdrop-blur-sm border border-[#061C2B]/10 rounded-2xl p-5 shadow-sm hover:border-[#C9A24B]/60 transition">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#061C2B] text-[#C9A24B] flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1.5 min-w-0">
                                        <h3 className="font-serif text-base font-semibold text-[#061C2B]">
                                            Reservations Desk (24/7)
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            <a
                                                href="tel:+94112345678"
                                                className="hover:text-[#b8972e] transition font-medium"
                                            >
                                                +94 11 234 5678
                                            </a>
                                        </p>
                                        <p className="text-sm text-gray-600 truncate">
                                            <a
                                                href="mailto:reservations@serenitybay.com"
                                                className="hover:text-[#b8972e] transition inline-flex items-center gap-1.5"
                                            >
                                                <Mail className="w-3.5 h-3.5 text-[#b8972e] shrink-0" />
                                                reservations@serenitybay.com
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* General Concierge */}
                            <div className="bg-white/80 backdrop-blur-sm border border-[#061C2B]/10 rounded-2xl p-5 shadow-sm hover:border-[#C9A24B]/60 transition">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#061C2B] text-[#C9A24B] flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1.5 min-w-0">
                                        <h3 className="font-serif text-base font-semibold text-[#061C2B]">
                                            General Concierge &amp; Events
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            Airport transfers, private dining, weddings &amp; excursions
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <a
                                                href="tel:+94771234567"
                                                className="hover:text-[#b8972e] transition font-medium"
                                            >
                                                +94 77 123 4567
                                            </a>
                                        </p>
                                        <p className="text-sm text-gray-600 truncate">
                                            <a
                                                href="mailto:concierge@serenitybay.com"
                                                className="hover:text-[#b8972e] transition"
                                            >
                                                concierge@serenitybay.com
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </address>

                        {/* Check-in / Check-out Quick Note */}
                        <div className="bg-[#061C2B] text-white rounded-2xl p-5 flex items-start gap-4 shadow-md border border-[#C9A24B]/30">
                            <Clock className="w-5 h-5 text-[#C9A24B] shrink-0 mt-0.5" />
                            <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-[#C9A24B] font-semibold">
                                    Check-in &amp; Check-out
                                </p>
                                <p className="text-sm text-gray-200 mt-1">
                                    Check-in: <span className="font-semibold text-white">2:00 PM</span> &nbsp;|&nbsp; Check-out: <span className="font-semibold text-white">12:00 PM</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    Early check-in &amp; late check-out available upon request.
                                </p>
                            </div>
                        </div>

                        {/* Direct WhatsApp Concierge Quick CTA */}
                        <a
                            href={directWhatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-between gap-4 bg-[#128C7E]/10 hover:bg-[#128C7E]/15 border border-[#128C7E]/30 rounded-2xl p-5 transition group"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-sm">
                                    <FaWhatsapp className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-serif text-base font-semibold text-[#061C2B]">
                                        WhatsApp Concierge (24/7)
                                    </p>
                                    <p className="text-xs text-gray-600">
                                        Prefer a quick chat? Message our desk directly.
                                    </p>
                                </div>
                            </div>
                            <ExternalLink className="w-4 h-4 text-[#128C7E] group-hover:translate-x-0.5 transition shrink-0" />
                        </a>
                    </div>

                    {/* Right Column: Smart WhatsApp Inquiry Form */}
                    <div className="lg:col-span-7">
                        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#061C2B]/10">
                            <div className="mb-8 pb-5 border-b border-gray-100">
                                <span className="text-[11px] uppercase tracking-[0.25em] text-[#b8972e] font-semibold">
                                    Instant Concierge Form
                                </span>
                                <h3 className="font-serif text-2xl sm:text-3xl text-[#061C2B] mt-1">
                                    Send an Inquiry via WhatsApp
                                </h3>
                                <p className="text-sm text-gray-500 mt-1.5">
                                    Complete the details below and we will format your request directly for our WhatsApp Concierge desk.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} noValidate className="space-y-5">
                                {/* Full Name */}
                                <div>
                                    <label
                                        htmlFor="fullName"
                                        className="block text-xs uppercase tracking-wider font-semibold text-[#061C2B] mb-2"
                                    >
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="e.g., Kasun Perera"
                                        className={`w-full px-4 py-3 rounded-xl bg-[#F7F3E8]/60 border text-sm text-[#061C2B] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A24B]/50 transition ${errors.fullName ? 'border-red-400' : 'border-gray-200 focus:border-[#C9A24B]'
                                            }`}
                                    />
                                    {errors.fullName && (
                                        <p className="text-xs text-red-600 mt-1.5">{errors.fullName}</p>
                                    )}
                                </div>

                                {/* Email & Optional Phone */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-xs uppercase tracking-wider font-semibold text-[#061C2B] mb-2"
                                        >
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="you@example.com"
                                            className={`w-full px-4 py-3 rounded-xl bg-[#F7F3E8]/60 border text-sm text-[#061C2B] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A24B]/50 transition ${errors.email ? 'border-red-400' : 'border-gray-200 focus:border-[#C9A24B]'
                                                }`}
                                        />
                                        {errors.email && (
                                            <p className="text-xs text-red-600 mt-1.5">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="phone"
                                            className="block text-xs uppercase tracking-wider font-semibold text-[#061C2B] mb-2"
                                        >
                                            Phone / WhatsApp <span className="text-gray-400 font-normal">(Optional)</span>
                                        </label>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+94 77 123 4567"
                                            className="w-full px-4 py-3 rounded-xl bg-[#F7F3E8]/60 border border-gray-200 focus:border-[#C9A24B] text-sm text-[#061C2B] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A24B]/50 transition"
                                        />
                                    </div>
                                </div>

                                {/* Inquiry Type Selector */}
                                <div>
                                    <label
                                        htmlFor="inquiryType"
                                        className="block text-xs uppercase tracking-wider font-semibold text-[#061C2B] mb-2"
                                    >
                                        Inquiry Type
                                    </label>
                                    <select
                                        id="inquiryType"
                                        name="inquiryType"
                                        value={formData.inquiryType}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl bg-[#F7F3E8]/60 border border-gray-200 focus:border-[#C9A24B] text-sm text-[#061C2B] focus:outline-none focus:ring-2 focus:ring-[#C9A24B]/50 transition cursor-pointer"
                                    >
                                        {INQUIRY_TYPES.map((type) => (
                                            <option key={type} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Smart Conditional Fields: Room Reservation */}
                                {formData.inquiryType === 'Room Reservation' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-[#F7F3E8]/80 border border-[#C9A24B]/25">
                                        <div>
                                            <label
                                                htmlFor="preferredCheckIn"
                                                className="block text-[11px] uppercase tracking-wider font-semibold text-gray-600 mb-1.5"
                                            >
                                                Check-in Date
                                            </label>
                                            <input
                                                id="preferredCheckIn"
                                                name="preferredCheckIn"
                                                type="date"
                                                value={formData.preferredCheckIn}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2.5 rounded-lg bg-white border border-gray-200 text-xs text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="preferredCheckOut"
                                                className="block text-[11px] uppercase tracking-wider font-semibold text-gray-600 mb-1.5"
                                            >
                                                Check-out Date
                                            </label>
                                            <input
                                                id="preferredCheckOut"
                                                name="preferredCheckOut"
                                                type="date"
                                                value={formData.preferredCheckOut}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2.5 rounded-lg bg-white border border-gray-200 text-xs text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="guests"
                                                className="block text-[11px] uppercase tracking-wider font-semibold text-gray-600 mb-1.5"
                                            >
                                                Guests
                                            </label>
                                            <select
                                                id="guests"
                                                name="guests"
                                                value={formData.guests}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2.5 rounded-lg bg-white border border-gray-200 text-xs text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                                            >
                                                <option value="1 Adult">1 Adult</option>
                                                <option value="2 Adults">2 Adults</option>
                                                <option value="2 Adults, 1 Child">2 Adults, 1 Child</option>
                                                <option value="2 Adults, 2 Children">2 Adults, 2 Children</option>
                                                <option value="Group / Family (4+)">Group / Family (4+)</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                {/* Smart Conditional Fields: Airport Transfer */}
                                {formData.inquiryType === 'Airport Transfer' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F7F3E8]/80 border border-[#C9A24B]/25">
                                        <div>
                                            <label
                                                htmlFor="arrivalDate"
                                                className="block text-[11px] uppercase tracking-wider font-semibold text-gray-600 mb-1.5"
                                            >
                                                Arrival Date
                                            </label>
                                            <input
                                                id="arrivalDate"
                                                name="arrivalDate"
                                                type="date"
                                                value={formData.arrivalDate}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2.5 rounded-lg bg-white border border-gray-200 text-xs text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="flightNumber"
                                                className="block text-[11px] uppercase tracking-wider font-semibold text-gray-600 mb-1.5"
                                            >
                                                Flight Number (Optional)
                                            </label>
                                            <input
                                                id="flightNumber"
                                                name="flightNumber"
                                                type="text"
                                                value={formData.flightNumber}
                                                onChange={handleChange}
                                                placeholder="e.g., UL 504"
                                                className="w-full px-3 py-2.5 rounded-lg bg-white border border-gray-200 text-xs text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Smart Conditional Fields: Special Event / Wedding */}
                                {formData.inquiryType === 'Special Event / Wedding' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F7F3E8]/80 border border-[#C9A24B]/25">
                                        <div>
                                            <label
                                                htmlFor="eventDate"
                                                className="block text-[11px] uppercase tracking-wider font-semibold text-gray-600 mb-1.5"
                                            >
                                                Preferred Event Date
                                            </label>
                                            <input
                                                id="eventDate"
                                                name="eventDate"
                                                type="date"
                                                value={formData.eventDate}
                                                onChange={handleChange}
                                                className="w-full px-3 py-2.5 rounded-lg bg-white border border-gray-200 text-xs text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="estimatedGuests"
                                                className="block text-[11px] uppercase tracking-wider font-semibold text-gray-600 mb-1.5"
                                            >
                                                Estimated Guests
                                            </label>
                                            <input
                                                id="estimatedGuests"
                                                name="estimatedGuests"
                                                type="text"
                                                value={formData.estimatedGuests}
                                                onChange={handleChange}
                                                placeholder="e.g., 80 - 100 guests"
                                                className="w-full px-3 py-2.5 rounded-lg bg-white border border-gray-200 text-xs text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Message Textarea */}
                                <div>
                                    <label
                                        htmlFor="message"
                                        className="block text-xs uppercase tracking-wider font-semibold text-[#061C2B] mb-2"
                                    >
                                        Your Message <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows={4}
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="Tell us about your preferred suite, special requests, or how our concierge can assist you..."
                                        className={`w-full px-4 py-3 rounded-xl bg-[#F7F3E8]/60 border text-sm text-[#061C2B] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C9A24B]/50 transition resize-y ${errors.message ? 'border-red-400' : 'border-gray-200 focus:border-[#C9A24B]'
                                            }`}
                                    />
                                    {errors.message && (
                                        <p className="text-xs text-red-600 mt-1.5">{errors.message}</p>
                                    )}
                                </div>

                                {/* Primary Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full bg-[#b8972e] hover:bg-[#a68525] text-black font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 flex items-center justify-center gap-2.5 cursor-pointer"
                                >
                                    <FaWhatsapp className="w-5 h-5" />
                                    <span>Send Inquiry via WhatsApp</span>
                                </button>
                            </form>

                            {/* Confirmation Banner & Popup-Blocker / Desktop Fallback Controls */}
                            {submittedPayload && (
                                <div
                                    role="status"
                                    aria-live="polite"
                                    className="mt-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3"
                                >
                                    <div className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-semibold text-emerald-950">
                                                Thank you, {submittedPayload.guestName}. Your inquiry is ready!
                                            </p>
                                            <p className="text-xs text-emerald-800 mt-0.5 leading-relaxed">
                                                WhatsApp should open in a new tab. If it didn&apos;t open automatically, use the direct button or copy your formatted message below.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 pt-1">
                                        <a
                                            href={submittedPayload.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 bg-[#b8972e] hover:bg-[#a68525] text-black text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition"
                                        >
                                            <FaWhatsapp className="w-4 h-4" />
                                            <span>Open WhatsApp Chat</span>
                                        </a>

                                        <button
                                            type="button"
                                            onClick={handleCopyMessage}
                                            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-[#061C2B] border border-gray-200 text-xs font-semibold px-4 py-2.5 rounded-lg transition cursor-pointer"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="w-4 h-4 text-emerald-600" />
                                                    <span>Copied!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4 text-gray-500" />
                                                    <span>Copy Message</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Interactive Location Map & Coastal Arrival Guide */}
            <section
                className="bg-[#EFE9DA]/70 border-t border-[#061C2B]/10 py-14 sm:py-20 px-4 sm:px-6 lg:px-8"
                aria-labelledby="location-heading"
            >
                <div className="max-w-7xl mx-auto space-y-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <span className="text-xs uppercase tracking-[0.25em] text-[#b8972e] font-semibold">
                                Location &amp; Directions
                            </span>
                            <h2
                                id="location-heading"
                                className="font-serif text-3xl sm:text-4xl text-[#061C2B] mt-1"
                            >
                                Find Us in <span className="italic text-[#b8972e]">Mirissa</span>
                            </h2>
                        </div>

                        <a
                            href="https://maps.google.com/?q=Beach+Road,+Mirissa,+Sri+Lanka"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 self-start md:self-auto bg-[#b8972e] hover:bg-[#a68525] text-black text-xs uppercase tracking-widest font-semibold px-5 py-3 rounded-xl transition shadow-sm"
                        >
                            <span>Open in Google Maps</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </div>

                    {/* Responsive Google Maps Embed */}
                    <div className="w-full h-[320px] sm:h-[420px] rounded-3xl overflow-hidden shadow-lg border border-[#061C2B]/15 bg-white">
                        <iframe
                            title="Serenity Bay Hotel & Resort Location Map - Mirissa, Sri Lanka"
                            src="https://www.google.com/maps?q=Beach%20Road,%20Mirissa,%20Sri%20Lanka&output=embed"
                            className="w-full h-full border-0"
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            allowFullScreen
                        />
                    </div>

                    {/* Travel & Arrival Distance Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="bg-white/90 rounded-2xl p-5 border border-[#061C2B]/10 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#061C2B]/5 text-[#061C2B] flex items-center justify-center shrink-0">
                                <Plane className="w-5 h-5 text-[#b8972e]" />
                            </div>
                            <div>
                                <h3 className="font-serif text-base font-semibold text-[#061C2B]">
                                    Bandaranaike Int&apos;l Airport (CMB)
                                </h3>
                                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                    Approx. 2.5 hours via the Southern Expressway. Private chauffeur transfers available on request.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white/90 rounded-2xl p-5 border border-[#061C2B]/10 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#061C2B]/5 text-[#061C2B] flex items-center justify-center shrink-0">
                                <Compass className="w-5 h-5 text-[#b8972e]" />
                            </div>
                            <div>
                                <h3 className="font-serif text-base font-semibold text-[#061C2B]">
                                    Historic Galle Fort
                                </h3>
                                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                    Approx. 45 minutes along the scenic southern coastline.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white/90 rounded-2xl p-5 border border-[#061C2B]/10 flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#061C2B]/5 text-[#061C2B] flex items-center justify-center shrink-0">
                                <Train className="w-5 h-5 text-[#b8972e]" />
                            </div>
                            <div>
                                <h3 className="font-serif text-base font-semibold text-[#061C2B]">
                                    Weligama &amp; Matara Stations
                                </h3>
                                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                                    15–20 minutes drive from the resort, ideal for scenic coastal rail arrivals.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

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
