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
// Import local video asset for the Deluxe Ocean Room walkthrough
import roomVideo1 from '../assets/roomVideo1.mp4';
import roomVideo2 from '../assets/roomVideo2.mp4';

// Main data array containing all hotel room configurations and media details
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
        longDescription: "Step into a world of elegance in our Deluxe Ocean Room, featuring modern luxury design, premium amenities, and panoramic views of the Indian Ocean. Unwind on your private balcony while listening to the soothing waves, and experience unmatched comfort tailored for an unforgettable getaway.",
        specialFeatures: [
            "Private balcony with ocean view",
            "Luxurious bathroom amenities",
            "24/7 Room Service"
        ],
        roomOverview: "Immerse yourself in absolute coastal elegance within our Deluxe Ocean Room. Designed as a sanctuary for discerning travelers, this residence features plush hand-crafted furnishings, rich wooden textures, and floor-to-ceiling glass doors that open onto a private ocean-facing balcony. Rejuvenate beneath a spa-inspired rainfall shower, unwind on a signature king bed with pillow-top mattresses and silk-soft linens, and awaken each morning to the soothing melody of crashing waves and panoramic views of the turquoise sea.",
        amenities: ["Balcony", "Free Wi-Fi", "Air Conditioning"],
        videoUrl: roomVideo1,
        images: [
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800"
        ],
        galleryImages: [
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800"
        ],

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
        view: "Pool View",
        description: "Secluded villa with private infinity pool and lush tropical surroundings.",
        longDescription: "Designed for ultimate privacy and indulgence, the Private Pool Villa offers a secluded sanctuary featuring your own private infinity pool set against lush tropical surroundings. Enjoy personalized in-room dining, expansive open-air living spaces, and a peaceful atmosphere made for true relaxation.",
        specialFeatures: [
            "Private infinity pool & sun deck",
            "Secluded tropical garden",
            "Personalized in-room dining"
        ],
        roomOverview: "An ultra-exclusive haven of solitude, the Private Pool Villa combines tropical opulence with complete architectural privacy. Tucked away amidst lush island foliage, your villa opens to an expansive teak wood sun deck and a breathtaking private infinity plunge pool. Indoors, experience residential luxury with custom artisan décor, an oversized soaking tub, personalized 24/7 butler service, and romantic open-air dining settings designed for unforgettable moments.",
        amenities: ["Private Pool", "Free Wi-Fi", "In-room Dining"],
        videoUrl: roomVideo2,
        images: [
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=800"
        ],
        galleryImages: [
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800"
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
        roomOverview: "A masterclass in coastal grandeur, the Ocean Suite offers an expansive multi-room retreat framed by uninterrupted horizon vistas. Featuring a grand master bedroom, a separate formal living lounge, and a wide private terrace, this suite harmonizes modern luxury with residential warmth. Indulge in bespoke room refreshments from your private bar, refresh in a marble-clad bathroom with ocean-view tubs, and enjoy sunset champagne tailored for an elevated coastal escape.",
        longDescription: "Immerse yourself in elevated luxury within our Ocean Suite. Boasting an expansive private lounge area and breathtaking ocean vistas, this suite offers a seamless fusion of refined sophistication and residential warmth—perfect for couples seeking a memorable coastal retreat.",
        specialFeatures: [
            "Panoramic floor-to-ceiling ocean windows",
            "Dedicated private lounge area",
            "Complimentary sunset champagne"
        ],
        roomOverview: "A masterclass in coastal grandeur, the Ocean Suite offers an expansive multi-room retreat framed by uninterrupted horizon vistas. Featuring a grand master bedroom, a separate formal living lounge, and a wide private terrace, this suite harmonizes modern luxury with residential warmth. Indulge in bespoke room refreshments from your private bar, refresh in a marble-clad bathroom with ocean-view tubs, and enjoy sunset champagne tailored for an elevated coastal escape.",
        amenities: ["Living Area", "Balcony", "Free Wi-Fi"],
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-luxury-resort-overwater-bungalows-41584-large.mp4",
        images: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800"
        ],
        galleryImages: [
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800"
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
        longDescription: "Nestled within lush, tranquil greenery, the Garden Villa is an oasis of peace designed for restorative tranquility. Step out onto your private sun terrace, breathe in the fresh natural surroundings, and reconnect with nature in an atmosphere of complete quietude and charm.",
        specialFeatures: [
            "Private sun terrace amidst greenery",
            "Outdoor rain shower experience",
            "Organic herbal tea station"
        ],
        roomOverview: "Enveloped by a tranquil canopy of emerald greenery, the Garden Villa is a peaceful sanctuary dedicated to holistic wellness and natural harmony. The villa showcases organic architecture, natural stone finishes, and seamless indoor-outdoor living spaces. Step onto your private shaded garden terrace, soak in the restorative serenity of nature, and revitalize your senses under a secluded outdoor rainfall shower surrounded by exotic tropical flora.",
        amenities: ["Terrace", "Free Wi-Fi", "Air Conditioning"],
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-sunlight-entering-a-modern-hotel-room-41585-large.mp4",
        images: [
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800"

        ],
        galleryImages: [
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800"
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
        longDescription: "Crafted to bring loved ones together, the Family Suite offers generous multi-room luxury without compromising on privacy or style. Featuring two opulent master bedrooms, elegant communal spaces, and top-tier amenities, it provides the perfect backdrop for cherished family moments.",
        specialFeatures: [
            "Two spacious master bedrooms",
            "Interconnected family living space",
            "Special children's welcome amenities"
        ],
        roomOverview: "Generously proportioned and thoughtfully curated for multi-generational comfort, the Family Suite offers an unparalleled blend of shared luxury and individual privacy. Boasting two opulent master suites, an expansive central lounge for quality togetherness, and interactive entertainment setups, every family member is treated to supreme comfort. Complete with bespoke children's welcome amenities and dedicated family concierge services, it serves as your home away from home.",
        amenities: ["Free Wi-Fi", "Air Conditioning", "Breakfast Included"],
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-interior-of-a-luxury-hotel-room-41583-large.mp4",
        images: [
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800"
        ],
        galleryImages: [
            "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&q=80&w=800"
        ]
    },
    {
        id: 6,
        title: "Sunset Villa",
        category: "Pool Villas",
        allowedPackage: "Luxury Private Pool Villa",
        guests: "2 Adults",
        bed: "Twin Bed",
        size: "90 m²",
        price: "$620",
        view: "Ocean View",
        description: "Unforgettable views, exclusive comfort, and breathtaking golden-hour vistas.",
        longDescription: "Positioned perfectly to capture the magical golden hour, the Sunset Villa combines breathtaking coastal views with exclusive private pool luxury. Bask in the warm glow of the evening sky from your private deck, enjoying uncompromised comfort in a truly romantic setting.",
        specialFeatures: [
            "Prime west-facing sunset deck",
            "Private plunge pool with view",
            "Evening turndown service"
        ],
        roomOverview: "Strategically positioned to capture the island's most spectacular daily sunset, the Sunset Villa offers front-row seats to nature's golden-hour radiance. Relax in your private outdoor pool as the sky paints shades of amber and rose, or sink into an oversized plush bed angled directly toward the horizon. Featuring rich warm lighting, private evening turndown rituals, and uninterrupted sea views, it represents the absolute pinnacle of romantic indulgence.",
        amenities: ["Private Pool", "Free Wi-Fi", "Air Conditioning"],
        videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-luxury-resort-overwater-bungalows-41584-large.mp4",
        images: [
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&q=80&w=800"
        ],
        galleryImages: [
            "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&q=80&w=800"
        ]
    }
];

// Special Offers Data Array for Luxury Hotel Landing Page with USD Currency ($)
export const OFFERS_DATA = [
    {
        id: '1',
        category: 'ROMANTIC ESCAPE',
        title: 'A Romantic Getaway',
        subtitle: 'Create unforgettable moments together.',
        description: 'Enjoy an intimate luxury escape with elegant accommodation and a relaxing atmosphere for two.',
        discount: '20% OFF',
        originalPrice: '$250',
        discountedPrice: '$200',
        saveAmount: 'Save $50',
        validUntil: 'Dec 31, 2026',
        images: [
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=85',// Romantic hotel room with ocean view
            'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1400&q=85', // Couple enjoying a luxury resort pool
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=85', // Romantic infinity pool at sunset
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1400&q=85', // Luxury tropical resort
        ],
        features: ['Luxury room stay', 'Breakfast for two', 'Late checkout'],
        terms: [
            'Offer is subject to room availability.',
            'Advance reservation is required.',
            'Valid for selected room categories only.',
            'This offer cannot be combined with other promotions.',
        ],
    },
    {
        id: '2',
        category: 'LONG STAY',
        title: 'Stay a Little Longer',
        subtitle: 'Stay longer, relax more, save more.',
        description: 'Take your time, unwind in comfort and enjoy more of your stay with our extended-stay offer.',
        discount: '15% OFF',
        originalPrice: '$220',
        discountedPrice: '$187',
        saveAmount: 'Save $33',
        validUntil: 'Jan 15, 2027',
        images: [
            'https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1400&q=85', // Luxury hotel room with sea view
            'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1400&q=85', // Tropical resort with private pool
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1400&q=85', // Luxury hotel bedroom with balcony
            'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?auto=format&fit=crop&w=1400&q=85', // Tropical villa with private pool
        ],
        features: ['Minimum 3 nights stay', 'Complimentary Wi-Fi', 'Premium Services'],
        terms: [
            'A minimum stay of three nights is required.',
            'Offer is subject to room availability.',
            'Complimentary Wi-Fi applies to all registered guests during the stay.',
            'Cancellation must be made at least 48 hours prior to check-in.',
        ],
    },
    {
        id: '3',
        category: 'EARLY BOOKING',
        title: 'Plan Ahead & Save',
        subtitle: 'Make your next escape extra special.',
        description: 'Plan your next luxury holiday early and enjoy an exclusive saving on your room reservation.',
        discount: '10% OFF',
        originalPrice: '$240',
        discountedPrice: '$216',
        saveAmount: 'Save $24',
        validUntil: 'Feb 28, 2027',
        images: [
            'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1400&q=85', // Luxury beach resort
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1400&q=85', // Hotel room overlooking the pool
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1400&q=85',  // Luxury resort with ocean view
            'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1400&q=85', // Tropical resort with infinity pool
        ],
        features: ['Advance Reservation', 'Selected Rooms', 'Flexible Travel'],
        terms: [
            'Booking must be made at least 30 days in advance.',
            'Offer is subject to room availability and seasonal dates.',
            'A non-refundable deposit is required at the time of booking.',
            'Valid only for selected room categories specified in the promotion.',
        ],
    },
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