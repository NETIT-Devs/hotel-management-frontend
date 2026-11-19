/**
 * Public & Customer Facility Service
 * Communicates with /api/facilities for browsing resort facilities,
 * submitting slot reservations or event proposal inquiries, and managing
 * authenticated guest facility reservations.
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
 * Fetches all resort facilities from the live backend API.
 *
 * @returns {Promise<Array>} Normalized list of resort facilities
 */
export async function fetchPublicFacilities() {
  const res = await fetch(`${API_BASE}/facilities`);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to load resort facilities.');
  }
  return Array.isArray(data.facilities) ? data.facilities : [];
}

/**
 * Submits a facility slot reservation (Spa / Dining / Yacht) or an event proposal inquiry.
 * Automatically attaches JWT auth header when the guest is logged in.
 *
 * @param {object} payload - Reservation/inquiry request details
 * @returns {Promise<{ message: string, reservation: object }>}
 */
export async function createFacilityReservation(payload) {
  const res = await fetch(`${API_BASE}/facilities/reservations`, {
    method: 'POST',
    headers: getOptionalAuthHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to submit facility request.');
  }
  return data;
}

/**
 * Fetches facility reservations & event inquiries for the logged-in customer.
 *
 * @returns {Promise<Array>}
 */
export async function fetchMyFacilityReservations() {
  const token = localStorage.getItem('token');
  if (!token) return [];
  const res = await fetch(`${API_BASE}/facilities/reservations/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to load your facility reservations.');
  }
  return Array.isArray(data.reservations) ? data.reservations : [];
}

/**
 * Cancels an authenticated customer's facility reservation by ID.
 *
 * @param {number|string} reservationId
 * @returns {Promise<{ message: string }>}
 */
export async function cancelMyFacilityReservation(reservationId) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE}/facilities/reservations/${reservationId}/cancel`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to cancel facility reservation.');
  }
  return data;
}
