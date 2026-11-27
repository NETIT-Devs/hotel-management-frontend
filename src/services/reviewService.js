/**
 * Guest Reviews Service
 * Handles public verified reviews, homepage featured testimonials,
 * stay eligibility verification, and verified review submission.
 */
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getOptionalAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

/**
 * Fetch approved public reviews along with aggregate rating summary and room filters.
 *
 * @param {object} [filters]
 * @param {string|number} [filters.roomId]
 * @param {string|number} [filters.rating]
 * @param {'newest'|'highest'} [filters.sort]
 * @returns {Promise<{ reviews: Array, summary: object, rooms: Array }>}
 */
export async function fetchPublicReviews(filters = {}) {
  const params = new URLSearchParams();
  if (filters.roomId) params.set('roomId', String(filters.roomId));
  if (filters.rating) params.set('rating', String(filters.rating));
  if (filters.sort) params.set('sort', filters.sort);

  const query = params.toString();
  const res = await fetch(`${API_BASE}/reviews${query ? `?${query}` : ''}`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to load guest reviews.');
  }
  return data;
}

/**
 * Fetch featured approved reviews for the Home page Testimonials carousel.
 *
 * @returns {Promise<Array>}
 */
export async function fetchFeaturedReviews() {
  const res = await fetch(`${API_BASE}/reviews/featured`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to load featured reviews.');
  }
  return Array.isArray(data.reviews) ? data.reviews : [];
}

/**
 * Verify that a booking (via Booking Reference ID + Email or logged-in JWT)
 * is completed and eligible for a verified stay review.
 *
 * @param {{ bookingId: string|number, email?: string }} payload
 * @returns {Promise<{ eligible: boolean, booking: object }>}
 */
export async function verifyReviewEligibility(payload) {
  const res = await fetch(`${API_BASE}/reviews/verify-eligibility`, {
    method: 'POST',
    headers: getOptionalAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Could not verify booking eligibility.');
  }
  return data;
}

/**
 * Submit a verified stay review (saved as PENDING until approved by Admin).
 *
 * @param {object} payload
 * @returns {Promise<{ message: string, reviewId: number, status: string }>}
 */
export async function submitGuestReview(payload) {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: getOptionalAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to submit your review.');
  }
  return data;
}
