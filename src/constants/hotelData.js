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

// Luxury rooms and suites data with video walkthroughs, gallery images, and package mappings
export const ROOMS_DATA = [
    {
        id: 1,
        title: "Deluxe Ocean Room",
        category: "Deluxe Rooms",
        allowedPackage: "Honeymoon & Romantic Getaway",
        guests: "2 Adults",
        bed: "King Bed",
        size: "42 m²",
        price: "$280",
        view: "Ocean View",
        description: "A perfect blend of comfort and elegance with stunning ocean views.",
        amenities: ["Ocean View", "Balcony", "Free Wi-Fi", "Air Conditioning"],
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-luxury-hotel-room-41583-large.mp4",
        images: [
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800"
        ]
    },
    {
        id: 2,
        title: "Private Pool Villa",
        category: "Pool Villas",
        allowedPackage: "Luxury Private Pool Villa",
        guests: "2 Adults",
        bed: "King Bed",
        size: "120 m²",
        price: "$520",
        view: "Garden & Pool View",
        description: "Secluded villa with private infinity pool and lush tropical surroundings.",
        amenities: ["Private Pool", "Garden View", "Free Wi-Fi", "In-room Dining"],
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-view-of-a-luxury-resort-swimming-pool-41582-large.mp4",
        images: [
            "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=800"
        ]
    },
    {
        id: 3,
        title: "Ocean Suite",
        category: "Suites",
        allowedPackage: "Honeymoon & Romantic Getaway",
        guests: "2 Adults",
        bed: "King Bed",
        size: "78 m²",
        price: "$680",
        view: "Ocean View",
        description: "Spacious luxury with panoramic ocean views and private lounge space.",
        amenities: ["Ocean View", "Living Area", "Balcony", "Free Wi-Fi"],
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-luxury-resort-overwater-bungalows-41584-large.mp4",
        images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800"
        ]
    },
    {
        id: 4,
        title: "Garden Villa",
        category: "Villas",
        allowedPackage: "Wellness & Ayurveda Retreat",
        guests: "2 Adults",
        bed: "King Bed",
        size: "55 m²",
        price: "$420",
        view: "Garden View",
        description: "Surrounded by nature, designed for tranquility and restorative peace.",
        amenities: ["Garden View", "Terrace", "Free Wi-Fi", "Air Conditioning"],
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-sunlight-entering-a-modern-hotel-room-41585-large.mp4",
        images: [
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800"
        ]
    },
    {
        id: 5,
        title: "Family Suite",
        category: "Suites",
        allowedPackage: "All Rooms & Suites",
        guests: "4 Adults",
        bed: "2 King Beds",
        size: "95 m²",
        price: "$760",
        view: "Ocean View",
        description: "More space, more moments together with multi-room luxury comfort.",
        amenities: ["Ocean View", "Free Wi-Fi", "Air Conditioning", "Breakfast Included"],
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-luxury-hotel-room-41583-large.mp4",
        images: [
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800"
        ]
    },
    {
        id: 6,
        title: "Sunset Villa",
        category: "Pool Villas",
        allowedPackage: "Luxury Private Pool Villa",
        guests: "2 Adults",
        bed: "King Bed",
        size: "90 m²",
        price: "$620",
        view: "Ocean View",
        description: "Unforgettable views, exclusive comfort, and breathtaking golden-hour vistas.",
        amenities: ["Ocean View", "Private Pool", "Free Wi-Fi", "Air Conditioning"],
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-luxury-resort-overwater-bungalows-41584-large.mp4",
        images: [
            "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=800"
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