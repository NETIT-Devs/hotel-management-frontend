import { ROOMS_DATA, OFFERS_DATA } from '../constants/hotelData';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const FALLBACK_ROOM_IMG =
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&q=80&w=800';
const FALLBACK_OFFER_IMG =
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1400&q=85';

const safeArray = (val, fallback = []) => {
  if (Array.isArray(val) && val.length > 0) return val;
  if (typeof val === 'string' && val.trim()) {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      const split = val.split(',').map((s) => s.trim()).filter(Boolean);
      if (split.length > 0) return split;
    }
  }
  return fallback;
};

export const mapRoomFromApi = (r) => {
  const staticMatch = ROOMS_DATA.find((sr) => sr.id === Number(r.id)) || {};
  const primaryImg = r.image_url || staticMatch.images?.[0] || FALLBACK_ROOM_IMG;
  const images = safeArray(r.images, staticMatch.images || [primaryImg]);
  const galleryImages = safeArray(r.gallery_images, staticMatch.galleryImages || images.slice(0, 4));
  const priceNum = Number(r.price_per_night) || Number(String(staticMatch.price || '280').replace(/[^0-9.]/g, '')) || 280;
  const residentPriceNum = Number(r.resident_price_per_night) > 0 ? Number(r.resident_price_per_night) : Math.round(priceNum * 0.75);
  const sizeNum = Number(r.size_sqm) || 45;
  const cap = Number(r.capacity) || 2;

  return {
    id: Number(r.id),
    title: r.room_name || staticMatch.title || 'Luxury Suite',
    category: r.category || staticMatch.category || (r.room_type === 'SUITE' ? 'Suites' : r.room_type === 'VILLA' ? 'Villas' : 'Deluxe Rooms'),
    allowedPackage: r.allowed_package || staticMatch.allowedPackage || 'All Rooms & Suites',
    guests: r.guests_label || staticMatch.guests || `${cap} Adults`,
    capacity: cap,
    bed: r.bed_type || staticMatch.bed || 'King Bed',
    size: `${Math.round(sizeNum)} m²`,
    price: `$${Math.round(priceNum)}`,
    priceNumber: priceNum,
    price_per_night: priceNum,
    resident_price_per_night: residentPriceNum,
    view: r.view_type || staticMatch.view || 'Ocean View',
    description: r.description || staticMatch.description || '',
    longDescription: r.long_description || staticMatch.longDescription || r.description || '',
    roomOverview: r.room_overview || staticMatch.roomOverview || r.long_description || r.description || '',
    specialFeatures: safeArray(r.special_features, staticMatch.specialFeatures || ['Private balcony with ocean view', '24/7 Room Service']),
    amenities: safeArray(r.amenities, staticMatch.amenities || ['Free Wi-Fi', 'Air Conditioning']),
    videoUrl: r.video_url || staticMatch.videoUrl || '',
    images: images.length > 0 ? images : [primaryImg],
    galleryImages: galleryImages.length > 0 ? galleryImages : [primaryImg],
    image: primaryImg,
    total_units: Number(r.total_units) || 10,
    status: r.status || 'ACTIVE',
  };
};

export const mapOfferFromApi = (o) => {
  const staticMatch = OFFERS_DATA.find((so) => String(so.id) === String(o.id)) || {};
  const primaryImg = o.image_url || staticMatch.images?.[0] || FALLBACK_OFFER_IMG;
  const images = safeArray(o.images, staticMatch.images || [primaryImg]);
  const origNum = Number(o.original_price) || 0;
  const discNum = Number(o.discounted_price) || 0;

  let validUntilStr = staticMatch.validUntil || 'Dec 31, 2026';
  if (o.valid_until) {
    const d = new Date(o.valid_until);
    if (!Number.isNaN(d.getTime())) {
      validUntilStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  }

  return {
    id: String(o.id),
    category: o.category || staticMatch.category || 'SPECIAL OFFER',
    title: o.title || staticMatch.title || 'Special Offer',
    subtitle: o.subtitle || staticMatch.subtitle || 'Experience bespoke coastal luxury.',
    description: o.description || staticMatch.description || '',
    discount: o.discount || staticMatch.discount || 'SPECIAL OFFER',
    originalPrice: origNum > 0 ? `$${Math.round(origNum)}` : staticMatch.originalPrice || '$250',
    discountedPrice: discNum > 0 ? `$${Math.round(discNum)}` : staticMatch.discountedPrice || '$200',
    saveAmount: o.save_amount || (origNum > discNum ? `Save $${Math.round(origNum - discNum)}` : staticMatch.saveAmount || 'Special Rate'),
    validUntil: validUntilStr,
    images: images.length > 0 ? images : [primaryImg],
    image: primaryImg,
    features: safeArray(o.features, staticMatch.features || ['Luxury room stay', 'Breakfast for two', 'Late checkout']),
    terms: safeArray(o.terms, staticMatch.terms || ['Offer is subject to room availability.', 'Advance reservation is required.']),
    room_id: o.room_id || null,
    room_name: o.room_name || null,
    status: o.status || 'ACTIVE',
  };
};

export const fetchLiveRooms = async () => {
  try {
    const res = await fetch(`${API_BASE}/rooms`);
    const data = await res.json();
    if (res.ok && Array.isArray(data?.rooms) && data.rooms.length > 0) {
      return data.rooms.map(mapRoomFromApi);
    }
  } catch {
    // Fallback gracefully to static data if backend is offline
  }
  return ROOMS_DATA;
};

export const fetchLiveOffers = async () => {
  try {
    const res = await fetch(`${API_BASE}/offers`);
    const data = await res.json();
    if (res.ok && Array.isArray(data?.offers) && data.offers.length > 0) {
      return data.offers.map(mapOfferFromApi);
    }
  } catch {
    // Fallback gracefully to static data if backend is offline
  }
  return OFFERS_DATA;
};
