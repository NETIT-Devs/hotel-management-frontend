/**
 * Serenity Bay Hotel & Resort - Static Data Constants
 * This file contains all the static content for navigation, rooms, special offers, and hotel amenities.
 */

// Navigation links for the header and footer
export const NAV_LINKS = [
    { label: 'Home', href: '#home', active: true },
    { label: 'Rooms & Suites', href: '#rooms' },
    { label: 'Facilities', href: '#facilities' },
    { label: 'Offers', href: '#offers' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'About Us', href: '#about' },
    { label: 'Contact', href: '#contact' },
];

// Luxury rooms and suites data with pricing and features (Multiple images for 1/6 slider)
export const ROOMS_DATA = [
    {
        id: 1,
        title: "Deluxe Room",
        category: "Deluxe Rooms",
        allowedPackage: "Honeymoon & Romantic Getaway",
        guests: "2 Guests",
        bed: "King Bed",
        price: "$120",
        description: "A perfect blend of comfort and elegance with modern amenities.",
        images: [
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=600"
        ]
    },
    {
        id: 2,
        title: "Superior Room",
        category: "Suites",
        allowedPackage: "Wellness & Ayurveda Retreat",
        guests: "2 Guests",
        bed: "King Bed",
        price: "$150",
        description: "Spacious superior retreat designed for ultimate relaxation and style.",
        images: [
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=600"
        ]
    },
    {
        id: 3,
        title: "Ocean View Suite",
        category: "Villas",
        allowedPackage: "Luxury Private Pool Villa",
        guests: "4 Guests",
        bed: "King Bed",
        price: "$250",
        description: "Breathtaking panoramic ocean views with premium luxury suites facilities.",
        images: [
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=600",
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=600"
        ]
    }
];

// Special Offers Data Array for Luxury Hotel Landing Page
export const OFFERS_DATA = [
    {
        id: 1,
        title: "Early Bird Special",
        desc: "Stay 3 nights, get 20% off",
        price: "$96",
        tag: "20% OFF",
        image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        title: "Breakfast Included",
        desc: "Enjoy a complimentary breakfast",
        price: "$120",
        tag: "Free Breakfast",
        image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        title: "Romantic Getaway",
        desc: "For a perfect couple's retreat",
        price: "$180",
        tag: "Special Package",
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80"
    }
];

// Hotel facilities and amenities data for the features bar
export const AMENITIES_DATA = [
    { iconName: "Bed", title: "Luxury Rooms", desc: "Elegant & spacious" },
    { iconName: "Waves", title: "Infinity Pool", desc: "Relax & unwind" },
    { iconName: "Utensils", title: "Fine Dining", desc: "World class cuisine" },
    { iconName: "Sparkles", title: "Spa & Wellness", desc: "Rejuvenate your mind" },
    { iconName: "Dumbbell", title: "Fitness Center", desc: "Stay active" },
    { iconName: "Wifi", title: "Free Wi-Fi", desc: "Stay connected" }
];

// High-resolution gallery images for the resort preview
export const GALLERY_IMAGES = [
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=600"
];